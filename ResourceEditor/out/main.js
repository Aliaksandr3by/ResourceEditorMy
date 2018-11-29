"use strict";
if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector;
if (!Element.prototype.closest)
    Element.prototype.closest = function (selector) {
        var el = this;
        while (el) {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
    };
function createInput$(className, readOnly, val, titleText) {
    if (className === void 0) { className = ""; }
    if (readOnly === void 0) { readOnly = false; }
    if (val === void 0) { val = ""; }
    if (titleText === void 0) { titleText = "missing data"; }
    return $("<input></input>", {
        type: "text",
        class: "" + className,
        name: "" + className,
        readonly: readOnly,
        title: titleText,
        value: val
    });
}
function createTextarea$(className, readOnly, val, titleText) {
    if (className === void 0) { className = ""; }
    if (readOnly === void 0) { readOnly = false; }
    if (val === void 0) { val = ""; }
    if (titleText === void 0) { titleText = "missing data"; }
    return $("<textarea></textarea>", {
        class: "" + className,
        readonly: readOnly,
        title: titleText,
        rows: 1,
        text: val
    });
}
function createButton$(className, purpose) {
    if (className === void 0) { className = ""; }
    if (purpose === void 0) { purpose = ""; }
    return $("<button></button>", {
        type: "button",
        class: "" + className,
        text: "" + purpose,
        "data-action": purpose
    });
}
function createRow$(data, titleText) {
    if (data === void 0) { data = {}; }
    if (titleText === void 0) { titleText = {}; }
    var lastTr = $("#mainTable").children("tbody").append("<tr></tr>").children("tr").last();
    lastTr.append("<th></th>").children("th").last()
        .append(createInput$("inputDataId " + (titleText.Id ? "" : "error"), String(data.Id).length > 0, data.Id, titleText.Id));
    lastTr.append("<td></td>").children("td").last()
        .append(createTextarea$("inputDataValue", false, data.Value, titleText.Value));
    lastTr.append("<td></td>").children("td").last()
        .append(createTextarea$("inputDataComment", false, data.Comment, titleText.Comment));
    lastTr.append("<td></td>").children("td").last()
        .append(createButton$("saveLineButton", data.Id === "" ? "Insert" : "Save"));
    lastTr.append("<td></td>").children("td").last()
        .append(createButton$("deleteLineButton", "Delete"));
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
    if (data === void 0) { data = [{}]; }
    var countrySelecter = document.createElement('select');
    countrySelecter.className = "fileContainer-0 custom-select";
    countrySelecter.id = "countrySelect";
    var opt = document.createElement("option");
    opt.text = "Select language";
    opt.disabled = true;
    countrySelecter.add(opt, null);
    var i = 0;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        var opt_1 = document.createElement("option");
        opt_1.className = "custom-select-option";
        opt_1.value = item.Id;
        opt_1.text = i++ + ". " + item.Id + " - " + item.Value + "(" + item.Comment + ")";
        countrySelecter.add(opt_1, null);
    }
    return countrySelecter;
};
function GetCountrySet(lang) {
    if (lang === void 0) { lang = "en"; }
    $.ajax({
        type: "POST",
        url: urlControlSelectCountry,
        data: {},
        success: function (data, textStatus) {
            if (data !== "") {
                $("#countrySelect").remove();
                $("#CountrySelect").prepend($(countryResolver(data)));
                $("#countrySelect").val(lang).trigger("change");
            }
            else {
                console.log("error");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
}
$("#countrySelectRefresh").on("click", null, null, function (e) {
    var that = $(e.target);
    var lsLang = localStorage.getItem("countrySelect") || "en";
    GetCountrySet(lsLang);
    CountrySelectUpdate(lsLang, urlControlSwitchLanguage);
});
$("#ResourceUploads").on("click", null, function (e) {
    var that = $(e.target);
    var uploadFile = $("#FileResource").prop("files");
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
        if (!respond["error"] && respond["fileName"]) {
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
$("#ResourceSave").on("click", null, null, function (e) {
    var that = $(e.target);
    var lng = $("#countrySelect").val();
    $.ajax({
        type: "GET",
        url: urlControlGetFile,
        data: {
            language: $("#countrySelect").val()
        },
        success: function (data) {
            if (data !== "") {
                location.href = urlControlGetFile + "?" + encodeURIComponent('language') + "=" + encodeURIComponent(lng);
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
$("#rootMainTable").on("change", ".inputDataId", null, function (e) {
    var that = $(e.target);
    var tmpData = that.closest("tr").find("input, textarea");
    var id = tmpData[0], value = tmpData[1], comment = tmpData[2];
    $.ajax({
        type: "POST",
        url: urlControlActionDataProtect,
        data: {
            language: $("#countrySelect").val(),
            itemExists: {
                Id: $(id).val(),
                Value: $(value).val(),
                Comment: $(comment).val()
            }
        },
        success: function (data) {
            if (data["status"]) {
                that.removeClass("is-invalid");
                $(value).removeAttr("placeholder");
                that.closest("th").find("div.dataError").remove();
                that.closest("th").append("<div class=\"dataSuccess\">" + data.status + "</div >");
                that.closest("tr").children("td").children("button.saveLineButton").removeAttr("disabled");
            }
            else {
                that.addClass("is-invalid");
                $(value).attr("placeholder", data.Value);
                that.closest("th").find("div.dataSuccess").remove();
                that.closest("th").append("<div class=\"dataError\">" + data.Id + " was found!</div >");
                that.closest("tr").children("td").children("button.saveLineButton").attr("disabled", true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
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
            else if (data["error"]) {
                that.addClass("btn-danger");
                $(id).addClass("is-invalid");
                if (data["status"]) {
                    $.each(data.error, function (i, value) {
                        var errDiv = $("<div></div>", {
                            class: "dataError invalid-feedback",
                            id: "id" + i + "dataError",
                            text: value
                        });
                        that.closest("tr").find("th").append(errDiv);
                    });
                }
                else {
                    alert(data.status);
                }
            }
            else {
                console.error("null");
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
    if (confirm("Delete?")) {
        var that_1 = $(e.target);
        var _a = that_1.closest("tr").find("input, textarea"), id = _a[0], value = _a[1], comment = _a[2];
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
                    that_1.closest("tr").empty();
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
function CountrySelectUpdate(lang, url, sort, filter) {
    if (sort === void 0) { sort = "Id"; }
    if (filter === void 0) { filter = ""; }
    var that = lang;
    var mainDataBodyTable = document.getElementById("mainDataBodyTable");
    var dataLG = {
        "language": that,
        "sort": sort,
        "filter": filter
    };
    var dataEN = {
        "language": "en",
        "sort": sort,
        "filter": filter
    };
    AjaxPOSTAsync(url, dataLG).then(function (data) {
        if (data["error"]) {
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
document.addEventListener('DOMContentLoaded', function () {
    try {
        $("#countrySelectRefresh").trigger("click");
        var mainDataBodyTable_1 = document.getElementById("mainDataBodyTable");
        window.addEventListener('popstate', function (event) {
            console.log(event.state);
            localStorage.setItem("countrySelect", String(event.state));
            $("#countrySelect").val(event.state).trigger("change");
            CountrySelectUpdate(event.state, urlControlSwitchLanguage);
        });
        var CountrySelect = document.getElementById("CountrySelect");
        if (CountrySelect !== null && typeof CountrySelect !== "undefined") {
            CountrySelect.addEventListener("change", function (event) {
                EmptyElement(mainDataBodyTable_1);
                CountrySelectUpdate(event.target.value, urlControlSwitchLanguage);
                history.pushState(event.target.value, event.target.value, urlControlRead);
            });
        }
        var BtnSort = document.querySelectorAll(".BtnSort");
        if (BtnSort !== null && typeof BtnSort !== "undefined" && BtnSort.length > 0) {
            var mainDataHeadTable = document.getElementById("mainDataHeadTable");
            if (mainDataHeadTable) {
                mainDataHeadTable.addEventListener("click", function (event) {
                    var sort = event.target;
                    if (sort.tagName === 'BUTTON') {
                        var lang = document.getElementById("countrySelect");
                        EmptyElement(mainDataBodyTable_1);
                        CountrySelectUpdate(lang.value, urlControlSwitchLanguage, sort.value);
                    }
                });
            }
        }
        var mainDataHeadFilterTable_1 = document.getElementById("mainDataHeadFilterTable");
        if (mainDataHeadFilterTable_1 !== null && typeof mainDataHeadFilterTable_1 !== "undefined") {
            mainDataHeadFilterTable_1.addEventListener("keyup", function (event) {
                if (event.target.tagName === 'INPUT') {
                    var lang = document.getElementById("countrySelect");
                    var sort = event.target.name;
                    var findText = event.target.value;
                    var inputSearchAll = mainDataHeadFilterTable_1.querySelectorAll(".inputSearch");
                    var findTextAll_1 = {};
                    inputSearchAll.forEach(function (element) {
                        findTextAll_1[element.name] = element.value;
                    });
                    EmptyElement(mainDataBodyTable_1);
                    CountrySelectUpdate(lang.value, urlControlSwitchLanguage, sort, JSON.stringify(findTextAll_1));
                }
            });
        }
        var BtnClear = document.getElementById("BtnClear");
        if (BtnClear !== null && typeof BtnClear !== "undefined") {
            BtnClear.addEventListener("click", function (event) {
                var inputSearchAll = document.getElementById("mainDataHeadFilterTable").querySelectorAll(".inputSearch");
                var lang = document.getElementById("countrySelect");
                EmptyElement(document.getElementById("mainDataBodyTable"));
                inputSearchAll.forEach(function (element) {
                    element.value = "";
                });
                CountrySelectUpdate(lang.value, urlControlSwitchLanguage);
            });
        }
        var addTableRow = document.getElementById("addTableRow");
        if (addTableRow !== null && typeof addTableRow !== "undefined") {
            addTableRow.addEventListener("click", function (event) {
                createTable$({ "Id": "", "Value": "", "Comment": "" }, { "Id": "", "Value": "", "Comment": "" });
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
            refreshLog.addEventListener("click", function (event) {
                var that = event.target;
                AjaxPOSTAsync(urlControlLogFile, null).then(function (data) {
                    EmptyElement(rootLog_1);
                    if (typeof data === "string") {
                        data = JSON.parse(data);
                    }
                    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                        var items = data_2[_i];
                        for (var item in items) {
                            rootLog_1.textContent += item + ": " + items[item] + ";";
                        }
                        rootLog_1.appendChild(document.createElement('br'));
                    }
                }).catch(function (error) {
                    console.error(error);
                });
            });
        }
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
function AjaxPOST(url, object, success, error) {
    var xhr = new XMLHttpRequest();
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
        var xhr = new XMLHttpRequest();
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
        var data = new FormData();
        var files = window.document.getElementById(objectFiles).files;
        for (var i = 0; i < files.length; i++) {
            data.append("uploads[" + i + "]", files[i], files[i].name);
        }
        var xhr = new XMLHttpRequest();
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