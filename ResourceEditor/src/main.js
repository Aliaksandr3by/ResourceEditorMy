var countTableElement = 0;

let parseBool = el => {
    if (el.toLowerCase() === "true") {
        return true;
    } else if (el.toLowerCase() === "false") {
        return false;
    } else {
        return false;
    }
};

let createInput$ = (purpose, count, className, val = "") => {
    return $('<input></input>', {
        type: 'text',
        class: `${className} form-control d-inline w-100`,
        id: `id${purpose}_${count}`,
        name: `${purpose}_${count}`,
        value: val
    });
};

let createButton$ = (purpose, count, className) => {
    return $(`<button></button>`, {
        type: 'button',
        class: `${className}`,
        id: `id${purpose}_${count}`,
        name: `button${purpose}_${count}`,
        value: `id${purpose}_${count}`,
        text: `${purpose}`
    });
};

let createRow$ = (data, count) => {
    if (!$.isEmptyObject(data)) {

        let lastTR = $('#mainTable').children('tbody').append(`<tr id="tableRow_${count}"></tr>`).children('tr').last();

        lastTR.append('<th scope="row"></th>').children('th').last().append(createInput$("Id", count, 'inputResourseData', data.Id));
        lastTR.append('<td></td>').children('td').last().append(createInput$("Value", count, 'inputResourseData', data.Value));
        lastTR.append('<td></td>').children('td').last().append(createInput$("Comment", count, 'inputResourseData', data.Comment));

        lastTR.append('<td></td>').children('td').last().append(createButton$("Save", count, "saveLineButton btn btn-success d-inline w-100"));
        lastTR.append('<td></td>').children('td').last().append(createButton$("Delete", count, "deleteLineButton btn btn-danger d-inline w-100"));
    }
};

let createTable$ = (data, count) => {
    for (let prop of data) {
        createRow$(prop, count);
        count++;
    }
    return count;
};

