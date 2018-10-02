(function(name) {
    
    function getData(selector) {
        var $grid = $(selector);
        if ($grid.length) {
            return $grid.data("kendoGrid");
        }
    }

    function refreshKendoGrid(selector) {
        var $grid = $(selector);
        if ($grid.length) {
            var gridData = getData($grid);
            gridData.dataSource.read();
            gridData.refresh();
        }
    }
    
    function filter(selector, filters) {
        var $grid = $(selector);
        if ($grid.length) {
            var gridData = getData($grid);
            gridData.dataSource.filter(filters);
        }
    };

    this[name] = {
        refreshKendoGrid: refreshKendoGrid,
        filter: filter
    };
}("kendoGridAPI"));