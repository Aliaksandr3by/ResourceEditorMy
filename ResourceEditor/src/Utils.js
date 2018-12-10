export function AjaxPOST(url, object, success, error) {
    const xhr = new window.XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.timeout = 5000;
    xhr.ontimeout = () => {
        console.error("Request did not return i n а second.");
    };
    xhr.send(JSON.stringify(object));
    xhr.addEventListener("load", (e) => {
        const that = e.target;
        if (that.status >= 200 && that.status < 300 || that.status === 304) {
            success(JSON.parse(that.responseText));
        }
    }, false);
    xhr.addEventListener("error", (e) => {
        const that = e.target;
        error(that);
    }, false);
}

/**
 * Ajax function
 * @param {string} url адрес контроллера
 * @param {object} object содержит идентификатор language языка
 * @returns {Promise} object
 */
export function AjaxPOSTAsync(url, object) {
    return new Promise((resolve, reject) => {
        const xhr = new window.XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.responseType = 'json';
        xhr.onload = (e) => {
            const that = e.target;
            if (that.status >= 200 && that.status < 300 || that.status === 304) {
                //resolve(JSON.parse(xhr.responseText));
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        if (object) {
            xhr.send(JSON.stringify(object));
        }
        else {
            xhr.send();
        }
    });
}


export function AjaxPOSTAsyncFileSend(url, objectFiles) {
    return new Promise((resolve, reject) => {

        const data = new window.FormData(); //с encoding установленным в "multipart/form-data".
        const files = window.document.getElementById(objectFiles).files;

        for (let i = 0; i < files.length; i++) {
            data.append(`uploads[${i}]`, files[i], files[i].name);
        }

        const xhr = new window.XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.responseType = 'json';
        xhr.onload = (e) => {
            const that = e.target;
            if (that.status >= 200 && that.status < 300 || that.status === 304) {
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(data);
    });
}