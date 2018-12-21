
const browser = () => {
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

console.log(browser());

if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

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

function createRow$(data = {}, titleText = {}) {

    const inputDataKey = (className = "", value = "...", title = "...", purpose = "non") => {
        const createInput = window.document.createElement('input');
        createInput.className = className;
        createInput.value = value.Id;
        createInput.title = title.Id;
        createInput.readOnly = Boolean(String(value.Id).length > 0);
        createInput.setAttribute("data-purpose", purpose);
        return createInput;
    };

    const dataTextArea = (className = "", value = "...", title = "...", purpose = "non", readOnly = false) => {
        const input = window.document.createElement('textarea');
        input.className = className;
        input.readOnly = readOnly;
        input.value = value;
        input.title = title;
        input.setAttribute("data-purpose", purpose);
        return input;
    };

    const createButton = (className = "", purpose = "") => {
        const createButton = window.document.createElement('button');
        createButton.className = className;
        createButton.textContent = purpose;
        createButton.type = 'button';
        createButton.setAttribute("data-action", purpose);
        return createButton;
    };

    const tableBody = window.document.getElementById("mainTable");
    const rowTable = window.document.createElement("tr");
    tableBody.appendChild(rowTable);

    let lastTr = $("#mainTable").children("tbody").append(`<tr></tr>`).children("tr").last();
    lastTr.append("<th class='tabl-tbody-row el-01' aria-label='Key' scope='row'></th>").children("th").last().append(inputDataKey(`inputDataId ${titleText.Id ? "" : "error"}`, data, titleText, "Id"));
    lastTr.append("<td class='tabl-tbody-row el-02' aria-label='Value'></td>").children("td").last().append(dataTextArea("inputDataValue", data.Value, titleText.Value, "Value"));
    lastTr.append("<td class='tabl-tbody-row el-03' aria-label='Comment'></td>").children("td").last().append(dataTextArea("inputDataComment", data.Comment, titleText.Comment, "Comment"));
    lastTr.append("<td class='tabl-tbody-row el-04' data-label='Save'></td>").children("td").last().append(createButton("btn saveLineButton", data.Id === "" ? "Insert" : "Save"));
    lastTr.append("<td class='tabl-tbody-row el-05' data-label='Delete'></td>").children("td").last().append(createButton("btn deleteLineButton", "Delete"));
}

function createTable$(datum_tmp, titles_tmp) {

    let datum = datum_tmp;
    let titles = titles_tmp;

    if (typeof datum === 'string' && typeof titles === 'string') {
        datum = JSON.parse(datum_tmp);
        titles = JSON.parse(titles_tmp);
    }

    if (Array.isArray(datum) && Array.isArray(titles)) {
        for (let data of datum) {
            let _title = {};
            for (let title of titles) {
                if (data.Id === title.Id) {
                    _title = title;
                }
            }
            createRow$(data, _title);
        }
    } else if (typeof datum === "object" && typeof titles === "object") {
        createRow$(datum, titles);
    } else {
        console.error("unknown error ");
    }
}

const countryResolver = (data) => {
    let dataTmp = data;
    const countrySelecter = document.createElement('select');
    countrySelecter.className = `flex-container-element element-01`;
    countrySelecter.id = `countrySelect`;

    let opt = document.createElement("option");
    opt.text = "Select language";
    opt.disabled = true;
    countrySelecter.add(opt, null);
    let i = 1;
    if (!Array.isArray(dataTmp)) {
        dataTmp = JSON.parse(data);
    }
    Array.from(dataTmp).forEach((item) => {
        let opt = document.createElement("option");
        opt.className = ``;
        opt.value = item.Id;
        opt.text = `${i++}. ${item.Id} - ${item.Value}(${item.Comment})`;
        opt.selected = item.Id === window.localStorage.getItem("countrySelect");
        countrySelecter.add(opt, null);
    });

    return countrySelecter;
};

function GetCountrySet(langSet) {
    AjaxPOSTAsync(urlControlSelectCountry, null).then((data) => {
        const CountrySelect = window.document.getElementById("CountrySelect");
        if (data !== "" && CountrySelect) {
            let countrySelect = window.document.getElementById("countrySelect");
            if (countrySelect) {
                CountrySelect.replaceChild(countryResolver(data), countrySelect);
            } else {
                countrySelect = CountrySelect.insertBefore(countryResolver(data), CountrySelect[0]);
            }
            let lang = langSet || countrySelect.value || window.localStorage.getItem("countrySelect");
            CountrySelectUpdateSet(lang);
        } else {
            console.log("error");
        }
    }).catch((error) => {
        console.error(error);
    });
}

$("#ResourceUploads").on("click", null, () => {
    const fileUpload = document.querySelector(".fileUpload");

    const resultUpload = (respond = "", alert = "") => {
        const resultUpload = document.createElement('div');
        resultUpload.className = `${alert}`;
        resultUpload.textContent = `${respond}`;
        return resultUpload;
    };

    AjaxPOSTAsyncFileSend(urlControlUploadFile, "FileResource").then((respond) => {
        if (!respond.error && respond.fileName) {
            EmptyElement(fileUpload);
            fileUpload.appendChild(resultUpload(respond.fileName, "success"));
            GetCountrySet();
        } else {
            EmptyElement(fileUpload);
            fileUpload.appendChild(resultUpload(respond.error, "error"));
        }
    }).catch((error) => {
        console.error(error);
    });
});

$("#ResourceSave").on("click", null, null, () => {
    const lng = $("#countrySelect").val();
    $.ajax({
        type: "GET",
        url: urlControlGetFile,
        data: {
            language: $("#countrySelect").val()
        },
        success: (data) => {
            if (data !== "") {
                window.location.href = `${urlControlGetFile}?${encodeURIComponent('language')}=${encodeURIComponent(lng)}`;
            } else {
                console.log("Please select language");
            }
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});

/**
 * Method protects exist node of resource
 */
const rootMainTable = window.document.getElementById("rootMainTable");
if (rootMainTable) {
    rootMainTable.addEventListener("change", (e) => {

        if (e.target.getAttribute("data-purpose") === "Id") {

            const that = e.target;
            const countrySelect = document.getElementById("countrySelect").value;
            const those = that.closest("tr");
            const id = those.querySelector("[data-purpose=Id]");
            const value = those.querySelector("[data-purpose=Value]");
            const comment = those.querySelector("[data-purpose=Comment]");

            const dataTmp = {
                language: countrySelect,
                itemExists: {
                    "Id": id.value,
                    "Value": value.value,
                    "Comment": comment.value
                }
            };

            AjaxPOSTAsync(urlControlActionDataProtect, dataTmp).then((data) => {

                const createElementWithAttr = (object, options) => {
                    let element = window.document.createElement(object);
                    for (const key in options) {
                        if (key === "textContent") {
                            element.textContent = options[key];
                        } else {
                            element.setAttribute(key, options[key]);
                        }
                    }
                    return element;
                };

                if (data.status) {
                    that.classList.remove("error");
                    that.classList.add("success");

                    value.removeAttribute("placeholder");
                    comment.removeAttribute("placeholder");

                    those.querySelectorAll("div.dataError").forEach((el) => {
                        el.remove();
                    });

                    id.parentElement.appendChild(createElementWithAttr("div", {
                        "class": "success dataSuccess",
                        "data-result": "Success",
                        "textContent": data.status
                    }));

                    those.querySelector("button.saveLineButton").disabled = false;

                } else {
                    that.classList.remove("success");
                    that.classList.add("error");

                    value.setAttribute("placeholder", data.Value);
                    comment.setAttribute("placeholder", data.Comment);

                    those.querySelectorAll("div.dataSuccess").forEach((el) => {
                        el.remove();
                    });

                    id.parentElement.appendChild(createElementWithAttr("div", {
                        "class": "error dataError",
                        "data-result": "Error",
                        "textContent": `${data.Id} was found!`
                    }));

                    those.querySelector("button.saveLineButton").disabled = true;
                }
            }).catch((error) => {
                console.error(error);
            });
        }

    });
}


$("#rootMainTable").on("click", ".saveLineButton", null, e => {
    const that = $(e.target);
    const [id, value, comment] = that.closest("tr").find("input, textarea");
    const tmp = {
        Id: id.value,
        Value: value.value,
        Comment: comment.value
    };
    $.ajax({
        type: "POST",
        url: urlControlActionUpdate,
        data: {
            language: $("#countrySelect").val(),
            rowUpdate: tmp
        },
        success: (data) => {

            if (data.hasOwnProperty('status') && !data.hasOwnProperty('error')) {
                that.removeClass("btn-danger");
                $(id).removeClass("is-invalid");
                that.attr("disabled", true);
                that.parents("tr").find("th").first().append(`<div class="dataUpdate">${data.status}</div >`);
                that.parents("tr").find("th").find("input").prop("readonly", true);
            }

            if (data.hasOwnProperty('status') && data.hasOwnProperty('error')) {
                that.addClass("btn-danger");
                $(id).addClass("is-invalid");
                $.each(data.error, (i, value) => {

                    let errDiv = $("<div></div>", {
                        class: `dataError invalid-feedback`,
                        id: `id${i}dataError`,
                        text: value
                    });

                    that.closest("tr").find("th").append(errDiv);
                });
            }

            if (!data.hasOwnProperty('status') && data.hasOwnProperty('error')) {
                alert(data.error);
            }
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});

$("#rootMainTable").on("click", ".deleteLineButton", null, e => {
    if (window.confirm("Delete?")) {
        const that = $(e.target);
        const [id, value, comment] = that.closest("tr").find("input, textarea");
        const tmp = {
            Id: id.value,
            Value: value.value,
            Comment: comment.value
        };
        const language = window.document.getElementById("countrySelect").value;
        $.ajax({
            type: "POST",
            url: urlControlActionDelete,
            data: {
                language: language,
                rowDelete: tmp
            },
            success: (data, textStatus) => {
                console.log(textStatus);
                if ($(data)) {
                    that.closest("tr").empty();
                }
            },
            error: (xhr, ajaxOptions, thrownError) => {
                console.error(xhr);
                console.error(ajaxOptions);
                console.error(thrownError);
            }
        });
    }
});

function CountrySelectUpdate(lang, url, sort, filter, take, page) {
    const that = lang;
    const mainDataBodyTable = document.getElementById("mainDataBodyTable");
    const dataLG = {
        "language": that,
        "sort": sort,
        "filter": filter,
        "take": take,
        "page": page
    };
    const dataEN = {
        "language": "en",
        "sort": sort,
        "filter": filter,
        "take": take,
        "page": page
    };
    AjaxPOSTAsync(url, dataLG).then((data) => {
        if (data.error) {
            EmptyElement(mainDataBodyTable);
            let divError = document.createElement("div");
            divError.textContent = data.error;
            divError.className = "error";
            mainDataBodyTable.appendChild(divError);
            console.error(data.error);
        } else {
            EmptyElement(mainDataBodyTable);
            AjaxPOSTAsync(url, dataEN).then((datas) => {
                createTable$(data, datas);
            }).catch((error) => {
                console.error(error);
            });
            localStorage.setItem("countrySelect", String(that));
        }

    }).catch((error) => {
        console.error(error);
    });
}

function CountrySelectUpdateSet(lang) {
    let sort = window.document.getElementById("select-sort-table").value;
    let filter = JSON.stringify(findTextAll(".inputSearch"));
    let take = window.document.getElementById("take").value;
    let page = window.document.getElementById("page").value;
    CountrySelectUpdate(lang, urlControlSwitchLanguage, sort, filter, take, page);
}

document.addEventListener('DOMContentLoaded', function () {
    try {
        const mainDataBodyTable = document.getElementById("mainDataBodyTable");

        if (GetCountrySet) {
            GetCountrySet();
        }

        const selectSortTable = window.document.getElementById("select-sort-table");

        if (selectSortTable) {
            window.document.getElementById("page").addEventListener('change', () => {
                GetCountrySet();
            });
            window.document.getElementById("take").addEventListener('change', () => {
                GetCountrySet();
            });
        }


        window.addEventListener('popstate', (event) => {

            console.log(event.state);

            window.localStorage.setItem("countrySelect", String(event.state));

            $("#countrySelect").val(event.state).trigger("change");

            CountrySelectUpdateSet(event.state);

        });

        const CountrySelect = document.getElementById("CountrySelect");
        if (CountrySelect !== null && typeof CountrySelect !== "undefined") {

            window.document.getElementById("countrySelectRefresh").addEventListener('click', () => {
                GetCountrySet();
            });

            CountrySelect.addEventListener("change", (event) => {
                if (event.target.nodeName === "SELECT") {
                    EmptyElement(mainDataBodyTable);
                    let lang = event.target.value || window.localStorage.getItem("countrySelect");
                    CountrySelectUpdateSet(lang);

                    window.history.pushState(event.target.value, event.target.value, urlControlRead);
                }
            });
        }

        const SelectSort = window.document.getElementById("select-sort-table");
        if (SelectSort !== null && typeof SelectSort !== "undefined") {

            SelectSort.addEventListener("change", () => {

                if (SelectSort.tagName === 'SELECT') {

                    const lang = document.getElementById("countrySelect").value;

                    EmptyElement(mainDataBodyTable);

                    CountrySelectUpdateSet(lang);
                }
            });
        }

        const mainDataHeadFilterTable = document.getElementById("mainDataHeadFilterTable");
        if (mainDataHeadFilterTable !== null && typeof mainDataHeadFilterTable !== "undefined") {
            mainDataHeadFilterTable.addEventListener("keyup", (event) => {

                if (event.target.tagName === 'INPUT') {
                    const lang = document.getElementById("countrySelect").value;

                    EmptyElement(mainDataBodyTable);

                    CountrySelectUpdateSet(lang);
                }

            });
        }


        const BtnClear = document.getElementById("BtnClear");
        if (BtnClear !== null && typeof BtnClear !== "undefined") {

            BtnClear.addEventListener("click", () => {

                const inputSearchAll = document.getElementById("mainDataHeadFilterTable").querySelectorAll(".inputSearch");
                const lang = document.getElementById("countrySelect").value;

                EmptyElement(document.getElementById("mainDataBodyTable"));

                inputSearchAll.forEach((element) => {
                    element.value = "";
                });

                CountrySelectUpdateSet(lang);


            });
        }

        const addTableRow = document.getElementById("addTableRow");
        if (addTableRow !== null && typeof addTableRow !== "undefined") {
            addTableRow.addEventListener("click", () => {

                createTable$({
                    "Id": "",
                    "Value": "",
                    "Comment": ""
                }, {
                    "Id": "",
                    "Value": "",
                    "Comment": ""
                });

            });
        }

        if (mainDataBodyTable !== null && typeof mainDataBodyTable !== "undefined") {
            mainDataBodyTable.addEventListener("change", (event) => {

                event.target.closest("tr").querySelector("button.saveLineButton").removeAttribute("disabled");

            });
        }

        const tmpTbl = (datas) => {
            if (typeof datas === "object") {
                let tmpString = `<td>>>></td>`;
                for (let item in datas) {
                    if (datas.hasOwnProperty(item)) {
                        tmpString += `<th>${item}</th><td>${datas[item]}</td>`;
                    }
                }
                return tmpString;
            }
            return `<td>${datas}</td>`;
        };

        let genTable = (data) => {

            let rootLogText = "";

            rootLogText += '<table>';
            Array.from(data).forEach((items) => {
                if (items) {

                    rootLogText += '<tbody>';

                    for (let item in items) {
                        if (items.hasOwnProperty(item)) {
                            rootLogText += `<tr><th>${item}</th>${tmpTbl(items[item])}</tr>`;
                        }
                    }
                    rootLogText += '</tbody>';
                }

            });
            rootLogText += '</table>';

            return rootLogText;
        };

        const refreshLog = document.getElementById("refreshLog");
        const rootLog = document.getElementById("rootLog");
        if (refreshLog !== null && typeof refreshLog !== "undefined") {
            refreshLog.addEventListener("click", () => {

                AjaxPOSTAsync(urlControlLogFile, null).then((data) => {
                    EmptyElement(rootLog);

                    if (typeof data === "string") {
                        data = JSON.parse(data);
                    }
                    rootLog.innerHTML = genTable(data);

                }).catch((error) => {
                    console.error(error);
                });

            });
        }

        window.document.querySelector('.dropdown').addEventListener("click", (e) => {
            const that = e.target;
            const DataAction = that.getAttribute('data-action');
            if (DataAction) {
                if (DataAction === 'fileUpload' || DataAction === 'hide-all') {
                    const colFileContainer = window.document.getElementById('colFileContainer');
                    if (colFileContainer) {
                        colFileContainer.classList.toggle('hide');
                        that.classList.toggle('change');
                    }
                }
                if (DataAction === 'languageChange' || DataAction === 'hide-all') {
                    const colLanguageChange = window.document.getElementById('colLanguageChange');
                    if (colLanguageChange) {
                        colLanguageChange.classList.toggle('hide');
                        that.classList.toggle('change');
                    }
                }
                if (DataAction === 'colSortFilter' || DataAction === 'hide-all') {
                    const colSortFilter = window.document.getElementById('colSortFilter');
                    if (colSortFilter) {
                        colSortFilter.classList.toggle('hide');
                        that.classList.toggle('change');
                    }
                }
                if (DataAction === 'hide-all') {
                    Array.from(document.querySelectorAll('a[data-action]')).forEach((element) => {
                        element.classList.toggle('change');
                    });
                }

            }
        }, false);

        window.addEventListener("hashchange", (e) => {
            console.log(e.oldURL);
            console.log(e.newURL);
        }, false);

    } catch (e) {
        console.log(e);
    }
});

function EmptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function findTextAll(el) {
    const inputSearchAll = window.document.querySelectorAll(el);
    const findTextAll = {};
    Array.from(inputSearchAll).forEach((element) => {
        findTextAll[element.name] = element.value;
    });
    return findTextAll;
}

function AjaxPOST(url, object, success, error) {
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
function AjaxPOSTAsync(url, object) {
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
        } else {
            xhr.send();
        }
    });
}


function AjaxPOSTAsyncFileSend(url, objectFiles) {
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