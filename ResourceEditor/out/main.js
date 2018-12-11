import { AjaxPOSTAsync, AjaxPOSTAsyncFileSend } from "./Utils.js";
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
    lastTr.append("<th class='tabl-row el-01' aria-label='Key' scope='row'></th>").children("th").last().append(inputDataKey(`inputDataId ${titleText.Id ? "" : "error"}`, data, titleText, "key"));
    lastTr.append("<td class='tabl-row el-02' aria-label='Value'></td>").children("td").last().append(dataTextArea("inputDataValue", data.Value, titleText.Value));
    lastTr.append("<td class='tabl-row el-03' aria-label='Comment'></td>").children("td").last().append(dataTextArea("inputDataComment", data.Comment, titleText.Comment));
    lastTr.append("<td class='tabl-row el-04' data-label='Save'></td>").children("td").last().append(createButton("btn saveLineButton", data.Id === "" ? "Insert" : "Save"));
    lastTr.append("<td class='tabl-row el-05' data-label='Delete'></td>").children("td").last().append(createButton("btn deleteLineButton", "Delete"));
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
const countryResolver = (data) => {
    const countrySelecter = document.createElement('select');
    countrySelecter.className = `flex-container-element element-01`;
    countrySelecter.id = `countrySelect`;
    let opt = document.createElement("option");
    opt.text = "Select language";
    opt.disabled = true;
    countrySelecter.add(opt, null);
    let i = 0;
    for (let item of data) {
        let opt = document.createElement("option");
        opt.className = ``;
        opt.value = item.Id;
        opt.text = `${i++}. ${item.Id} - ${item.Value}(${item.Comment})`;
        opt.selected = item.Id === window.localStorage.getItem("countrySelect");
        countrySelecter.add(opt, null);
    }
    return countrySelecter;
};
function GetCountrySet(langSet) {
    AjaxPOSTAsync(urlControlSelectCountry, null).then((data) => {
        if (data !== "") {
            const CountrySelect = window.document.getElementById("CountrySelect");
            let countrySelect = window.document.getElementById("countrySelect");
            if (countrySelect) {
                CountrySelect.replaceChild(countryResolver(data), countrySelect);
            }
            else {
                countrySelect = CountrySelect.insertBefore(countryResolver(data), CountrySelect[0]);
            }
            let lang = langSet || countrySelect.value || window.localStorage.getItem("countrySelect");
            CountrySelectUpdateSet(lang);
        }
        else {
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
        }
        else {
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
            if (data.status) {
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
            else if (data.error) {
                that.addClass("btn-danger");
                $(id).addClass("is-invalid");
                if (data.status) {
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
        GetCountrySet();
        window.document.getElementById("countrySelectRefresh").addEventListener('click', () => {
            GetCountrySet();
        });
        window.document.getElementById("page").addEventListener('change', () => {
            GetCountrySet();
        });
        window.document.getElementById("take").addEventListener('change', () => {
            GetCountrySet();
        });
        window.addEventListener('popstate', (event) => {
            console.log(event.state);
            window.localStorage.setItem("countrySelect", String(event.state));
            $("#countrySelect").val(event.state).trigger("change");
            CountrySelectUpdateSet(event.state);
        });
        const CountrySelect = document.getElementById("CountrySelect");
        if (CountrySelect !== null && typeof CountrySelect !== "undefined") {
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
            refreshLog.addEventListener("click", () => {
                AjaxPOSTAsync(urlControlLogFile, null).then((data) => {
                    EmptyElement(rootLog);
                    if (typeof data === "string") {
                        data = JSON.parse(data);
                    }
                    for (let items of data) {
                        if (data.hasOwnProperty(items)) {
                            for (let item in items) {
                                if (items.hasOwnProperty(item)) {
                                    rootLog.textContent += `${item}: ${items[item]};`;
                                }
                            }
                            rootLog.appendChild(document.createElement('br'));
                        }
                    }
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
    const inputSearchAll = window.document.querySelectorAll(el);
    const findTextAll = {};
    inputSearchAll.forEach((element) => {
        findTextAll[element.name] = element.value;
    });
    return findTextAll;
}
//# sourceMappingURL=main.js.map