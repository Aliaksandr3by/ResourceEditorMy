//guide http://www.telerik.com/blogs/making-kendo-ui-binders-for-complex-types

//note .class doesn't work in ie8 
//https://github.com/airbnb/javascript/issues/61
kendo.data.binders['class'] = kendo.data.Binder.extend({
    init: function (target, bindings, options) {
        kendo.data.Binder.fn.init.call(this, target, bindings, options);
        // get list of class names from our complex binding path object
        this._lookups = [];
        for (var key in this.bindings['class'].path) {
            var initialKey = key;
            if (key.indexOf("_") > -1) key = key.replace(/_/g, "-");
            this._lookups.push({
                key: key,
                path: this.bindings['class'].path[initialKey]
            });
        }
    },

    refresh: function () {
        var lookup, value;

        for (var i = 0; i < this._lookups.length; i++) {
            lookup = this._lookups[i];
            // set the binder's path to the one for this lookup,
            // because this is what .get() acts on.
            this.bindings['class'].path = lookup.path;
            value = this.bindings['class'].get();

            // add or remove CSS class based on if value is truthy
            if (value) {
                $(this.element).addClass(lookup.key);
            } else {
                $(this.element).removeClass(lookup.key);
            }
        }
    }
});

kendo.data.binders.widget["class"] = kendo.data.binders["class"].extend({
    init: function (widget, bindings, options) {
        kendo.data.binders["class"].fn.init.call(this, widget.element[0], bindings, options);
    }
});

kendo.data.binders.widget.max = kendo.data.Binder.extend({
    refresh: function () {
        var that = this,
            value = that.bindings["max"].get();

        that.options.max = value;
    }
});

kendo.data.binders.widget.min = kendo.data.Binder.extend({
    refresh: function () {
        var that = this,
            value = that.bindings["min"].get();

        that.options.min = value;
    }
});

kendo.data.binders.chosen = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
        var parameters = { disable_search_threshold: 50 };

        var $elem = $(element),
            disableSearchThreshold = $elem.attr("data-disable-search-threshold"),
            placeholder = $elem.attr("data-placeholder");

        if (disableSearchThreshold) {
            parameters["disabled_search_threshold"] = disableSearchThreshold;
        }

        if (placeholder) {
            parameters["placeholder_text_multiple"] = placeholder;
            parameters["placeholder_text_single"] = placeholder;
        }

        $elem.chosen(parameters);
        var chosenData = $elem.attr('data-chosen');

        if (!_.isUndefined(chosenData))
            $elem.data().chosen.container.attr('data-bind', chosenData);
    },
    refresh: function () {
        var $element = $(this.element);
        _.defer(function () {
            $element.trigger("liszt:updated");
        });
    }
});

kendo.data.binders.chosenBinder = kendo.data.Binder.extend({
    refresh: function () {
        var $element = $(this.element);
        _.defer(function () {
            $element.trigger("liszt:updated");
        });
    }
});

kendo.data.binders.keypress = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
        var binding = this.bindings.keypress;
        $(element).bind("keypress", function (e) {
            if (e.which == 13) {
                binding.get();
            }
        });
    },
    refresh: function () { }
});

kendo.data.binders.widget.keypress = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        var element = widget.element[0];
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var binding = this.bindings.keypress,
            eventHandlerFunction = binding.source[this.bindings.keypress.path];

        $(element).bind("keypress", function (e) {
            _.defer(function () {
                eventHandlerFunction.call(binding.source, _.extend(e, { sender: widget }));
            });
        });
    },
    refresh: function () { }
});

kendo.data.binders.widget.readonly = kendo.data.Binder.extend({
    refresh: function () {
        var that = this,
            value = that.bindings["readonly"].get();
        if (_.isFunction(that.element.readonly)) {
            that.element.readonly(value);
        } else {
            if (value) {
                that.element.element.attr("readonly", "readonly");
            } else {
                that.element.element.removeAttr("readonly");
            }
        }
    }
});

