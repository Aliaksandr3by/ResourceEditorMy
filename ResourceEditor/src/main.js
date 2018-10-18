var countTableElement = 0;

const parseBool = el => {
    if (el.toLowerCase() === "true") {
        return true;
    } else if (el.toLowerCase() === "false") {
        return false;
    } else {
        return false;
    }
};

const createInput$ = (purpose, count, className, readOnly = false, val = "") => {
    return $("<input></input>", {
        type: "text",
        class: `${className} form-control d-inline w-100`,
        id: `id${purpose}_${count}`,
        name: `${purpose}_${count}`,
        readonly: readOnly,
        value: val
    });
};

const createButton$ = (purpose, count, className) => {
    return $(`<button></button>`, {
        type: "button",
        class: `${className}`,
        id: `id${purpose}_${count}`,
        name: `button${purpose}_${count}`,
        value: `id${purpose}_${count}`,
        text: `${purpose}`
    });
};

let createRow$ = (data, count) => {
    if (!$.isEmptyObject(data)) { //Проверяет, является ли заданный объект пустым. Функция имеет один вариант использования:

        let buttonName = data.Id !== "" ? "Save" : "Insert";

        let lastTr = $("#mainTable").children("tbody").append(`<tr id="tableRow_${count}"></tr>`).children("tr").last();

        lastTr.append("<th scope='row'></th>").children("th").last().append(createInput$("Id", count, "inputDataId", String(data.Id).length > 0, data.Id));
        lastTr.append("<td></td>").children("td").last().append(createInput$("Value", count, "inputDataValue", false, data.Value));
        lastTr.append("<td></td>").children("td").last().append(createInput$("Comment", count, "inputDataComment", false, data.Comment));

        lastTr.append("<td></td>").children("td").last().append(createButton$(buttonName, count, "saveLineButton btn btn-success d-inline w-100"));
        lastTr.append("<td></td>").children("td").last().append(createButton$("Delete", count, "deleteLineButton btn btn-danger d-inline w-100"));
    }
};

let createTable$ = (data, count) => {
    for (let prop of data) {
        createRow$(prop, count);
        count++;
    }
    return count;
};

$("#ResourceSave").on("click", null, null, e => {
    let that = $(e.target);

    $.ajax({
        type: "GET",
        url: urlControlGetFile,
        data: {
            language: $("#countrySelect").val()
        },
        success: (data, textStatus) => {
            if (data !== "") {
                location.href = urlControlGetFile + "?language=" + $("#countrySelect").val();
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
            if (typeof respond.error === "undefined") {
                $("#FileResource").closest("div").append(`<div>${respond.fileName} is ok </div>`);
                $.ajax({
                    url: urlControlSelectCountry,
                    type: "POST",
                    success: (respond) => {
                        $("#CountrySelect").empty();
                        $(respond).appendTo("#CountrySelect");
                    },
                    error: (jqXHR, textStatus, errorThrown) => {

                    }
                });
            }
            else {
                $("#FileResource").closest("div").append(`<div>${respond.error}</div>`);
            }
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });

});

$("#addTableRow").on("click", null, e => {
    createRow$({ Id: "", Value: "", Comment: "" }, countTableElement);
    countTableElement++;
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
                    //Велидация
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

$("#CountrySelect").on("change", "#countrySelect", null, e => {
    let that = $(e.target); //$(this);
    if (that.val() !== "" && window.localStorage) {
        localStorage.setItem("countrySelect", String(that.val()));
    }

    if (that.val()) {
        $.ajax({
            type: "POST",
            url: urlControlSwitchLanguage,
            data: {
                language: that.val()
            },
            success: (data) => {
                $("#mainDataBodyTable").empty();
                countTableElement = createTable$(data, countTableElement);
                $("#linkDownloads").attr("href", urlControlGetFile + "?language=" + that.val());
            },
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr);
                console.log(ajaxOptions);
                console.log(thrownError);
            }
        });
    }
});

//$("#rootMainTable").on("DOMSubtreeModified", null, null, (e) => {
//    let that = $(e.target); //$(this);

//    console.log(that);
//});

$(window).on("load", function () {
    if (window.localStorage) {
        /** код будет запущен когда страница будет полностью загружена, включая все фреймы, объекты и изображения **/
        let lsLang = localStorage.getItem("countrySelect");
        if (lsLang) {
            $("#countrySelect").val(lsLang).trigger("change");
        }
    }
});

window.onload = () => {
    //document.getElementById('countrySelect').addEventListener('select', () => {

    //}, false);
};