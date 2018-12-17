"use strict";
if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;
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
function createRow$(data, titleText) {
    if (data === void 0) { data = {}; }
    if (titleText === void 0) { titleText = {}; }
    var inputDataKey = function (className, value, title, purpose) {
        if (className === void 0) { className = ""; }
        if (value === void 0) { value = "..."; }
        if (title === void 0) { title = "..."; }
        if (purpose === void 0) { purpose = "non"; }
        var createInput = window.document.createElement('input');
        createInput.className = className;
        createInput.value = value.Id;
        createInput.title = title.Id;
        createInput.readOnly = Boolean(String(value.Id).length > 0);
        createInput.setAttribute("data-purpose", purpose);
        return createInput;
    };
    var dataTextArea = function (className, value, title, purpose, readOnly) {
        if (className === void 0) { className = ""; }
        if (value === void 0) { value = "..."; }
        if (title === void 0) { title = "..."; }
        if (purpose === void 0) { purpose = "non"; }
        if (readOnly === void 0) { readOnly = false; }
        var input = window.document.createElement('textarea');
        input.className = className;
        input.readOnly = readOnly;
        input.value = value;
        input.title = title;
        input.setAttribute("data-purpose", purpose);
        return input;
    };
    var createButton = function (className, purpose) {
        if (className === void 0) { className = ""; }
        if (purpose === void 0) { purpose = ""; }
        var createButton = window.document.createElement('button');
        createButton.className = className;
        createButton.textContent = purpose;
        createButton.type = 'button';
        createButton.setAttribute("data-action", purpose);
        return createButton;
    };
    var tableBody = window.document.getElementById("mainTable");
    var rowTable = window.document.createElement("tr");
    tableBody.appendChild(rowTable);
    var lastTr = $("#mainTable").children("tbody").append("<tr></tr>").children("tr").last();
    lastTr.append("<th class='tabl-row el-01' aria-label='Key' scope='row'></th>").children("th").last().append(inputDataKey("inputDataId " + (titleText.Id ? "" : "error"), data, titleText, "Id"));
    lastTr.append("<td class='tabl-row el-02' aria-label='Value'></td>").children("td").last().append(dataTextArea("inputDataValue", data.Value, titleText.Value, "Value"));
    lastTr.append("<td class='tabl-row el-03' aria-label='Comment'></td>").children("td").last().append(dataTextArea("inputDataComment", data.Comment, titleText.Comment, "Comment"));
    lastTr.append("<td class='tabl-row el-04' data-label='Save'></td>").children("td").last().append(createButton("btn saveLineButton", data.Id === "" ? "Insert" : "Save"));
    lastTr.append("<td class='tabl-row el-05' data-label='Delete'></td>").children("td").last().append(createButton("btn deleteLineButton", "Delete"));
}
function createTable$(datum_tmp, titles_tmp) {
    var datum = datum_tmp;
    var titles = titles_tmp;
    if (typeof datum === 'string' && typeof titles === 'string') {
        datum = JSON.parse(datum_tmp);
        titles = JSON.parse(titles_tmp);
    }
    if (Array.isArray(datum) && Array.isArray(titles)) {
        for (var _i = 0, datum_1 = datum; _i < datum_1.length; _i++) {
            var data = datum_1[_i];
            var _title = {};
            for (var _a = 0, titles_1 = titles; _a < titles_1.length; _a++) {
                var title = titles_1[_a];
                if (data.Id === title.Id) {
                    _title = title;
                }
            }
            createRow$(data, _title);
        }
    }
    else if (typeof datum === "object" && typeof titles === "object") {
        createRow$(datum, titles);
    }
    else {
        console.error("unknown error ");
    }
}
var countryResolver = function (data) {
    var dataTmp = data;
    var countrySelecter = document.createElement('select');
    countrySelecter.className = "flex-container-element element-01";
    countrySelecter.id = "countrySelect";
    var opt = document.createElement("option");
    opt.text = "Select language";
    opt.disabled = true;
    countrySelecter.add(opt, null);
    var i = 1;
    if (!Array.isArray(dataTmp)) {
        dataTmp = JSON.parse(data);
    }
    Array.from(dataTmp).forEach(function (item) {
        var opt = document.createElement("option");
        opt.className = "";
        opt.value = item.Id;
        opt.text = i++ + ". " + item.Id + " - " + item.Value + "(" + item.Comment + ")";
        opt.selected = item.Id === window.localStorage.getItem("countrySelect");
        countrySelecter.add(opt, null);
    });
    return countrySelecter;
};
function GetCountrySet(langSet) {
    AjaxPOSTAsync(urlControlSelectCountry, null).then(function (data) {
        if (data !== "") {
            var CountrySelect = window.document.getElementById("CountrySelect");
            var countrySelect = window.document.getElementById("countrySelect");
            if (countrySelect) {
                CountrySelect.replaceChild(countryResolver(data), countrySelect);
            }
            else {
                countrySelect = CountrySelect.insertBefore(countryResolver(data), CountrySelect[0]);
            }
            var lang = langSet || countrySelect.value || window.localStorage.getItem("countrySelect");
            CountrySelectUpdateSet(lang);
        }
        else {
            console.log("error");
        }
    }).catch(function (error) {
        console.error(error);
    });
}
$("#ResourceUploads").on("click", null, function () {
    var fileUpload = document.querySelector(".fileUpload");
    var resultUpload = function (respond, alert) {
        if (respond === void 0) { respond = ""; }
        if (alert === void 0) { alert = ""; }
        var resultUpload = document.createElement('div');
        resultUpload.className = "" + alert;
        resultUpload.textContent = "" + respond;
        return resultUpload;
    };
    AjaxPOSTAsyncFileSend(urlControlUploadFile, "FileResource").then(function (respond) {
        if (!respond.error && respond.fileName) {
            EmptyElement(fileUpload);
            fileUpload.appendChild(resultUpload(respond.fileName, "success"));
            GetCountrySet();
        }
        else {
            EmptyElement(fileUpload);
            fileUpload.appendChild(resultUpload(respond.error, "error"));
        }
    }).catch(function (error) {
        console.error(error);
    });
});
$("#ResourceSave").on("click", null, null, function () {
    var lng = $("#countrySelect").val();
    $.ajax({
        type: "GET",
        url: urlControlGetFile,
        data: {
            language: $("#countrySelect").val()
        },
        success: function (data) {
            if (data !== "") {
                window.location.href = urlControlGetFile + "?" + encodeURIComponent('language') + "=" + encodeURIComponent(lng);
            }
            else {
                console.log("Please select language");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});
window.document.getElementById("rootMainTable").addEventListener("change", function (e) {
    if (e.target.getAttribute("data-purpose") === "Id") {
        var that_1 = e.target;
        var countrySelect = document.getElementById("countrySelect").value;
        var those_1 = that_1.closest("tr");
        var id_1 = those_1.querySelector("[data-purpose=Id]");
        var value_1 = those_1.querySelector("[data-purpose=Value]");
        var comment_1 = those_1.querySelector("[data-purpose=Comment]");
        var dataTmp = {
            language: countrySelect,
            itemExists: {
                "Id": id_1.value,
                "Value": value_1.value,
                "Comment": comment_1.value
            }
        };
        AjaxPOSTAsync(urlControlActionDataProtect, dataTmp).then(function (data) {
            var createElementWithAttr = function (object, options) {
                var element = window.document.createElement(object);
                for (var key in options) {
                    if (key === "textContent") {
                        element.textContent = options[key];
                    }
                    else {
                        element.setAttribute(key, options[key]);
                    }
                }
                return element;
            };
            if (data.status) {
                that_1.classList.remove("error");
                that_1.classList.add("success");
                value_1.removeAttribute("placeholder");
                comment_1.removeAttribute("placeholder");
                those_1.querySelectorAll("div.dataError").forEach(function (el) {
                    el.remove();
                });
                id_1.parentElement.appendChild(createElementWithAttr("div", {
                    "class": "success dataSuccess",
                    "data-result": "Success",
                    "textContent": data.status
                }));
                those_1.querySelector("button.saveLineButton").disabled = false;
            }
            else {
                that_1.classList.remove("success");
                that_1.classList.add("error");
                value_1.setAttribute("placeholder", data.Value);
                comment_1.setAttribute("placeholder", data.Comment);
                those_1.querySelectorAll("div.dataSuccess").forEach(function (el) {
                    el.remove();
                });
                id_1.parentElement.appendChild(createElementWithAttr("div", {
                    "class": "error dataError",
                    "data-result": "Error",
                    "textContent": data.Id + " was found!"
                }));
                those_1.querySelector("button.saveLineButton").disabled = true;
            }
        }).catch(function (error) {
            console.error(error);
        });
    }
});
$("#rootMainTable").on("click", ".saveLineButton", null, function (e) {
    var that = $(e.target);
    var _a = that.closest("tr").find("input, textarea"), id = _a[0], value = _a[1], comment = _a[2];
    var tmp = {
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
        success: function (data) {
            if (data.hasOwnProperty('status') && !data.hasOwnProperty('error')) {
                that.removeClass("btn-danger");
                $(id).removeClass("is-invalid");
                that.attr("disabled", true);
                that.parents("tr").find("th").first().append("<div class=\"dataUpdate\">" + data.status + "</div >");
                that.parents("tr").find("th").find("input").prop("readonly", true);
            }
            if (data.hasOwnProperty('status') && data.hasOwnProperty('error')) {
                that.addClass("btn-danger");
                $(id).addClass("is-invalid");
                $.each(data.error, function (i, value) {
                    var errDiv = $("<div></div>", {
                        class: "dataError invalid-feedback",
                        id: "id" + i + "dataError",
                        text: value
                    });
                    that.closest("tr").find("th").append(errDiv);
                });
            }
            if (!data.hasOwnProperty('status') && data.hasOwnProperty('error')) {
                alert(data.error);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});
$("#rootMainTable").on("click", ".deleteLineButton", null, function (e) {
    if (window.confirm("Delete?")) {
        var that_2 = $(e.target);
        var _a = that_2.closest("tr").find("input, textarea"), id = _a[0], value = _a[1], comment = _a[2];
        var tmp = {
            Id: id.value,
            Value: value.value,
            Comment: comment.value
        };
        var language = window.document.getElementById("countrySelect").value;
        $.ajax({
            type: "POST",
            url: urlControlActionDelete,
            data: {
                language: language,
                rowDelete: tmp
            },
            success: function (data, textStatus) {
                console.log(textStatus);
                if ($(data)) {
                    that_2.closest("tr").empty();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error(xhr);
                console.error(ajaxOptions);
                console.error(thrownError);
            }
        });
    }
});
function CountrySelectUpdate(lang, url, sort, filter, take, page) {
    var that = lang;
    var mainDataBodyTable = document.getElementById("mainDataBodyTable");
    var dataLG = {
        "language": that,
        "sort": sort,
        "filter": filter,
        "take": take,
        "page": page
    };
    var dataEN = {
        "language": "en",
        "sort": sort,
        "filter": filter,
        "take": take,
        "page": page
    };
    AjaxPOSTAsync(url, dataLG).then(function (data) {
        if (data.error) {
            EmptyElement(mainDataBodyTable);
            var divError = document.createElement("div");
            divError.textContent = data.error;
            divError.className = "error";
            mainDataBodyTable.appendChild(divError);
            console.error(data.error);
        }
        else {
            EmptyElement(mainDataBodyTable);
            AjaxPOSTAsync(url, dataEN).then(function (datas) {
                createTable$(data, datas);
            }).catch(function (error) {
                console.error(error);
            });
            localStorage.setItem("countrySelect", String(that));
        }
    }).catch(function (error) {
        console.error(error);
    });
}
function CountrySelectUpdateSet(lang) {
    var sort = window.document.getElementById("select-sort-table").value;
    var filter = JSON.stringify(findTextAll(".inputSearch"));
    var take = window.document.getElementById("take").value;
    var page = window.document.getElementById("page").value;
    CountrySelectUpdate(lang, urlControlSwitchLanguage, sort, filter, take, page);
}
document.addEventListener('DOMContentLoaded', function () {
    try {
        var mainDataBodyTable_1 = document.getElementById("mainDataBodyTable");
        GetCountrySet();
        window.document.getElementById("countrySelectRefresh").addEventListener('click', function () {
            GetCountrySet();
        });
        window.document.getElementById("page").addEventListener('change', function () {
            GetCountrySet();
        });
        window.document.getElementById("take").addEventListener('change', function () {
            GetCountrySet();
        });
        window.addEventListener('popstate', function (event) {
            console.log(event.state);
            window.localStorage.setItem("countrySelect", String(event.state));
            $("#countrySelect").val(event.state).trigger("change");
            CountrySelectUpdateSet(event.state);
        });
        var CountrySelect = document.getElementById("CountrySelect");
        if (CountrySelect !== null && typeof CountrySelect !== "undefined") {
            CountrySelect.addEventListener("change", function (event) {
                if (event.target.nodeName === "SELECT") {
                    EmptyElement(mainDataBodyTable_1);
                    var lang = event.target.value || window.localStorage.getItem("countrySelect");
                    CountrySelectUpdateSet(lang);
                    window.history.pushState(event.target.value, event.target.value, urlControlRead);
                }
            });
        }
        var SelectSort_1 = window.document.getElementById("select-sort-table");
        if (SelectSort_1 !== null && typeof SelectSort_1 !== "undefined") {
            SelectSort_1.addEventListener("change", function () {
                if (SelectSort_1.tagName === 'SELECT') {
                    var lang = document.getElementById("countrySelect").value;
                    EmptyElement(mainDataBodyTable_1);
                    CountrySelectUpdateSet(lang);
                }
            });
        }
        var mainDataHeadFilterTable = document.getElementById("mainDataHeadFilterTable");
        if (mainDataHeadFilterTable !== null && typeof mainDataHeadFilterTable !== "undefined") {
            mainDataHeadFilterTable.addEventListener("keyup", function (event) {
                if (event.target.tagName === 'INPUT') {
                    var lang = document.getElementById("countrySelect").value;
                    EmptyElement(mainDataBodyTable_1);
                    CountrySelectUpdateSet(lang);
                }
            });
        }
        var BtnClear = document.getElementById("BtnClear");
        if (BtnClear !== null && typeof BtnClear !== "undefined") {
            BtnClear.addEventListener("click", function () {
                var inputSearchAll = document.getElementById("mainDataHeadFilterTable").querySelectorAll(".inputSearch");
                var lang = document.getElementById("countrySelect").value;
                EmptyElement(document.getElementById("mainDataBodyTable"));
                inputSearchAll.forEach(function (element) {
                    element.value = "";
                });
                CountrySelectUpdateSet(lang);
            });
        }
        var addTableRow = document.getElementById("addTableRow");
        if (addTableRow !== null && typeof addTableRow !== "undefined") {
            addTableRow.addEventListener("click", function () {
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
        if (mainDataBodyTable_1 !== null && typeof mainDataBodyTable_1 !== "undefined") {
            mainDataBodyTable_1.addEventListener("change", function (event) {
                event.target.closest("tr").querySelector("button.saveLineButton").removeAttribute("disabled");
            });
        }
        var refreshLog = document.getElementById("refreshLog");
        var rootLog_1 = document.getElementById("rootLog");
        if (refreshLog !== null && typeof refreshLog !== "undefined") {
            refreshLog.addEventListener("click", function () {
                AjaxPOSTAsync(urlControlLogFile, null).then(function (data) {
                    EmptyElement(rootLog_1);
                    if (typeof data === "string") {
                        data = JSON.parse(data);
                    }
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var items = data_1[_i];
                        if (data.hasOwnProperty(items)) {
                            for (var item in items) {
                                if (items.hasOwnProperty(item)) {
                                    rootLog_1.textContent += item + ": " + items[item] + ";";
                                }
                            }
                            rootLog_1.appendChild(document.createElement('br'));
                        }
                    }
                }).catch(function (error) {
                    console.error(error);
                });
            });
        }
        window.document.querySelector('.dropdown').addEventListener("click", function (e) {
            var that = e.target;
            var DataAction = that.getAttribute('data-action');
            if (DataAction) {
                if (DataAction === 'fileUpload' || DataAction === 'hide-all') {
                    var colFileContainer = window.document.getElementById('colFileContainer');
                    if (colFileContainer) {
                        colFileContainer.classList.toggle('hide');
                        that.classList.toggle('change');
                    }
                }
                if (DataAction === 'languageChange' || DataAction === 'hide-all') {
                    var colLanguageChange = window.document.getElementById('colLanguageChange');
                    if (colLanguageChange) {
                        colLanguageChange.classList.toggle('hide');
                        that.classList.toggle('change');
                    }
                }
                if (DataAction === 'colSortFilter' || DataAction === 'hide-all') {
                    var colSortFilter = window.document.getElementById('colSortFilter');
                    if (colSortFilter) {
                        colSortFilter.classList.toggle('hide');
                        that.classList.toggle('change');
                    }
                }
                if (DataAction === 'hide-all') {
                    Array.from(document.querySelectorAll('a[data-action]')).forEach(function (element) {
                        element.classList.toggle('change');
                    });
                }
            }
        }, false);
        window.addEventListener("hashchange", function (e) {
            console.log(e.oldURL);
            console.log(e.newURL);
        }, false);
    }
    catch (e) {
        console.log(e);
    }
});
function EmptyElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
function findTextAll(el) {
    var inputSearchAll = window.document.querySelectorAll(el);
    var findTextAll = {};
    Array.from(inputSearchAll).forEach(function (element) {
        findTextAll[element.name] = element.value;
    });
    return findTextAll;
}
function AjaxPOST(url, object, success, error) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.timeout = 5000;
    xhr.ontimeout = function () {
        console.error("Request did not return i n а second.");
    };
    xhr.send(JSON.stringify(object));
    xhr.addEventListener("load", function (e) {
        var that = e.target;
        if (that.status >= 200 && that.status < 300 || that.status === 304) {
            success(JSON.parse(that.responseText));
        }
    }, false);
    xhr.addEventListener("error", function (e) {
        var that = e.target;
        error(that);
    }, false);
}
function AjaxPOSTAsync(url, object) {
    return new Promise(function (resolve, reject) {
        var xhr = new window.XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.responseType = 'json';
        xhr.onload = function (e) {
            var that = e.target;
            if (that.status >= 200 && that.status < 300 || that.status === 304) {
                resolve(xhr.response);
            }
        };
        xhr.onerror = function () { return reject(xhr.statusText); };
        if (object) {
            xhr.send(JSON.stringify(object));
        }
        else {
            xhr.send();
        }
    });
}
function AjaxPOSTAsyncFileSend(url, objectFiles) {
    return new Promise(function (resolve, reject) {
        var data = new window.FormData();
        var files = window.document.getElementById(objectFiles).files;
        for (var i = 0; i < files.length; i++) {
            data.append("uploads[" + i + "]", files[i], files[i].name);
        }
        var xhr = new window.XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.responseType = 'json';
        xhr.onload = function (e) {
            var that = e.target;
            if (that.status >= 200 && that.status < 300 || that.status === 304) {
                resolve(xhr.response);
            }
        };
        xhr.onerror = function () { return reject(xhr.statusText); };
        xhr.send(data);
    });
}
//# sourceMappingURL=main.js.map