kendo.data.binders.chosenUpdate = kendo.data.Binder.extend({
    refresh: function () {
        $(this.element).trigger('liszt:updated');
    }
});

kendo.data.binders.scannerDetection = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
        var binding = this.bindings.scannerDetection;

        var method = binding.source.get(binding.path);
        if (method)
            method.apply(binding.source, [element]);
    },
    refresh: function () { }
});

kendo.data.binders.showHideTooltip = kendo.data.Binder.extend({
    tippExists: function () {
        var element = this.element,
            tippedElement = Tipped.findElement(element);
        return tippedElement != undefined && tippedElement === element;
    },
    refresh: function () {
        var value = this.bindings.showHideTooltip.get(),
            element = this.element,
            tippExists = this.tippExists();

        if (tippExists) {
            if (value) {
                var tipp = Tipped.get(element);
                tipp.refresh();
                tipp.show();
            } else {
                Tipped.get(element).hide();
            }
        }
    }
});

kendo.data.binders.tooltip = kendo.data.Binder.extend({
    _options: {
        dataPrefix: "tooltip"
    },
    extractValueToShow: function () {
        return $(this.element).attr(this._options.dataPrefix + "-title");
    },
    instantlyShowTooltip: function () {
        var element = this.element,
            $el = $(element),
            doNotAutoShow = $el.attr(this._options.dataPrefix + "-instantly") === "true";
        return doNotAutoShow;
    },
    doAfter: function (tooltip) {

    },
    createTooltip: function () {
        var that = this;

        function createTipped() {
            var tipped = Tipped.create(element, title, {
                hook: hook || "rightmiddle",
                showOn: showOn || ["mouseover"],
                hideOn: hideOn || [{ element: "tooltip", event: "mouseleave" }, { element: "self", event: "mouseleave" }],
                onShow: onShow,
                onHide: onHide,
                closeButton: !doNotShowCloseButton,
                maxWidth: maxWidth,
                showDelay: showDelay,
                zIndex: zIndex,
                hideOthers: hideOthers || false
            });

            that.doAfter(tipped.items()[0]);

            if (showTooltipOnCreation) {
                tipped.show();
            }
        };

        var element = that.element,
            $el = $(element),
            showTooltipOnCreation = that.instantlyShowTooltip();
        // create new tooltip based on configuration attributes
        var zIndex,
            title = that.extractValueToShow(),
            prefix = that._options.dataPrefix,
            doNotShowCloseButton = $el.attr(prefix + "-no-close-button") === "true",
            hook = $el.attr(prefix + "-hook"),
            showOn = $el.attr(prefix + "-showOn"),
            hideOn = $el.attr(prefix + "-hideOn"),
            onShowAttr = $el.attr(prefix + "-onShow"),
            onShow = onShowAttr ? Function.bindScope(that.bindings[prefix].source[onShowAttr], that.bindings[prefix].source) : undefined,
            onHideAttr = $el.attr(prefix + "-onHide"),
            onHide = onHideAttr ? Function.bindScope(that.bindings[prefix].source[onHideAttr], that.bindings[prefix].source) : undefined,
            maxWidth = parseInt($el.attr(prefix + "-max-width")) || 500,
            showDelay = parseInt($el.attr(prefix + "-show-delay")) || 75,
            hideOthers = $el.attr(prefix + "-hideOthers");

        if (getHighestZIndex) {
            zIndex = getHighestZIndex();
        };
        // there is an issue in Firefox
        // if element for tooltip is not shown but tooltip is
        // there is a problem with remove of such tooltip
        // it's better to update to latest version of Tipped
        try {
            createTipped();
        } catch (err) {
            // workaround for FF issue
            createTipped();
        }
    },
    removeTooltip: function () {
        // Tipped.js has error in Firefox
        // this try..catch block is used to prevent error messege
        // to be shown in browser console
        try {
            Tipped.remove(this.element);
        } catch (err) {
        }
    },
    tippExists: function () {
        var element = this.element,
            tippedElement = Tipped.findElement(element);
        return tippedElement != undefined && tippedElement === element;
    },
    refresh: function () {
        var value = this.bindings.tooltip.get(),
            element = this.element,
            tippExists = this.tippExists(),
            showTooltipOnCreation = this.instantlyShowTooltip();

        if (value) {
            // if tooltip does not exist
            if (!tippExists) {
                // create new tooltip
                this.createTooltip();
                // otherwise if tooltip should be auto opened
            } else if (showTooltipOnCreation) {
                // show tooltip
                Tipped.get(element).show();
            }
        } else {
            // if tooltip exists
            if (tippExists) {
                // remove it
                this.removeTooltip();
            }
        }
    }
});

