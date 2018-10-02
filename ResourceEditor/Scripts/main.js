
var count = 1;
$("#addTableRow").click(
    function myfunction() {
        $('#mainTable').children('tbody').append(`<tr></tr>`);
        let tablAddRow2 = $('#mainTable').children('tbody').children('tr');
        tablAddRow2.last('tr').append(`<th><input scope="row" type="text" name="list[${count}].Id" /></th>`);
        tablAddRow2.last('tr').append(`<td><input type="text" name="list[${count}].Value" /></td>`);
        tablAddRow2.last('tr').append(`<td><input type="text" name="list[${count}].Comment" /></td>`);
        count++;
    }
);

//нужно динамическое подключение ивентов
$(".deleteLineButton").on("click", $(this), function () {
    var that = $(this);

    $.ajax({
        type: "GET",
        url: urlControlDeleteMethod,
        data: {
            Id: $('#countrySelect').val(),
            IdDeleteElement: that.val()

        },
        success: function (data, textStatus) {
            console.log(textStatus);
            location.reload();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});

$("#countrySelect").change(function () {
    let that = $(this);
    if (urlControlEditMethod) {
        $.ajax({
            type: "POST",
            url: urlControlEditMethod,
            data: {
                Id: $('#countrySelect').val()
            },
            success: function (data, textStatus) {
                console.log(textStatus);
                $("#mainDataBodyTable").empty();
                $(data).appendTo("#mainDataBodyTable");

            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error(xhr);
                console.error(ajaxOptions);
                console.error(thrownError);
            }
        });
    }
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
let products;
$(".buttonJson").on("click", $(this), function () {
    var that = $(this);

    $.ajax({
        type: "post",
        url: urlControlJsonMethod,
        data: {
            Id: $('#countrySelect').val()
        },
        success: function (data, textStatus) {
            console.log(textStatus);
            products = data;
            $("#grid").empty();
            KendoTable();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});



function KendoTable() {


}

$(document).ready(
    function () {
        $("#grid").kendoGrid({
            dataSource: {
                data: products,
                schema: {
                    model: {
                        fields: {
                            Id: { type: "string" },
                            Value: { type: "string" },
                            Comment: { type: "string" }
                        }
                    }
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            height: 550,
            filterable: true,
            sortable: true,
            pageable: true,
            columns: [
                {
                    field: "Id",
                    title: "Id"

                },
                {
                    field: "Value",
                    title: "Value"
                },
                {
                    field: "Comment",
                    title: "Comment"
                }
            ]
        });
    }
);