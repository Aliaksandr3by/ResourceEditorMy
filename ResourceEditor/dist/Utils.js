export const AjaxPOST = (url, object, success, error) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.timeout = 5000;
    xhr.ontimeout = () => {
        console.error("Request did not return i n а second.");
    };
    xhr.send(JSON.stringify(object));
    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            success(JSON.parse(xhr.responseText));
        }
    }, false);
    xhr.addEventListener("error", () => {
        error(xhr);
    }, false);
};
export const AjaxPOSTAsync = (url, object, method = "POST") => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.responseType = "json";
        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                if (typeof (xhr.response) === "string") {
                    resolve(JSON.parse(xhr.responseText));
                }
                if (typeof (xhr.response) === "object") {
                    resolve(xhr.response);
                }
            }
        });
        xhr.addEventListener("error", () => reject(xhr.statusText));
        if (object) {
            xhr.send(JSON.stringify(object));
        }
        else {
            xhr.send();
        }
    });
};
export const AjaxPOSTAsyncFileSend = (url, objectFiles) => {
    return new Promise((resolve, reject) => {
        const data = new FormData();
        const filesEl = document.getElementById(objectFiles);
        const files = filesEl ? filesEl.files : null;
        for (let i = 0; i < files.length; i++) {
            data.append(`uploads[${i}]`, files[i], files[i].name);
        }
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.responseType = "json";
        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                resolve(xhr.response);
            }
        });
        xhr.addEventListener("error", () => reject(xhr.statusText));
        xhr.send(data);
    });
};
export const getBrowserType = () => {
    const _userAgent = navigator.userAgent;
    const br = {
        "Chrome": "Chrome",
        "Edge": "Edge",
        "Firefox": "Firefox",
        ".NET CLR": "Internet Explorer 11",
    };
    const nobr = {
        "MSIE 10.0": "Internet Explorer 10",
        "MSIE 9.0": "Internet Explorer 9",
        "MSIE 8.0": "Internet Explorer 8",
        "MSIE 7.0": "Internet Explorer 7"
    };
    let thisBrow = "Unknown";
    for (const keys in br) {
        if (br.hasOwnProperty(keys)) {
            if (_userAgent.includes(keys)) {
                thisBrow = br[keys];
                for (const key in nobr) {
                    if (_userAgent.includes(key)) {
                        thisBrow = nobr[key];
                    }
                }
            }
        }
    }
    return thisBrow;
};
export const coreJs = () => {
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
    if ("NodeList" in window && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (let i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }
    if (!Element.prototype.matches)
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
            let el = this;
            if (!document.documentElement.contains(el))
                return null;
            do {
                if (el.matches(s))
                    return el;
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
//# sourceMappingURL=Utils.js.map