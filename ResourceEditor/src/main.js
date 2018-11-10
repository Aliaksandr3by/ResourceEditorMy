const createInput$ = (className, readOnly = false, val = "", titleText = "...") => {
    return $("<input></input>", {
        type: "text",
        class: `${className}`,
        name: `${className}`,
        readonly: readOnly,
        title: titleText,
        value: val
    });
};

const createButton$ = (className, purpose) => {
    return $(`<button></button>`, {
        type: "button",
        class: `${className}`,
        text: `${purpose}`
    });
};

const createRow$ = (data, titleText) => {
    if (!$.isEmptyObject(data)) { //Проверяет, является ли заданный объект пустым. Функция имеет один вариант использования:

        let ID = !!titleText && "Id" in titleText ? titleText.Id : "";
        let Value = !!titleText && "Value" in titleText ? titleText.Value : "";
        let Comment = !!titleText && "Comment" in titleText ? titleText.Comment : "";

        let buttonName = data.Id !== "" ? "Save" : "Insert";

        let lastTr = $("#mainTable").children("tbody").append(`<tr></tr>`).children("tr").last();

        lastTr.append("<th scope='row'></th>").children("th").last().append(createInput$("inputDataId form-control d-inline w-100", String(data.Id).length > 0, data.Id, ID));
        lastTr.append("<td></td>").children("td").last().append(createInput$("inputDataValue form-control d-inline w-100", false, data.Value, Value));
        lastTr.append("<td></td>").children("td").last().append(createInput$("inputDataComment form-control d-inline w-100", false, data.Comment, Comment));

        lastTr.append("<td></td>").children("td").last().append(createButton$("saveLineButton btn btn-success d-inline w-100", buttonName));
        lastTr.append("<td></td>").children("td").last().append(createButton$("deleteLineButton btn btn-danger d-inline w-100", "Delete"));
    }
};

const createTable$ = function (datum, titles) {
    if (Array.isArray(datum) && Array.isArray(titles)) {
        for (let data of datum) {
            let _title = { Id: "Missing item EN", Value: "Missing item EN", Comment: "Missing item EN" };
            for (var title of titles) {
                if (data.Id === title.Id) {
                    _title = title;
                }
            }
            createRow$(data, _title);
        }
    } else if (typeof datum === "object" && typeof titles === "object") {
        createRow$(datum, titles);
    } else {
        console.error("unknown");
    }
};

function countryResolver(opt) {
    let sel = $(`<select></select>`, {
        class: `browser-default`,
        id: `countrySelect`,
        name: `Id`
    });

    sel.append($("<option>").attr("disabled", "disabled").text("Select language"));

    $(opt).each((i, e) => {
        sel.append($("<option>").attr("value", e.Id).text(`${i + 1}. ${e.Id} - ${e.Value}(${e.Comment})`));
    });

    return sel;
}

