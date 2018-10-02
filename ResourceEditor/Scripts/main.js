
$(document).ready(function () {



});

var count = 0;
$("#addTableRow").click(
    () => {
        count++;
        $('#mainTable').children('tbody').append(`<tr></tr>`);
        let tablAddRow2 = $('#mainTable').children('tbody').children('tr');
        tablAddRow2.last('tr').append(`<th><input scope="row" type="text" name="list[${count}].Id" /></th>`);
        tablAddRow2.last('tr').append(`<td><input type="text" name="list[${count}].Value" /></td>`);
        tablAddRow2.last('tr').append(`<td><input type="text" name="list[${count}].Comment" /></td>`);
    }
);

//$("#deleteButtonLineResource").click(
//    (e) => {

//        $.ajax({
//            type: "GET",
//            url: urlControlDeleteMethod,
//            data: {
//                Id: e.target.attributes.value.nodeValue //$("#deleteButtonLineResource").val()
//            },
//            success: (data, textStatus) => {
//                console.log(textStatus);
//            },
//            error: () => {
//                console.error('error sen data #001');
//            }
//        });
//    }
//);

function buttonDeleteLineResoure(el) {
    $.ajax({
        type: "GET",
        url: urlControlDeleteMethod,
        data: {
            Id: $('#inputCountrySelect').val(),
            IdDeleteElement: $(el).val()

        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
    location.reload();

}