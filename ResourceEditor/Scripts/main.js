
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
                Id: $('#countrySelect').val(),
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

$(document).ready(function () {
    $("#grid").kendoGrid({
        dataSource: {
            type: "odata",
            transport: {
                read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
            },
            schema: {
                model: {
                    fields: {
                        OrderID: { type: "number" },
                        Freight: { type: "number" },
                        ShipName: { type: "string" },
                        OrderDate: { type: "date" },
                        ShipCity: { type: "string" }
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
        columns: [{
            field: "OrderID",
            filterable: false
        },
            "Freight",
        {
            field: "OrderDate",
            title: "Order Date",
            format: "{0:MM/dd/yyyy}"
        }, {
            field: "ShipName",
            title: "Ship Name"
        }, {
            field: "ShipCity",
            title: "Ship City"
        }
        ]
    });
});