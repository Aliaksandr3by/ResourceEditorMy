
$(document).ready(function () {
    $("#grid").kendoGrid({
        dataSource: {
            type: "odata",
            transport: {
                read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Customers"
            },
            pageSize: 20
        },
        height: 550,
        groupable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            template: "<div class='customer-photo'" +
                "style='background-image: url(../content/web/Customers/#:data.CustomerID#.jpg);'></div>" +
                "<div class='customer-name'>#: ContactName #</div>",
            field: "ContactName",
            title: "Contact Name",
            width: 240
        }, {
            field: "ContactTitle",
            title: "Contact Title"
        }, {
            field: "CompanyName",
            title: "Company Name"
        }, {
            field: "Country",
            width: 150
        }]
    });
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

$(".deleteLineButton").on("click", $(this), function () {
    var that = $(this);

    $.ajax({
        type: "GET",
        url: urlControlDeleteMethod,
        data: {
            Id: $('#countrySelect').val(),
            IdDeleteElement: that.val()

        },
        success: function(data, textStatus) {
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

$("#countrySelect").change( function () {
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