kendo.data.binders.dynamictooltip = kendo.data.binders.tooltip.extend({
    _options: {
        dataPrefix: "dynamictooltip"
    },
    doAfter: function (tooltip) {
        var that = this;
        _.defer(function () {
            var $element = $(tooltip.element),
                $tooltip = $(tooltip.container),
                prefix = that._options.dataPrefix,
                template = $element.attr(prefix + "-template"),
                source = $element.attr(prefix + "-data-source"),
                binding = that.bindings.dynamictooltip;

            if (template && source) {
                var sourceValue = binding.source[source];
                kendo.bind($tooltip, sourceValue);
                sourceValue.bind("change", function () {
                    tooltip.refresh();
                });
            }

            tooltip.refresh();
        });
    },
    extractValueToShow: function () {
        var that = this,
            $element = $(that.element),
            prefix = that._options.dataPrefix,
            template = $element.attr(prefix + "-template"),
            source = $element.attr(prefix + "-data-source"),
            binding = that.bindings.dynamictooltip,
            value = binding.get();
        if (template != null) {
            var sourceValue = binding.source[source || ""],
                templateValue = kendo.template($("#" + template).html());
            if (sourceValue != null) {
                return templateValue(sourceValue);
            } else {
                return templateValue({ value: value });
            }
        } else {
            return value;
        }
    },
    refresh: function () {
        var that = this,
            value = that.bindings.dynamictooltip.get(),
            element = that.element,
            $element = $(element),
            tippExists = that.tippExists(),
            prefix = that._options.dataPrefix,
            minValueLengthToShow = parseInt($element.attr(prefix + "-minlength-to-show")) || 0;

        if (value && value.length >= minValueLengthToShow || value === true) {
            // if tooltip exists
            if (tippExists) {
                // remove tooltip
                that.removeTooltip();
            }
            // create new tooltip
            that.createTooltip();
        } else {
            // if tooltip exists
            if (tippExists) {
                // remove it
                that.removeTooltip();
            }
        }
    }
});

kendo.data.binders.focus = kendo.data.Binder.extend({
    refresh: function () {
        var value = this.bindings.focus.get();

        if (value) {
            $(this.element).focus();
            this.bindings.focus.set(false);
        }
    }
});

// for kendo panel bar (allows select first tab by default)
kendo.data.binders.widget.selectFirst = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        this.widget = widget;
        var $selector = this.widget.element.find(">li:first");
        widget.select($selector);
        widget.expand($selector);
    },
    refresh: function () { }
});

kendo.data.binders.widget.availableTabs = kendo.data.Binder.extend({
    __processTabs: function () {
        if (!this.bindings.source) return;
        var availableTabs = this.bindings.availableTabs.get();
        var source = this.bindings.source.get();

        for (var i = 0; i < source.length; i++) {
            var $tab = this.widget.tabGroup.find(".k-item:eq(" + i + ")");

            if ($tab.length > 0) {
                if (availableTabs.indexOf(i) > -1) {
                    this.widget.enable($tab);
                    $tab.show();
                } else {
                    this.widget.disable($tab);
                    $tab.hide();
                }
            }
        }
    },
    init: function (widget, bindings, options) {
        /// <summary>
        /// Should contain an array with indexes of available tabs.
        /// Activates all available and deactivates the rest.
        /// </summary>
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        this.widget = widget;
        var that = this;
        _.defer(function () {
            that.__processTabs();
        });
    },
    refresh: function () {
        var that = this;
        _.defer(function () {
            that.__processTabs();
        });
    }
});

