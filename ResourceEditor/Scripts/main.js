
$(document).ready(function () {



});

var count = 1;
$("#addTableRow").click(
    () => {
        $('#mainTable').children('tbody').append(`<tr></tr>`);
        let tablAddRow2 = $('#mainTable').children('tbody').children('tr');
        tablAddRow2.last('tr').append(`<th><input scope="row" type="text" name="list[${count}].Id" /></th>`);
        tablAddRow2.last('tr').append(`<td><input type="text" name="list[${count}].Value" /></td>`);
        tablAddRow2.last('tr').append(`<td><input type="text" name="list[${count}].Comment" /></td>`);
        count++;
    }
);

$(".deleteLineButton").on("click", function () {
    let that = $(this);

    $.ajax({
        type: "GET",
        url: urlControlDeleteMethod,
        data: {
            Id: $('#countrySelect').val(),
            IdDeleteElement: that.val()

        },
        success: (data, textStatus) => {
            console.log(textStatus);
            location.reload();

        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});

$(".countrySelect").change( function () {
    let that = $(this);
    $.ajax({
        type: "GET",
        url: urlControlEditMethod,
        data: {
            Id: $('#countrySelect').val(),
        },
        success: (data, textStatus) => {
            console.log(textStatus);
            location.reload();
        },
        error: (xhr, ajaxOptions, thrownError) => {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});


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