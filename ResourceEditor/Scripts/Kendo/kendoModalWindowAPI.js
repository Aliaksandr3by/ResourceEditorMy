//open kendo window with specified content and params
//required params - url or content, title; additional params - height, width, selector, iframe
function openKendoWindow(options) {
    var kendoModalWindowSelector = $(options.selector || "#kendoModalWindow");
    var kendoModalWindow = kendoModalWindowSelector.data("kendoWindow"),
        defaultHeight = "auto",
        defaultWidth = "auto";

    function bindHandler(event, handlerName) {
        unbindHandler(event, handlerName);

        var handler = options[handlerName];
        if (!_.isFunction(handler)) {
            return;
        }
        kendoModalWindowSelector.data(handlerName, handler);
        kendoModalWindow.bind(event, handler);
    }

    // unbinding event if there is already attached
    function unbindHandler(event, handlerName) {
        var handler = kendoModalWindowSelector.data(handlerName);
        if (_.isFunction(handler)) {
            kendoModalWindow.unbind(event, handler);
        }
    }
    
    if (options.showModal == false) {
        kendoModalWindow.options.modal = false;
    }

    //set default w/h for window wrapper, to prevent previous size
    kendoModalWindow.wrapper.width(defaultWidth).height(defaultHeight);

    var maxWidth = options.maxWidth || defaultWidth;

    kendoModalWindow.setOptions({
        iframe: options.iframe || false,
        minHeight: 49,
        // do not change
        maxWidth: options.maxWidth,
        height: options.height || defaultHeight,
        // do not change
        maxHeight: options.height,
        resizable: options.resizable || false
    });

    kendoModalWindow.element.parent().css("max-width", maxWidth);
    if (options.setClassToKWindow) {
        var $kWindow = $(kendoModalWindow.element.parent());
        $kWindow.addClass(options.setClassToKWindow);
    } 
    if (options.width) kendoModalWindow.setOptions({ width: options.width });
    if (typeof (options.modal) != "undefined") kendoModalWindow.setOptions({ modal: options.modal });
    //Triggered when a Window is closed (by a user or through the close() method).
    bindHandler('close', 'closeHandler');
    //Triggered when a Window has finished its opening animation.
    bindHandler('activate', 'activateHandler');
    //Triggered when a Window is opened
    bindHandler('open', 'openHandler');
    //Triggered when the content of a Window has finished loading via AJAX, when the window iframe has finished loading, 
    //or when the refresh button has been clicked on a window with static content.
    bindHandler('refresh', 'refreshHandler');
 
    if (options.url) {
        kendoModalWindow.content('<div class = "k-loading-image"></div>');
        var data = options.data,
            newUrl = options.url,
            type = options.type,
            contentType = options.contentType,
            dataType = options.dataType,
            template = options.template;
        kendoModalWindow.refresh({
            url: newUrl,
            data: data,
            type: type,
            contentType: contentType,
            dataType: dataType,
            template: template
        });
    }
    if (options.content) kendoModalWindow.content(options.content);
    if (options.title || options.title == '') kendoModalWindow.title(options.title);
    if (options.contentAction) options.contentAction(kendoModalWindowSelector, kendoModalWindow);
    if (options.visibleOverflow) kendoModalWindowSelector.addClass("mw-visible");
    if (options.zIndex) {
        var $parent = kendoModalWindowSelector.parent();
        $parent.attr("style", $parent.attr("style") + "; z-index: " + options.zIndex + " !important;");
    }
    kendoModalWindow.open();
    if (options.position) {
        var $parent = kendoModalWindowSelector.parent();
        $parent.attr("style", $parent.attr("style") + "; top: " + options.position.top + "; left: " + options.position.left);
    }
    else {
        kendoModalWindow.center();
    }
    if (!options.content && !options.url && !options.visibleOverflow) {
        kendoModalWindowSelector.css("visibility", "visible");
    }

    //resize function, fix for old kendo, only for  kendoModalWindow
    if (kendoModalWindowSelector.is("#kendoModalWindow")) {
        var resizeElements = kendoModalWindow.element.siblings('.k-resize-handle'),
            resizeTemplate =
                '<div class="k-resize-handle k-resize-n"></div>' +
                    '<div class="k-resize-handle k-resize-e"></div>' +
                    '<div class="k-resize-handle k-resize-s"></div>' +
                    '<div class="k-resize-handle k-resize-w"></div>' +
                    '<div class="k-resize-handle k-resize-se"></div>' +
                    '<div class="k-resize-handle k-resize-sw"></div>' +
                    '<div class="k-resize-handle k-resize-ne"></div>' +
                    '<div class="k-resize-handle k-resize-nw"></div>';
        options.resizable ? kendoModalWindow.element.after(resizeTemplate) : resizeElements.remove();
    }

    if(options.preventDoubleClick){
        preventWindowDoubleClick(kendoModalWindow.wrapper);
    }

    toggleActionButtons(kendoModalWindow.wrapper, options);

    return kendoModalWindow;
}

