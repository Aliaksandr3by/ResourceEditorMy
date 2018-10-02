(function ($) {

    var CHANGEEVENT = "change";

    var CustomCheckbox = kendo.ui.Widget.extend(
    {
        init: function(element, options) {
            // base call to initialize widget
            var that = this,
                $element = $(element);
            kendo.ui.Widget.fn.init.call(that, element, options);
            $element.addClass("check_copy_record checkbox-element");
            $element.click(function(e) { $.proxy(that._click, that)(e, $element); });
        },

        options:
        {
            name: "customcheckbox",
            id: "id"
        },

        events: [CHANGEEVENT],

        value: function(value) {
            var $element = $(this.element);
            if (value != null) {
                $element.toggleClass("selected", value);
            } else {
                return $element.hasClass("selected");
            }
        },

        _click: function(e, $checkBox) {
            var that = this;
            $checkBox.toggleClass("selected");
            that.trigger(CHANGEEVENT);
            e.stopImmediatePropagation();
        }
    });
    kendo.ui.plugin(CustomCheckbox);

})(jQuery);