kendo.data.binders.widget.selectedTab = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        var that = this;
        this.widget = widget;
        this.widget.one("dataBound", function () {
            var firstAvailable = 0;
            if (that.bindings.availableTabs) {
                // can work with available tabs binding
                firstAvailable = that.bindings.availableTabs.get()[0];
            }

            widget.select(firstAvailable);
        });
        this.widget.bind("change", function () {
            if (bindings.selectedTab.get() >= 0) {
                bindings.selectedTab.set($(widget.select()[0]).index());
            }
        });
    },
    refresh: function () {
        var selectedTab = this.bindings.selectedTab.get();
        if (selectedTab >= 0) {
            this.widget.select(selectedTab);
        }
    }
});

// enables automatic text oeverflow: o
kendo.data.binders.textOverflow = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
        // get from markup max length to show
        this.maximumCharactersToShow = $(element).data("textoverflow-max-chars") || Number.MAX_VALUE;
    },
    refresh: function () {
        var that = this,
            value = that.bindings.textOverflow.get(),
            element = $(that.element),
            // if length of value is bigger than allowed length
            // dots should be shown
            showDots = value.length > that.maximumCharactersToShow;
        // get new value based on setting - if length is bigger than allowed
        // than get only first chars accordint to setting
        var newValue = value.substring(0, showDots ? that.maximumCharactersToShow : value.length);
        // add dots if required
        if (showDots) {
            newValue += "...";
        }
        // set new value into element
        element.text(newValue);
    }
});

// allows to recenter window on binded property change
kendo.data.binders.centerKendoWindow = kendo.data.Binder.extend({
    refresh: function () {
        var that = this,
            // this line is required for correct binding
            value = this.bindings.centerKendoWindow.get(),
            $element = $(that.element),
            $kendoWindow = $element.closest(".k-window-content");
        // if kendo window element is not available
        if (!$kendoWindow.length) {
            // do nothing
            return;
        }
        var windowObject = $kendoWindow.data("kendoWindow");
        // if kendo window object is not available
        if (windowObject == null) {
            // do nothing
            return;
        }
        // call center method
        _.delay(function () { windowObject.center(); }, 50);
    }
});

kendo.data.binders.fixOverlay = kendo.data.Binder.extend({
    refresh: function () {
        var that = this,
            // this line is required for correct binding
            value = this.bindings.fixOverlay.get(),
            $element = $(that.element),
            $kendoWindow = $element.closest(".k-window-content");
        // if kendo window element is not available
        if (!$kendoWindow.length) {
            // do nothing
            return;
        }
        // call adjust overlay method
        _.delay(function () { adjustWindowOverlay($kendoWindow) }, 50);
    }
});

kendo.data.binders.isChosenDisabled = kendo.data.Binder.extend({
    refresh: function () {
        /// <summary>
        /// Sets/unsets the chosen dropdown to disabled state
        /// </summary>
        var value = this.bindings.isChosenDisabled.get(),
            chosen = $(this.element).data().chosen;

        if (chosen) {
            chosen.is_disabled = value;
        }
    }
});

kendo.data.binders.loading = kendo.data.Binder.extend({
    _$selector: null,
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var $el = $(element),
            $sel = $el.find($el.data("loading-selector"));

        this._$selector = $sel.length ? $sel : $el;
    },
    refresh: function () {
        var value = this.bindings.loading.get();

        kendo.ui.progress($(this._$selector), value);
    }
});