function toggleActionButtons($window, options) {
    //hide maximize, minimize and close buttons
    var actionbuttons = $window.find(".k-window-action");
    if (options.hideActionButtons) {
        actionbuttons.css("visibility", "hidden");
    } else {
        actionbuttons.css("visibility", "visible");
    }
}

function preventWindowDoubleClick($window) {
    $window.children('.k-window-titlebar:first-child').dblclick(function (e) {                           
            e.preventDefault();
            return false;
        });
}

//close modal window
function closeKendoWindow(selector) {
    if (typeof selector === "string") {
        selector = $(selector);
    }
    var kendoModalWindowSelector = selector || kendoModalWindow;
    var kendoWindow = kendoModalWindowSelector.data('kendoWindow');
    if (kendoWindow) {
        kendoWindow.close();
    }
    if (commonData) commonData.switchDocumentViewStubInIe();
}

//Refresh Event handler for kendoModalWindow 
function onRefreshKendoWindow(e) {
    var windowData = e.sender,
        kendoModalWindowSelector = windowData.element || kendoModalWindow;
    kendoModalWindowSelector.find(".k-window").height("");
    /*var handler = kendoModalWindowSelector.data("refreshHandler");
    if (typeof handler == "function") {
        handler(e);
    }*/
    windowData.center();
}

function centerKendoWindow(selector) {
    var kendoModalWindow = $(selector || '#kendoModalWindow').data("kendoWindow");
    kendoModalWindow.center();
}

//Close Event handler for kendoModalWindow 
function onCloseKendoModalWindow(selector) {

    function unbindHandler(event, handler) {
        if (!_.isFunction(handler)) {
            return;
        }
        kendoModalWindowSelector.data("kendoWindow").unbind(event, handler);
    }

    var kendoModalWindowSelector = selector.sender.element || kendoModalWindow,
        kendoModalWindow = kendoModalWindowSelector.data("kendoWindow"),
        closeHandler = kendoModalWindowSelector.data("closeHandler"),
        activateHandler = kendoModalWindowSelector.data("activateHandler"),
        refreshHandler = kendoModalWindowSelector.data("refreshHandler");
    kendoModalWindowSelector.removeClass("mw-visible");
    kendoModalWindowSelector.css("overflow", "");
    unbindHandler('close', closeHandler);
    unbindHandler('activate', activateHandler);
    unbindHandler("refreshHandler", refreshHandler);
    //clear url and remove iframe before closing window. Prevents bugs in safari and chrome.
    kendoModalWindowSelector.find(".k-window iframe").attr("src", "").remove();
    kendoModalWindowSelector.css("z-index", "");
    kendoModalWindowSelector.css("max-height", "");
    kendoModalWindowSelector.css("max-width", "");
    kendoModalWindow.setOptions({ width: "auto" });
    kendoModalWindow.setOptions({ modal: true });
    kendoModalWindow.element.parent().removeClass("min-square");
    kendoModalWindow.element.parent().removeClass("notes-resize");
    kendoModalWindow.element.parent().removeClass("notes-resize-rf");
}

function setKendoWindowTitle(selector, title) {
    var kendoModalWindowSelector = $(selector || "#kendoModalWindow"),
        kendoModalWindow = kendoModalWindowSelector.data("kendoWindow");
    if (title) kendoModalWindow.title(title);
}

//params: title, note, msg
function openKendoNoteModalWindow(options) {
    var window = noteKendoModalWindowSelector.data('kendoWindow');
    if (!options.title)
        options.title = messages.note;
    window.title(options.title);
    $("span", noteKendoModalWindowSelector).text(options.msg);
    window.center().open();
}

