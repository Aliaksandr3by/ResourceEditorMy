let parseBool = (el) => {
    if (el.toLowerCase() === "true") {
        return true;
    } else if (el.toLowerCase() === "false") {
        return false;
    } else {
        return false;
    }
};

let countTableElement = 0;

$("#addTableRow").on('click', $(this), (e) => {
    let createInput = (el) => {
        return $('<input>', {
            type: 'text',
            class: 'inputResourseData form-control d-inline w-100',
            id: `${el}_${countTableElement}`,
            name: `list[${countTableElement}].${el}`
        });
    };

    let lastTR = $('#mainTable').children('tbody').append(`<tr id="tableRow_${countTableElement}"></tr>`).children('tr').last();

    lastTR.each(
        (i, el) => {
            console.dir(el);
            //this.append('th').append('td').append('td').append('td');
        }
    );

    lastTR.append('<th scope="row"></th>').children('th').last().append(createInput("Id"));
    lastTR.append('<td></td>').children('td').last().append(createInput("Value"));
    lastTR.append('<td></td>').children('td').last().append(createInput("Comment"));
    lastTR.append(`<td><button type="button" id="buttonSave${countTableElement}" value="${countTableElement}" class="saveLineButton btn btn-success d-inline w-100" >Save</button></td>`);
    lastTR.append(`<td></td>`);
    countTableElement++;
});

///Method
$("#rootMainTable").on('change', '.inputResourseData', $(this), function (e) {
    let that = $(this);
    let a = that.closest('tr').children('td').children('button');
    a.attr('disabled', false);
});

///Method save row
$("#rootMainTable").on('click', '.saveLineButton', $(this), function (e) {
    let that = $(this);
    let a = $(`#Id_${that.val()}`);
    let b = $(`#Value_${that.val()}`);
    let c = $(`#Comment_${that.val()}`);
    $.ajax({
        type: 'POST',
        url: urlControlActionUpdate,
        data: {
            Id: $('#countrySelect').val(),
            rowUpdate: {
                Id: a.val(),
                Value: b.val(),
                Comment: c.val()
            }
        },
        success: function (data, textStatus) {
            console.log(textStatus);
            if (parseBool(data)) {
                that.removeClass('btn-warning');
                a.removeClass('is-invalid');
                that.attr('disabled', true);
            } else {
                that.addClass('btn-warning');
                a.addClass('is-invalid');
            } 
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});

///Method delete row
$('#rootMainTable').on('click', '.deleteLineButton', $(this), function (e) {
    let that = $(this);
    let a = $(`#Id_${that.val()}`).val();
    let b = $(`#Value_${that.val()}`).val();
    let c = $(`#Comment_${that.val()}`).val();
    $.ajax({
        type: 'POST',
        url: urlControlActionDelete,
        data: {
            Id: $('#countrySelect').val(),
            rowDelete: {
                Id: a,
                Value: b,
                Comment: c
            }
        },
        success: function (data, textStatus) {
            console.log(textStatus);
            if ($(data)) {
                that.closest('tr').empty();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});

$('#countrySelect').change(function (e) {
    let that = $(this);
    $.ajax({
        type: 'POST',
        url: urlControlSwitchLanguage,
        data: {
            Id: $('#countrySelect').val()
        },
        success: function (data, textStatus) {
            console.log(textStatus);
            $('#mainDataBodyTable').empty();
            $(data).appendTo('#mainDataBodyTable');

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});

window.onload = () => {
    //document.getElementById('H2').addEventListener(
    //    'click',
    //    () => {

    //    },
    //    false
    //);
};