kendo.data.binders.widget.loading = kendo.data.binders.loading.extend({
    init: function (widget, bindings, options) {
        kendo.data.binders.loading.fn.init.call(this, widget.element[0], bindings, options);
    },
});

kendo.data.binders.formEvents = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        /// <summary>
        /// Bind events to form (instead of Ajax.Begin form events)
        /// Event names are the same as in ajax request (beforeSend, success, error)
        /// This binder uses standard kendo events binder to bind functions
        /// </summary>
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var events = { beforeSend: "beforeSend", success: "success", error: "error" };

        $(element).submit(function () {
            $.ajax({
                url: this.action,
                type: this.method,
                data: $(this).serializeArray(),
                beforeSend: function () {
                    $(element).trigger(events.beforeSend);
                },
                success: function (result) {
                    $(element).trigger(events.success, [result]);
                },
                error: function (err) {
                    $(element).trigger(events.error, [err]);
                }
            });
            return false;
        });
    },
    refresh: function () { }
});

kendo.data.binders.appendContent = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        /// <summary>
        /// Append additional content to the element & binds source to the template (using data-template)
        /// Can be used in cases when standard generation is used for an element and can't be customized (for example: links in tabstrip)
        /// </summary>
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var $element = $(this.element),
            template = $element.attr("data-template");

        var $template = $("#" + template);

        $element.append($template.html());

        kendo.bind($element.children().last(), this.bindings.appendContent.source);
    },
    refresh: function () { }
});

kendo.data.binders.numberMask = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        /// <summary>
        /// Initialize numberMask feature on element
        /// Data parameters: data-type, data-before-point, data-after-point, data-default-value-input, data-pattern, data-mask-class
        /// </summary>
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var $element = $(this.element),
            type = $element.attr("data-type"),
            beforePoint = $element.attr("data-before-point"),
            afterPoint = $element.attr("data-after-point"),
            defaultValueInput = $element.attr("data-default-value-input"),
            patternAttr = $element.attr("data-pattern"),
            pattern = patternAttr
                ? new RegExp($element.attr("data-pattern"))
                : patternAttr,
            additionalClasses = $element.attr("data-mask-class");

        $element.numberMask({
            type: type,
            beforePoint: beforePoint,
            afterPoint: afterPoint,
            defaultValueInput: defaultValueInput,
            pattern: pattern
        }).addClass(additionalClasses);
    },
    refresh: function () { }
});

kendo.data.binders.widget.fContentClass = kendo.data.binders.class.extend({
    init: function (widget, bindings, options) {
        var newElem = $(widget.element).parents(".f-content")[0];

        if (!bindings.class) {
            bindings.class = bindings.fContentClass;
        } else {
            bindings.class.path.concat(bindings.fContentClass.path);
        }

        kendo.data.binders.class.call(this, newElem, bindings, options);
    }
});

kendo.data.binders.cssState = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var target = $(element);
        // convert the data-css-states 
        // string to JSON and parse it for use
        // when refresh happens.

        var statePairs = target.data().cssStates.split(","),
            ar = [];

        for (var e = 0; e < statePairs.length; e++) {
            var pair = statePairs[e].split(":");
            ar.push(
                kendo.format("\"{0}\":\"{1}\"",
                    pair[0].trim(),
                    pair[1].trim()
                )
            );
        }
        this.states = JSON.parse(kendo.format("{{0}}", ar.join(","))
        );
    },
    refresh: function () {
        var target = $(this.element);
        for (var removeCss in this.states) {
            target.removeClass(this.states[removeCss]);
        }
        var setCss = this.states[this.bindings.cssState.get()];
        target.addClass(setCss);
    }
});