//open confirmation modal window
//params include: title, msg(message in the window), deletingItemName, onSubmitFunction, closeHandler, 
//confirmBtnText(default is Yes), cancelBtnText (default is Cancel)
function openKendoConfirmationWindow(options) {
    var kendoModalWindowSelector = kendoConfirmWindow,
        kendoModalWindow = kendoModalWindowSelector.data("kendoWindow");

    function bindHandler(event, handlerName) {
        unbindHandler(event, handlerName);

        var handler = options[handlerName];
        if (!_.isFunction(handler)) {
            return;
        }
        kendoModalWindowSelector.data(handlerName, handler);
        kendoModalWindow.bind(event, handler);
    }

    // unbinding event if there is already attached
    function unbindHandler(event, handlerName) {
        var handler = kendoModalWindowSelector.data(handlerName);
        if (_.isFunction(handler)) {
            kendoModalWindow.unbind(event, handler);
        }
    }

    if (!options.title) options.title = 'Are you sure?';
    kendoModalWindow.title(options.title);

    var titleElement = $(".simple-text", kendoModalWindowSelector);
    var message = options.msg + " ";
    if (options.isHtml) {
        titleElement.html(message);
    } else {
        titleElement.text(message);
    }
    if (options.deletingItemName != undefined) {
        $(".simple-names", kendoModalWindowSelector).show().text(options.deletingItemName);
    } else {
        $(".simple-names", kendoModalWindowSelector).hide();
    }

    kendoModalWindowSelector.width(options.width || "auto");

    if (options.visibleOverflow) kendoModalWindowSelector.addClass("mw-visible");

    //set cancel button text
    var $cancelBtn = $("#kendoCancelButton", kendoModalWindowSelector);
    if (options.cancelBtnText) $cancelBtn.text(options.cancelBtnText);

    //set confirm button text
    var $confirmBtn = $("#kendoConfirmationButton", kendoModalWindowSelector);
    if (options.confirmBtnText) $confirmBtn.text(options.confirmBtnText);

    if (typeof options.onSubmitFunction !== 'function') {
        $confirmBtn.hide();
    } else {
        $confirmBtn.show();
        $confirmBtn.off("click").on("click", function () { options.onSubmitFunction(); });
    }

    bindHandler('close', 'closeHandler');
    kendoModalWindow.center().open();

    toggleActionButtons(kendoModalWindow.wrapper, options);
}

function openKendoConfirmationWindowMvvm(model, params) {
    /// <summary>
    /// Open kendo confirmation window, set parameters and bind given model.
    /// Before binding the model will be extended with several useful methods:
    ///     _showLoading - show progress image
    ///     _hideLoading - hide progress image
    ///     _closeWindow - close this window completely (by given/default selector)
    /// </summary>
    /// <param name="model" type="type">Kendo observable object to bind to the window</param>
    /// <param name="params" type="type">Kendo window parameters (width, selector, etc.)</param>
    var kendoModalWindowSelector = params.selector || kendoConfirmationWindowMvvm,
        kendoModalWindow = kendoModalWindowSelector.data().kendoWindow;

    kendoModalWindow.title(model.Title);

    kendoModalWindowSelector.width(params.width || "auto");

    if (params.visibleOverflow) kendoModalWindowSelector.addClass("mw-visible");

    //window height removed for auto-resize
    kendoModalWindowSelector.css({ height: "" });

    _.extend(model, {
        _showLoading: function () {
            kendo.ui.progress(kendoModalWindowSelector, true);
        },
        _hideLoading: function () {
            kendo.ui.progress(kendoModalWindowSelector, false);
        },
        _closeWindow: function () {
            kendoModalWindow.close();
        }
    });

    kendo.bind(kendoModalWindowSelector, model);

    kendoModalWindow.center().open();
};

function showLoadingKendoConfirmationWindow() {
    kendo.ui.progress(kendoConfirmWindow, true);
}

function closeKendoConfirmationWindow() {
    kendoConfirmWindow.data("kendoWindow").close();
    removeConfirmationWindowLoading();
}

function removeConfirmationWindowLoading() {
    kendo.ui.progress(kendoConfirmWindow, false);
    if (commonData) commonData.switchDocumentViewStubInIe();
}

function popupWindowCallback(gridSelector, data) {
    if (data != null) {
        if (data.creationError) {
            openKendoNoteModalWindow({ msg: data.msg });
        } else {
            showSuccessMessage(data);
            closeKendoWindow();
            if (data.isUiLanguageChanged) {
                location.reload();
            } else {
                if (gridSelector) {
                    Rebind(gridSelector);
                }
            }
        }
    }
}

function adjustWindowOverlay($kendoWindow) {
    /// <summary>
    /// Sets correct zIndex for window using buildin _overlay function
    /// Note: overlay problems happen when two or more window are closed one after another
    /// </summary>
    /// <param name="$kendoWindow" type="jQuery">kendo window selector</param>
    var window = $kendoWindow.data().kendoWindow;

    window._overlay(true);
};

//TOD SM review if this method required
function setWidthAndOpenWindow($window) {
    var topLine = $window.find(".top-line2");
    var neededWidthOfContent = $window.find("table").width();
    if (topLine && neededWidthOfContent) {
        topLine.width(neededWidthOfContent);
        $window.width(topLine);
        $window.parent().width(topLine);
        $window.show();
        topLine.width($window.width());
    }
}