
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

/**
 * Ajax function, only json return
 * @param {string} url адрес контроллера
 * @param {object} object содержит идентификатор language языка
 * @returns {Promise} object
 */
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
        } else {
            xhr.send();
        }
    });
};


export const AjaxPOSTAsyncFileSend = (url, objectFiles) => {
    return new Promise((resolve, reject) => {

        const data = new FormData(); //с encoding установленным в "multipart/form-data".
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
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3576.0 Safari/537.36"
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.17 Safari/537.36"
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763"
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0"
    // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko"
    // "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    // "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    // "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    // "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
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