kendo.data.binders.widget.bindGridClassesFunctionality = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        if (widget) {
            var template = widget.element.data("template"),
                useNames = widget.element.data("useNames");

            for (var i = 0; i < widget.options.columns.length; i++) {
                var item = widget.options.columns[i],
                    column = widget.columns[i];

                var newClass = template.format(useNames ? item.field : widget.columns.indexOf(item));
                if (!item.headerAttributes) {
                    item.headerAttributes = { "class": "" };
                }

                item.headerAttributes.class += " " + newClass;
                column.headerAttributes = item.headerAttributes;

                if (!item.attributes) {
                    item.attributes = { "class": "" };
                }

                item.attributes.class += " " + newClass;
                column.attributes = item.attributes;
            }

            widget.setOptions(widget.options);

            widget.thead.find("th").each(function (i) {
                if (widget.columns[i].headerAttributes.class) {
                    this.className = widget.columns[i].headerAttributes.class;
                }
            });

            widget.bindGridClassesFunctionality(template, useNames);
        }

        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
    },
    refresh: function () { }
});

kendo.data.binders.widget.selectedRow = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        this.widget = widget;
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
    },
    refresh: function () {
        var selectedRow = this.bindings.selectedRow.get();

        if (selectedRow > -1 && this.widget.dataSource._data.length > selectedRow) {
            this.widget.select(this.widget.items(selectedRow));
        } else {
            if (this.widget.select().length > 0) {
                this.widget.clearSelection();
            }
        }
    }
});

kendo.data.binders.widget.clearAutocomplete = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        /// <summary>
        /// Is used to clear the autocomplete input and fire change event
        /// NOTE: standard value binding doesn't fire change event and that cause issues sometimes
        /// </summary>
        this.widget = widget;
        this.firstCall = true;
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
    },
    refresh: function () {
        // please don't remove unused declaration, it's needed to fire the change event on the binding
        var value = this.bindings.clearAutocomplete.get();
        if (this.firstCall) {
            this.firstCall = false;
            return;
        }
        this.widget.value("");
        this.widget._old = "";
        this.widget._prev = "";
        this.widget.trigger("change");
    }
});


kendo.data.binders.widget.appendAfter = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        /// <summary>
        /// Append additional content to widgets, right after the initial item of the widget
        /// </summary>
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);

        var $element = $(this.element),
            template = $element.attr("data-custom-template");

        var $template = $("#" + template);

        var $elem = $element.after($template.html()).next(),
            model = this.bindings.appendAfter.get();

        // assign widget object to the binding model to be able to use it
        model.Widget = widget;

        kendo.bind($elem, model);
    },
    refresh: function () { }
});

kendo.data.binders.widget.initialValue = kendo.data.Binder.extend({
    isValid: false,
    init: function (widget, bindings, options) {
        /// <summary>
        /// Adjusts default values in the autocomplete
        /// NOTE: used in cases when autocomplete is used not only as autocomplete, but also as input
        /// using autocomplete as input causes issues when try to change value from full to empty (change isn't triggered)
        /// </summary>
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);

        this.isValid = widget instanceof kendo.ui.AutoComplete;
        this.widget = widget;

        if (this.isValid) {
            var value = this.bindings.initialValue.get();
            widget.value(value);
            widget._old = value;
            widget._prev = value;
        }
    },
    refresh: function () { }
});

kendo.data.binders.widget.resetValue = kendo.data.Binder.extend({
    isValid: false,
    init: function (widget, bindings, options) {
        /// <summary>
        /// Resets the value of kendo autocomplete
        /// </summary>
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);

        this.isValid = widget instanceof kendo.ui.AutoComplete;
        this.widget = widget;
    },
    refresh: function () {
        var value = this.bindings.resetValue.get();
        if (this.isValid) {
            this.widget.value("");
            this.widget._old = "";
            this.widget._prev = "";
            $(this.widget.ul.children()).removeClass("k-state-selected k-state-focused");
        }
    }
});

kendo.data.binders.dynamicText = kendo.data.Binder.extend({
    changeText: function ($target) {
        var state = this.bindings.dynamicText.get();

        var stateText = $target.data()[state];

        if (stateText) {
            $target.text(stateText);
        }
    },
    init: function (element, bindings, options) {
        /// <summary>
        /// Allows change textes on fly
        /// Value of the binding should be equal to the data attrbute name, then text from attribute will be filled into the element
        /// </summary>
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        this.changeText($(element));
    },
    refresh: function () {
        this.changeText($(this.element));
    }
});

