import { AjaxPOSTAsync, AjaxPOSTAsyncFileSend } from "./Utils.js";
if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector;
if (!Element.prototype.closest)
    Element.prototype.closest = function (selector) {
        let el = this;
        while (el) {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
    };
function createRow$(data = {}, titleText = {}) {
    const inputDataValue = window.document.createElement('textarea');
    inputDataValue.className = 'inputDataValue';
    inputDataValue.readOnly = false;
    inputDataValue.value = data.Value;
    inputDataValue.title = titleText.Value;
    const inputDataComment = window.document.createElement('textarea');
    inputDataComment.className = 'inputDataComment';
    inputDataComment.readOnly = false;
    inputDataComment.value = data.Comment;
    inputDataComment.title = titleText.Comment;
    const createTextarea = (className = "", purpose = "non", readOnly = false, value = "...", title = "...") => {
        const textarea = window.document.createElement('textarea');
        textarea.className = className;
        textarea.readOnly = readOnly;
        textarea.value = value;
        textarea.title = title;
        return textarea;
    };
    const createButton = (className = "", purpose = "") => {
        const button = window.document.createElement('button');
        button.className = className;
        button.textContent = purpose;
        button.type = 'button';
        button.setAttribute("data-action", purpose);
        return button;
    };
    const createInput = window.document.createElement('input');
    createInput.className = `inputDataId ${titleText.Id ? "" : "error"}`;
    createInput.readOnly = String(data.Id).length > 0;
    createInput.value = data.Id;
    createInput.title = titleText.Id;
    let lastTr = $("#mainTable").children("tbody").append(`<tr></tr>`).children("tr").last();
    lastTr.append("<th></th>").children("th").last().append(createInput);
    lastTr.append("<td></td>").children("td").last().append(inputDataValue);
    lastTr.append("<td></td>").children("td").last().append(inputDataComment);
    lastTr.append("<td></td>").children("td").last().append(createButton("saveLineButton", data.Id === "" ? "Insert" : "Save"));
    lastTr.append("<td></td>").children("td").last().append(createButton("deleteLineButton", "Delete"));
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
    }
    else if (typeof datum === "object" && typeof titles === "object") {
        createRow$(datum, titles);
    }
    else {
        console.error("unknown error ");
    }
}
const countryResolver = (data = [{}]) => {
    const countrySelecter = document.createElement('select');
    countrySelecter.className = `fileContainer-0 custom-select`;
    countrySelecter.id = `countrySelect`;
    let opt = document.createElement("option");
    opt.text = "Select language";
    opt.disabled = true;
    countrySelecter.add(opt, null);
    let i = 0;
    for (let item of data) {
        let opt = document.createElement("option");
        opt.className = `custom-select-option`;
        opt.value = item.Id;
        opt.text = `${i++}. ${item.Id} - ${item.Value}(${item.Comment})`;
        countrySelecter.add(opt, null);
    }
    return countrySelecter;
};
function GetCountrySet(lang = "en") {
    $.ajax({
        type: "POST",
        url: urlControlSelectCountry,
        data: {},
        success: (data, textStatus) => {
            if (data !== "") {
                $("#countrySelect").remove();
                $("#CountrySelect").prepend($(countryResolver(data)));
                $("#countrySelect").val(lang).trigger("change");
            }
            else {
                console.log("error");
            }
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
}
$("#countrySelectRefresh").on("click", null, null, e => {
    let that = $(e.target);
    let lsLang = localStorage.getItem("countrySelect") || "en";
    GetCountrySet(lsLang);
    CountrySelectUpdate(lsLang, urlControlSwitchLanguage);
});
$("#ResourceUploads").on("click", null, (e) => {
    let that = $(e.target);
    let uploadFile = $("#FileResource").prop("files");
    const fileUpload = document.querySelector(".fileUpload");
    const resultUpload = (respond = "", alert = "") => {
        const resultUpload = document.createElement('div');
        resultUpload.className = `${alert}`;
        resultUpload.textContent = `${respond}`;
        return resultUpload;
    };
    AjaxPOSTAsyncFileSend(urlControlUploadFile, "FileResource").then((respond) => {
        if (!respond["error"] && respond["fileName"]) {
            EmptyElement(fileUpload);
            fileUpload.appendChild(resultUpload(respond.fileName, "success"));
            GetCountrySet();
        }
        else {
            EmptyElement(fileUpload);
            fileUpload.appendChild(resultUpload(respond.error, "error"));
        }
    }).catch((error) => {
        console.error(error);
    });
});
$("#ResourceSave").on("click", null, null, e => {
    let that = $(e.target);
    const lng = $("#countrySelect").val();
    $.ajax({
        type: "GET",
        url: urlControlGetFile,
        data: {
            language: $("#countrySelect").val()
        },
        success: (data) => {
            if (data !== "") {
                location.href = `${urlControlGetFile}?${encodeURIComponent('language')}=${encodeURIComponent(lng)}`;
            }
            else {
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
$("#rootMainTable").on("change", ".inputDataId", null, function (e) {
    const that = $(e.target);
    const tmpData = that.closest("tr").find("input, textarea");
    const [id, value, comment] = tmpData;
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
        success: (data) => {
            if (data["status"]) {
                that.removeClass("is-invalid");
                $(value).removeAttr("placeholder");
                that.closest("th").find("div.dataError").remove();
                that.closest("th").append(`<div class="dataSuccess">${data.status}</div >`);
                that.closest("tr").children("td").children("button.saveLineButton").removeAttr("disabled");
            }
            else {
                that.addClass("is-invalid");
                $(value).attr("placeholder", data.Value);
                that.closest("th").find("div.dataSuccess").remove();
                that.closest("th").append(`<div class="dataError">${data.Id} was found!</div >`);
                that.closest("tr").children("td").children("button.saveLineButton").attr("disabled", true);
            }
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});
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
            else if (data["error"]) {
                that.addClass("btn-danger");
                $(id).addClass("is-invalid");
                if (data["status"]) {
                    $.each(data.error, (i, value) => {
                        let errDiv = $("<div></div>", {
                            class: `dataError invalid-feedback`,
                            id: `id${i}dataError`,
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
        error: (xhr, ajaxOptions, thrownError) => {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});
$("#rootMainTable").on("click", ".deleteLineButton", null, e => {
    if (confirm("Delete?")) {
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
function CountrySelectUpdate(lang, url, sort = "Id", filter = "") {
    const that = lang;
    const mainDataBodyTable = document.getElementById("mainDataBodyTable");
    const dataLG = {
        "language": that,
        "sort": sort,
        "filter": filter
    };
    const dataEN = {
        "language": "en",
        "sort": sort,
        "filter": filter
    };
    AjaxPOSTAsync(url, dataLG).then((data) => {
        if (data["error"]) {
            EmptyElement(mainDataBodyTable);
            let divError = document.createElement("div");
            divError.textContent = data.error;
            divError.className = "error";
            mainDataBodyTable.appendChild(divError);
            console.error(data.error);
        }
        else {
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
document.addEventListener('DOMContentLoaded', function () {
    try {
        $("#countrySelectRefresh").trigger("click");
        const mainDataBodyTable = document.getElementById("mainDataBodyTable");
        window.addEventListener('popstate', (event) => {
            console.log(event.state);
            localStorage.setItem("countrySelect", String(event.state));
            $("#countrySelect").val(event.state).trigger("change");
            CountrySelectUpdate(event.state, urlControlSwitchLanguage);
        });
        const CountrySelect = document.getElementById("CountrySelect");
        if (CountrySelect !== null && typeof CountrySelect !== "undefined") {
            CountrySelect.addEventListener("change", (event) => {
                EmptyElement(mainDataBodyTable);
                CountrySelectUpdate(event.target.value, urlControlSwitchLanguage);
                history.pushState(event.target.value, event.target.value, urlControlRead);
            });
        }
        const BtnSort = document.querySelectorAll(".BtnSort");
        if (BtnSort !== null && typeof BtnSort !== "undefined" && BtnSort.length > 0) {
            const mainDataHeadTable = document.getElementById("mainDataHeadTable");
            if (mainDataHeadTable) {
                mainDataHeadTable.addEventListener("click", (event) => {
                    const sort = event.target;
                    if (sort.tagName === 'BUTTON') {
                        const lang = document.getElementById("countrySelect");
                        EmptyElement(mainDataBodyTable);
                        CountrySelectUpdate(lang.value, urlControlSwitchLanguage, sort.value);
                    }
                });
            }
        }
        const mainDataHeadFilterTable = document.getElementById("mainDataHeadFilterTable");
        if (mainDataHeadFilterTable !== null && typeof mainDataHeadFilterTable !== "undefined") {
            mainDataHeadFilterTable.addEventListener("keyup", (event) => {
                if (event.target.tagName === 'INPUT') {
                    const lang = document.getElementById("countrySelect");
                    const sort = event.target.name;
                    const findText = event.target.value;
                    const inputSearchAll = mainDataHeadFilterTable.querySelectorAll(".inputSearch");
                    const findTextAll = {};
                    inputSearchAll.forEach((element) => {
                        findTextAll[element.name] = element.value;
                    });
                    EmptyElement(mainDataBodyTable);
                    CountrySelectUpdate(lang.value, urlControlSwitchLanguage, sort, JSON.stringify(findTextAll));
                }
            });
        }
        const BtnClear = document.getElementById("BtnClear");
        if (BtnClear !== null && typeof BtnClear !== "undefined") {
            BtnClear.addEventListener("click", (event) => {
                const inputSearchAll = document.getElementById("mainDataHeadFilterTable").querySelectorAll(".inputSearch");
                const lang = document.getElementById("countrySelect");
                EmptyElement(document.getElementById("mainDataBodyTable"));
                inputSearchAll.forEach((element) => {
                    element.value = "";
                });
                CountrySelectUpdate(lang.value, urlControlSwitchLanguage);
            });
        }
        const addTableRow = document.getElementById("addTableRow");
        if (addTableRow !== null && typeof addTableRow !== "undefined") {
            addTableRow.addEventListener("click", (event) => {
                createTable$({ "Id": "", "Value": "", "Comment": "" }, { "Id": "", "Value": "", "Comment": "" });
            });
        }
        if (mainDataBodyTable !== null && typeof mainDataBodyTable !== "undefined") {
            mainDataBodyTable.addEventListener("change", (event) => {
                event.target.closest("tr").querySelector("button.saveLineButton").removeAttribute("disabled");
            });
        }
        const refreshLog = document.getElementById("refreshLog");
        const rootLog = document.getElementById("rootLog");
        if (refreshLog !== null && typeof refreshLog !== "undefined") {
            refreshLog.addEventListener("click", (event) => {
                const that = event.target;
                AjaxPOSTAsync(urlControlLogFile, null).then((data) => {
                    EmptyElement(rootLog);
                    if (typeof data === "string") {
                        data = JSON.parse(data);
                    }
                    for (let items of data) {
                        for (let item in items) {
                            rootLog.textContent += `${item}: ${items[item]};`;
                        }
                        rootLog.appendChild(document.createElement('br'));
                    }
                }).catch((error) => {
                    console.error(error);
                });
            });
        }
        window.addEventListener("hashchange", (e) => {
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
//# sourceMappingURL=main.js.map