$("#ResourceSave").on('click', null, null, e => {
    let that = $(e.target);

    $.ajax({
        type: 'GET',
        url: urlControlGetFile,
        data: {
            Language: $('#countrySelect').val()
        },
        success: (data, textStatus) => {
            if (data !== "") {
                location.href = urlControlGetFile + "?Language=" + $('#countrySelect').val();
            } else {
                console.log("Please select language");
            }
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});


$("#ResourceUploads").on('click', null, (e) => {
    let that = $(e.target);
    let data = new FormData(); //с encoding установленным в "multipart/form-data".
    let uploadFile = $('#FileResource').prop('files');

    $.each(uploadFile, (i, value) => {
        data.append(`uploads[${i}]`, value);
    });

    $.ajax({
        url: urlControlUploadFile,
        type: 'POST',
        data: data,
        //cache: false,
        //dataType: 'json',
        //async: true,
        processData: false, // Не обрабатываем файлы (Don't process the files)
        contentType: false, // Так jQuery скажет серверу что это строковой запрос
        success: (respond, textStatus, jqXHR) => {
            if (typeof respond.error === 'undefined') {
                $("#FileResource").closest('div').append(`<div>${respond.fileName} is ok </div>`);

                $.ajax({
                    url: urlControlSelectCountry,
                    type: 'POST',
                    success: (respond, textStatus, jqXHR) => {
                        $('#CountrySelect').empty();
                        $(respond).appendTo('#CountrySelect');
                    },
                    error: (jqXHR, textStatus, errorThrown) => {

                    }
                });


            }
            else {
                $("#FileResource").closest('div').append(`<div>${respond.error}</div>`);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('ОШИБКИ AJAX запроса: ' + textStatus);
        }
    });

});

$("#addTableRow").on('click', null, e => {
    createRow$({ Id: "", Value: "", Comment: "" }, countTableElement);
    countTableElement++;
});

///Method
$("#rootMainTable").on('change', '.inputResourseData', null, function (e) {
    let that = $(e.target); //$(this);
    let a = that.closest('tr').children('td').children('button');
    a.attr('disabled', false);
});

//метод проверяет есть ли уже введенный ключ
$("#rootMainTable").on('change', '.inputResourseData', null, function (e) {
    let that = $(e.target);
    let tmpData = that.closest('tr').find('input');
    let [id, value, comment] = tmpData;
    $.ajax({
        type: 'POST',
        url: urlControlActionDataProtect,
        data: {
            Language: $('#countrySelect').val(),
            itemExists: {
                Id: $(id).val(),
                Value: $(value).val(),
                Comment: $(comment).val()
            }
        },
        success: (data, textStatus) => {
            if (data === "") {
                that.removeClass('is-invalid');
                $(value).removeAttr('placeholder');
                that.closest('th').find('div').remove();//плохо
            } else if (typeof data.error !== 'undefined'){
                that.addClass('is-invalid');
                that.closest('th').append(`<div class="invalid-feedback">${data.error}</div >`);
            } else if (data !== ""){
                that.addClass('is-invalid');
                that.closest('th').append('<div class="invalid-feedback">Sorry, that key taken.</div >');
                $(value).attr('placeholder', data.Value).blur().css({ 'color': 'red', 'font-size': '80%' });
            }
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});

///Method save row
$("#rootMainTable").on('click', '.saveLineButton', null, e => {
    let that = $(e.target);
    let tmpData = that.closest('tr').find('input');
    let [id, value, comment] = tmpData;

    $.ajax({
        type: 'POST',
        url: urlControlActionUpdate,
        data: {
            Language: $('#countrySelect').val(),
            rowUpdate: {
                Id: $(id).val(),
                Value: $(value).val(),
                Comment: $(comment).val()
            }
        },
        success: (data, textStatus) => {
            if (data !== "" && typeof data.error !== 'undefined') {
                that.removeClass('btn-warning');
                $(id).removeClass('is-invalid');
                that.attr('disabled', String(true));
            } else {
                console.log(data.error);
                that.addClass('btn-warning');
                $(id).addClass('is-invalid');
            }
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});

///Method delete row
$('#rootMainTable').on('click', '.deleteLineButton', null, e => {
    if (confirm("Delete?")) {
        let that = $(e.target); //$(this);
        let tmpData = that.closest('tr').find('input');
        let id = $(tmpData[0]);
        let value = $(tmpData[1]);
        let comment = $(tmpData[2]);

        $.ajax({
            type: 'POST',
            url: urlControlActionDelete,
            data: {
                Language: $('#countrySelect').val(),
                rowDelete: {
                    Id: id.val(),
                    Value: value.val(),
                    Comment: comment.val()
                }
            },
            success: (data, textStatus) => {
                console.log(textStatus);
                if ($(data)) {
                    that.closest('tr').empty();
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

$('#CountrySelect').on('change', '#countrySelect', null, e => {
    let that = $(e.target); //$(this);
    if (that.val() !== "" && window.localStorage) {
        localStorage.setItem("countrySelect", String(that.val()));
    }

    if (that.val()) {
        $.ajax({
            type: 'POST',
            url: urlControlSwitchLanguage,
            data: {
                Language: that.val()
            },
            success: (data, textStatus) => {
                $('#mainDataBodyTable').empty();
                countTableElement = createTable$(data, countTableElement);
                $('#linkDownloads').attr('href', urlControlGetFile + "?Language=" + that.val());
            },
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr);
                console.log(ajaxOptions);
                console.log(thrownError);
            }
        });
    }
});

$(window).on('load', function () {
    if (window.localStorage) {
        /** код будет запущен когда страница будет полностью загружена, включая все фреймы, объекты и изображения **/
        let lsLang = localStorage.getItem("countrySelect");
        if (lsLang) {
            $('#countrySelect').val(lsLang).trigger('change');
        }
    }
});

window.onload = () => {
    //document.getElementById('countrySelect').addEventListener('select', () => {

    //}, false);
};