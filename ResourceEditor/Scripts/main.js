
$(document).ready(function () {
    $('#SendCountry').click(
        (e) => {
            $.ajax({
                type: "POST",
                url: UrlControl,
                data: {
                    Id: $('#countrySelect').val()
                },
                success: (array) => {
                    alert($('#countrySelect').val());

                },
                error: () => {
                    alert('ошибка');
                }
            });
        }
    );

});

$("#addTableRow").click(
    () => {
        count++;
        $('#mainTable').children('tbody').append(`<tr></tr>`);
        let tablAddRow2 = $('#mainTable').children('tbody').children('tr');
        tablAddRow2.last('tr').append(`<th><input scope="row" type="text" name="list[${count}].Value" /></th>`);
        tablAddRow2.last('tr').append(`<td><input type="text" name="list[${count}].Value" /></td>`);
        tablAddRow2.last('tr').append(`<td><input type="text" name="list[${count}].Value" /></td>`);
    }
);
