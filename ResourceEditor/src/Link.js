const urlControlActionDelete = "/Home/Delete";
const urlControlActionUpdate = "/Home/Update";
const urlControlActionDataProtect = "/Home/DataProtect";
const urlControlSwitchLanguage = "/Home/SwitchLanguage";
const urlControlUploadFile = "/Home/UploadFile";
const urlControlGetFile = "/Home/GetFile";
const urlControlDeleteFile = "/Home/DeleteFile";
const urlControlSelectCountry = "/Home/SelectCountry";
const urlControlRead = "/Home/Read";
const urlControlLogFile = "/Home/LogFile";

const coreJs = () => {
    // <script src="~/node_modules/core-js/client/core.min.js"></script>
    // <script src="~/node_modules/core-js/client/library.min.js"></script>
    // <script src="~/node_modules/core-js/client/shim.min.js"></script>
    const _userAgent = navigator.userAgent;
    if (_userAgent.indexOf(".NET CLR") >= 0) {
        const script = [
            "/node_modules/core-js/client/core.min.js",
            "/node_modules/core-js/client/library.min.js",
            "/node_modules/core-js/client/shim.min.js",
        ];

        for (const key in script) {
            const scr = window.document.createElement("script");
            scr.src = script[key];
            const IE11 = window.document.getElementsByTagName("head")[0];
            IE11.appendChild(scr);
        }
    }

    //polyfill forEach
    if ("NodeList" in window && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (let i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    //polyfill matches
    if (!Element.prototype.matches)
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

    //polyfill closest
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
            let el = this;
            if (!document.documentElement.contains(el)) return null;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    const MSIE = _userAgent.indexOf("MSIE");
    if (MSIE >= 0) {
        document.execCommand("Stop");
        console.error(_userAgent);
    }
};

coreJs();