kendo.data.binders.widget.dynamicText = kendo.data.binders.dynamicText.extend({
    init: function (widget, bindings, options) {
        /// <summary>
        /// Add dynamicText binding for the widgets
        /// </summary>
        kendo.data.binders.dynamicText.fn.init.call(this, widget.element[0], bindings, options);
    }
});

kendo.data.binders.dynamicTitle = kendo.data.Binder.extend({
    changeTitle: function ($target) {
        var state = this.bindings.dynamicTitle.get();

        var stateTitle = $target.data()[state];

        if (stateTitle) {
            $target.attr("title", stateTitle);
        }
    },
    init: function (element, bindings, options) {
        /// <summary>
        /// Allows to change title on fly
        /// </summary>
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
    },
    refresh: function () {
        this.changeTitle($(this.element));
    }
});

kendo.data.binders.widget.dynamicTitle = kendo.data.binders.dynamicTitle.extend({
    init: function (widget, bindings, options) {
        /// <summary>
        /// Dynamic title implementation for widgets
        /// </summary>
        kendo.data.binders.dynamicTitle.fn.init.call(this, widget.element[0], bindings, options);
    }
});

kendo.data.binders.errorTooltip = kendo.data.Binder.extend({
    tooltipText: "TooltipText",
    tooltip: null,
    init: function (element, bindings, options) {
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var errorTooltip = this.bindings.errorTooltip,
            that = this;

        this.tooltip = Tipped.create(element, this.tooltipText = $(element).data("tooltip-text"), {
            hideOn: false,
            hideAfter: 100,
            showOn: false,
            skin: "custom_error_skin"
        });

        $(element).mouseover(function () {
            if (errorTooltip.get()) {
                that.tooltip.show();
            }
        });

        $(element).mouseleave(function () {
            if (errorTooltip.get()) {
                that.tooltip.hide();
            }
        });
    },
    refresh: function () {
        var value = this.bindings.errorTooltip.get();

        if (!value) {
            this.tooltip.hide();
        }
    }
});

kendo.data.binders.widget.errorTooltip = kendo.data.binders.errorTooltip.extend({
    init: function (widget, bindings, options) {
        kendo.data.binders.errorTooltip.fn.init.call(this, widget.element[0], bindings, options);
    }
});

kendo.data.binders.widget.inactiveWrapper = kendo.data.Binder.extend({
    inactiveClass: "inactive-autocomplete",
    init: function (widget, bindings, options) {
        if (widget instanceof kendo.ui.AutoComplete) {

            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);

            this.Widget = widget;
        }
    },
    refresh: function () {
        if (this.bindings.inactiveWrapper.get()) {
            if (this.Widget.element[0] !== document.activeElement) {
                this.Widget.wrapper.addClass(this.inactiveClass);
            }
        } else {
            this.Widget.wrapper.removeClass(this.inactiveClass);
        }
    }
});

kendo.data.binders.inputTrimChange = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        /// <summary>
        /// This binding adds a change event which trims input values
        /// -------------------------------------------------------------------
        /// Binding parameter should be the same as the value binding parameter
        /// -------------------------------------------------------------------
        /// NOTE: it's better to place this binding as the last one (or after events bindings), because other change events can
        /// affect the value as well
        /// </summary>
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var binding = bindings.inputTrimChange,
            path = binding.path;

        if (path) {
            $(element).change(function (e) {
                var value = e.currentTarget.value.trim();
                if (!_.isUndefined(value)) {
                    e.currentTarget.value = value;
                    binding.source[path] = value;
                }
            });
        }
    },
    refresh: function () { }
});

