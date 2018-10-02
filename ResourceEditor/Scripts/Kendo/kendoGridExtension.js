$(function () {
    // extend for kendoGrid
    var plg = (function(init) {
        return kendo.ui.Grid.extend({
            init: function(element, options) {
                init.call(this, element, options);
            },
            // add classes to kendoGrid by class format (for example 'grid-column-{0}')
            addGridClasses: function(classFormat, useNames) {
                var $grid = $(this.element),
                    gridData = $grid.data().kendoGrid,
                    selectors = [
                        ".k-grid-header-wrap col",
                        ".k-grid-content col"
                    ],
                    i;

                useNames = useNames === "true" || useNames === true;
                // adding classes for header and content cols
                for (i = 0; i < selectors.length; i++) {
                    var columns = gridData.columns;
                    var $elems = $grid.find(selectors[i]).not(".k-hierarchy-cell, .k-hierarchy-col, .k-group-col");
                    var j = 0;
                    for (var k = 0; k < columns.length; k++) {
                        if (columns[k].hidden) continue;

                        var field = useNames
                            ? columns[k].field.replace(".", "-") // replace . with - (. cause incorrect class names to appear)
                            : k;

                        var postfix = classFormat.format(field);
                        $($elems[j]).removeClass().addClass(postfix);
                        j++;
                    }
                }

                adjustHeaderFilters(this);
            },
            adjustHeaderFilters: function() {
                adjustHeaderFilters(this);
            },
            bindGridClassesFunctionality: function (classTemplate, useNames) {
                var grid = this;

                var bindFunc = function() {
                    this.addGridClasses(classTemplate, useNames);
                };

                if (grid.dataSource._group.length > 0) {
                    grid.bind("dataBound", bindFunc);
                }

                grid.bind("columnShow", bindFunc);
                grid.bind("columnHide", bindFunc);
                grid.bind("columnReorder", bindFunc);

                _.defer(function() {
                    bindFunc.call(grid);
                });
            },
            customRead: function (removedCount) {
                /// <summary>
                /// Custom read method (use when update comes right after an delete action or 
                /// some other modification action that changes count of items in the grid)
                /// Note: please use top rows items as removedCount items (which are used to form total count)
                /// </summary>
                /// <param name="removedCount" type="type">Count of removed items</param>

                // if removed count isn't available or is 0 -> call base read
                if (_.isUndefined(removedCount) || removedCount === 0) {
                    this.dataSource.read();
                    return;
                }

                // take data count of items in grid and calculate new count
                var count = this.dataSource._data.length,
                    page = this.dataSource._page,
                    newCount = count - removedCount;

                // reduce current page if new data count is less or equal to 0 and page > one
                if (newCount <= 0 && page > 1) {
                    // call page method with reduced page
                    this.dataSource.page(page - 1);
                    return;
                }

                this.dataSource.read();
            }
        });
    })(kendo.ui.Grid.fn.init);
    kendo.ui.plugin(plg);
});

var addGridClassesEvent = function(selector, classFormat, useNames) {
    return function() {
        var $grid = $(selector).data("kendoGrid");
        $grid.addGridClasses(classFormat, useNames);
    };
};

var adjustHeaderFilters = function (grid) {
    var $thead = grid.thead;

    var $filter = $thead.find(".filter-line");
    if ($filter.length > 0) {
        var $headers = $thead.find("th"),
            heights = [];

        var $customHeaders = $headers.find(".f-header-custom").css("height", "");

        for (var j = 0; j < $headers.length; j++) {
            heights[j] = $customHeaders.eq(j).height();
        }

        var maxHeight = Math.max.apply(Math, heights);

        $customHeaders.height(maxHeight);
    }
};

var removeColspanAndCollapse = function(gridId) {
    var $grid = $(gridId),
        grid = $grid.data().kendoGrid,
        $groupingRows = $grid.find(".k-grouping-row"),
        $tds = $groupingRows.find("td:first-child");

    $tds.attr("colspan", 1);

    $groupingRows.each(function() { 
        grid.collapseGroup($(this));
    });
};

var markAsCustomGroupingGrid = function(grid) {
    grid.customGroupingApplied = true;
};

var addCollapseExpandAllBtn = function (grid, defaultState) {
    /// <summary>
    /// Add collapse / expand all button to presented grid (into k-group-cell)
    /// (Note: call should be during databound event)
    /// </summary>
    /// <param name="grid" type="type">Kendo grid object</param>
    /// <param name="defaultState" type="type">Default state of expand/collapse icon</param>
    var $header = grid.thead,
        $cell = $header.find(".k-group-cell.k-header"),
        $template = $("#collapse-expand-all-template"),
        model = new kendo.data.ObservableObject({
            ExpandCollapse: function () {
                var isExpanded = this.IsExpanded,
                    $tbody = grid.tbody;
                $.each($tbody.find("tr.k-grouping-row"), function() {
                    var $row = $(this);
                    if (isExpanded) {
                        grid.collapseGroup($row);
                    } else {
                        grid.expandGroup($row);
                    }
                });

                this.set("IsExpanded", !this.IsExpanded);
            },
            IsExpanded: defaultState,
            IsCollapsed: function() {
                return !this.get("IsExpanded");
            },
            SetDefault: function() {
                this.set("IsExpanded", defaultState);
            }
        });

    $cell.html($template.html());

    kendo.bind($cell, model);

    grid.expandCollapseModel = model;
};

// add template handler
window.Template = function (templateId) {
    /// <summary>
    /// Get kendo template using template id
    /// </summary>
    /// <param name="templateId" type="type">Template selector (with #)</param>
    /// <returns type="">Kendo template</returns>
    return kendo.template($(templateId).html());
};