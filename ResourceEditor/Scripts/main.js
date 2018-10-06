let parseToBool = (el) => {
    if (el.toLowerCase() === "true") {
        return true;
    } else if (el.toLowerCase() === "false") {
        return false;
    } else {
        return false;
    }
};

$("#addTableRow").click(
    function myfunction() {
        $('#mainTable').children('tbody').append(`<tr></tr>`);
        let tablAddRow2 = $('#mainTable').children('tbody').children('tr');
        tablAddRow2.last().append(`<th><input type="text" class="inputResourseData form-control d-inline w-100" id="Id_${countTableElement}" name="list[${countTableElement}].Id" scope="row"/></th>`);
        tablAddRow2.last().append(`<td><input type="text" class="inputResourseData form-control d-inline w-100" id="Value_${countTableElement}" name="list[${countTableElement}].Value" /></td>`);
        tablAddRow2.last().append(`<td><input type="text" class="inputResourseData form-control d-inline w-100" id="Comment_${countTableElement}" name="list[${countTableElement}].Comment" /></td>`);
        tablAddRow2.last().append(`<td><button type="button" id="buttonSave${countTableElement}" value="${countTableElement}" class="saveLineButton btn btn-success d-inline w-100" >Save</button></td>`);
        tablAddRow2.last().append(`<td></td>`);
        countTableElement++;
    }
); //<input type="text" class="inputResourseData" id="Comment_q4" name="list[3].Comment" value="1">
//<button type="button" id="saveButton_q4" value="q4" class="saveLineButton btn btn-success">Save</button>

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
            if (parseToBool(data)) {
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

//+++++++++++++++++++++++
/*
window.onload = () => {
    document.getElementById('H2').addEventListener(
        'click',
        () => {

        },
        false
    );
};
*/