kendo.data.binders.widget.inputTrimChange = kendo.data.binders.inputTrimChange.extend({
    init: function (widget, bindings, options) {
        kendo.data.binders.inputTrimChange.fn.init.call(this, widget.element[0], bindings, options);
    }
})

kendo.data.binders.widget.focus = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        widget.element.focus(function () {
            bindings.focus.get();
        });
    },
    refresh: function () {
    }
});

// allows to open and center kendo window
kendo.data.binders.widget.windowVisible = kendo.data.Binder.extend({
    refresh: function () {
        var that = this,
            // this line is required for correct binding
            value = that.bindings.windowVisible.get();

        // get window object from element prop
        var windowObject = that.element;

        // check is our element a window
        if (!(windowObject instanceof kendo.ui.Window)) {
            // if not do nothing
            return;
        }

        if (value) {
            // open and center the window
            windowObject.center().open();
        } else {
            // close the window
            windowObject.close();
        }
    }
});

kendo.data.binders.widget.customGridSortFilter = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);

        if (widget instanceof kendo.ui.Grid) {
            var headerModel = widget._headerModel = new kendo.data.ObservableObject({});
            kendo.bind(widget.thead, headerModel);

            _.defer(function () {
                widget.element.customGridSortFilter();
            });
        }
    },
    refresh: function () { }
});

kendo.data.binders.jHtml = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        /// <summary>
        /// build method html uses innerHtml from DOM objects
        /// this one uses jquery html method to insert html (used when not html is inserted, but scripts as well)
        /// note: standard html binding doesn't triggers scripts inside
        /// </summary>
        kendo.data.Binder.fn.init.call(this, element, bindings, options);
    },
    refresh: function () {
        var value = this.bindings.jHtml.get();

        $(this.element).html(value || "");
    }
});


kendo.data.binders.init = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        /// <summary>
        /// This bindings allows to assign init functions to initialize any custom widget without refering 
        /// any jquery selector directly.
        /// Element selector will be passed as parameter
        /// E.g. Folder tree, etc.
        /// </summary>
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var binding = bindings.init,
            handler = binding.source[binding.path];

        if (!_.isFunction(handler)) throw "binding should refer to a function";

        handler.call(binding.source, $(element));
    },
    refresh: function () { }
});

kendo.data.binders.widget.init = kendo.data.Binder.extend({
    init: function (widget, bindings, options) {
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);

        var binding = bindings.init,
            handler = binding.source[binding.path];

        if (!_.isFunction(handler)) throw "binding should refer to a function";

        handler.call(binding.source, widget);
    },
    refresh: function () { }
});

kendo.data.binders.boolChecked = kendo.data.Binder.extend({
    init: function (element, bindings, options) {
        /// <summary>
        /// This bindings allows to assign init functions to initialize any custom widget without refering 
        /// any jquery selector directly.
        /// Element selector will be passed as parameter
        /// E.g. Folder tree, etc.
        /// </summary>
        kendo.data.Binder.fn.init.call(this, element, bindings, options);

        var that = this;

        $(element).change(function () {
            var boolChecked = that.bindings.boolChecked;

            var value = this.value === "true";

            boolChecked.set(value);

            var path = boolChecked.path.split(".");
            var source = boolChecked.source[boolChecked.path] || boolChecked.source;

            for (var i = 0; i < path.length - 1; i++) {
                source = source[path[i]];
            }

            source[path[path.length - 1]] = value;
        });
    },
    refresh: function () {
        var value = this.bindings.boolChecked.get();

        $(this.element).attr("checked", this.element.value === value.toString());
    }
});

kendo.data.binders.widget.initChartTooltip = kendo.data.Binder.extend({
    init: function(widget, bindings, options) {
        kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        var events = widget._events;
        var eventHolder = this.bindings.initChartTooltip.get();
        if (!events || !eventHolder.bind) return;
        for (var func in events) {
            if (events[func] && events[func].length) {
                eventHolder.bind(func, events[func][0]);
            }
        }
    },
    refresh: function () { }
});