function GetCountrySet(lang) {
    let lsLang = lang || localStorage.getItem("countrySelect") || "en";
    $.ajax({
        type: "POST",
        url: urlControlSelectCountry,
        data: {
        },
        success: (data, textStatus) => {
            if (data !== "") {
                $("#CountrySelect").empty();
                $("#CountrySelect").append(countryResolver(data));
                $("#countrySelect").val(lsLang).trigger("change");
                //$("#countrySelect").formSelect();
            } else {
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
    GetCountrySet();
});

$("#ResourceUploads").on("click", null, (e) => {
    let that = $(e.target);
    let data = new FormData(); //с encoding установленным в "multipart/form-data".
    let uploadFile = $("#FileResource").prop("files");

    $.each(uploadFile, (i, value) => {
        data.append(`uploads[${i}]`, value);
    });

    $.ajax({
        url: urlControlUploadFile,
        type: "POST",
        data: data,
        //cache: false,
        //dataType: "json",
        //async: true,
        processData: false, // Не обрабатываем файлы (Don"t process the files)
        contentType: false, // Так jQuery скажет серверу что это строковой запрос
        success: (respond, textStatus, jqXHR) => {
            if (!("error" in respond) && "fileName" in respond) {
                that.siblings("div").remove();
                that.closest("div").append(`<div>${respond.fileName} is ok </div>`);
                GetCountrySet();
            }
            else {
                that.siblings("div").remove();
                that.closest("div").append(`<div>${respond.error}</div>`);
            }
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
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

$("#addTableRow").on("click", null, () => {
    createTable$({ Id: "", Value: "", Comment: "" }, { Id: "", Value: "", Comment: "" });
});

$("#rootMainTable").on("change", ".inputDataId", null, function (e) {
    $(e.target).closest("tr").children("td").children("button.saveLineButton").attr("disabled", false);
});

/**
 * Method protects exist node of resource
 */
$("#rootMainTable").on("change", ".inputDataId", null, function (e) {
    const that = $(e.target);
    const tmpData = that.closest("tr").find("input");
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
            if ("status" in data) {
                that.removeClass("is-invalid");
                $(value).removeAttr("placeholder");
                that.closest("th").find("div.dataError").remove();
                that.closest("th").append(`<div class="dataSuccess">${data.status}</div >`);
                that.closest("tr").children("td").children("button.saveLineButton").attr("disabled", false);
            } else {
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
    let that = $(e.target);
    let tmpData = that.closest("tr").find("input");
    let [id, value, comment] = tmpData;

    $.ajax({
        type: "POST",
        url: urlControlActionUpdate,
        data: {
            language: $("#countrySelect").val(),
            rowUpdate: {
                Id: $(id).val(),
                Value: $(value).val(),
                Comment: $(comment).val()
            }
        },
        success: (data) => {
            if (data.hasOwnProperty('status') && !data.hasOwnProperty('error')) {
                that.removeClass("btn-danger");
                $(id).removeClass("is-invalid");
                that.attr("disabled", true);
                that.parents("tr").find("th").first().append(`<div class="dataUpdate">${data.status}</div >`);
                that.parents("tr").find("th").find("input").prop("readonly", true);
            } else if ("error" in data) {
                that.addClass("btn-danger");
                $(id).addClass("is-invalid");
                if ("status" in data) {
                    $.each(data.error, (i, value) => {

                        let errDiv = $("<div></div>", {
                            class: `dataError invalid-feedback`,
                            id: `id${i}dataError`,
                            text: value
                        });

                        that.closest("tr").find("th").append(errDiv);
                    });
                } else {
                    alert(data.status);
                }

            } else {
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
        let that = $(e.target); //$(this);
        let tmpData = that.closest("tr").find("input");
        let id = $(tmpData[0]);
        let value = $(tmpData[1]);
        let comment = $(tmpData[2]);

        $.ajax({
            type: "POST",
            url: urlControlActionDelete,
            data: {
                language: $("#countrySelect").val(),
                rowDelete: {
                    Id: id.val(),
                    Value: value.val(),
                    Comment: comment.val()
                }
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

function CountrySelectUpdate(lang, url) {
    const that = lang;
    const mainDataBodyTable = document.getElementById("mainDataBodyTable");
    const dataLG = {
        language: that
    };
    const dataEN = {
        language: "en"
    };
    AjaxPOSTAsync(url, dataLG).then((data) => {
        if ("error" in data) {
            while (mainDataBodyTable.firstChild) {
                mainDataBodyTable.removeChild(mainDataBodyTable.firstChild);
            }
            let divError = document.createElement("div");
            divError.textContent = data.error;
            divError.className = "error";
            mainDataBodyTable.appendChild(divError);
            console.error(data.error);
        } else {
            while (mainDataBodyTable.firstChild) {
                mainDataBodyTable.removeChild(mainDataBodyTable.firstChild);
            }
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
    let elems = document.querySelectorAll('.sidenav');
    let instances = M.Sidenav.init(elems, null);

    let lsLang = localStorage.getItem("countrySelect") || "en";
    $("#countrySelectRefresh").trigger("click");

    window.addEventListener('popstate', (event) => {
        console.log(event.state);
        localStorage.setItem("countrySelect", String(event.state));
        $("#countrySelect").val(event.state).trigger("change");
        CountrySelectUpdate(event.state, urlControlSwitchLanguage);
    });

    const CountrySelect = document.getElementById("CountrySelect");

    if (CountrySelect) {
        CountrySelect.addEventListener("change", (event) => {
            CountrySelectUpdate(event.target.value, urlControlSwitchLanguage);
            history.pushState(event.target.value, event.target.value, urlControlRead);
        });
    }
    if (urlControlSwitchLanguage) {
        CountrySelectUpdate(localStorage.getItem("countrySelect"), urlControlSwitchLanguage);
    }
});

function AjaxPOST(url, object, success, error) {
    let xhr = new XMLHttpRequest();
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

function AjaxPOSTAsync(url, object) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = (e) => {
            const that = e.target;
            if (that.status >= 200 && that.status < 300 || that.status === 304) {
                resolve(JSON.parse(xhr.responseText));
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(JSON.stringify(object));
    });
}