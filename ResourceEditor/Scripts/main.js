
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
$('#rootMainTable').on('click', '.deleteLineButton', $(this), function (e) {
    var that = $(this);
    $.ajax({
        type: 'GET',
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

//селектор в 2х местах, события для одного
$('#countrySelect').change(function (e) {
    let that = $(this);
    $.ajax({
        type: 'POST',
        url: urlControlEditMethod,
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

$('#countrySelectKendo').change(function (e) {
    let that = $(this);
    $.ajax({
        type: 'POST',
        url: urlJsonResolverMethod,
        data: {
            Id: $('#countrySelectKendo').val()
        },
        success: function (data, textStatus) {
            console.log(textStatus);
            $("#grid").empty();
            let products = jQuery.parseJSON(data);
            createTable(products);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.error(xhr);
            console.error(ajaxOptions);
            console.error(thrownError);
        }
    });
});

function createTable(el) {
    $("#grid").kendoGrid({
        dataSource: {
            data: el,
            autoSync: true,
            schema: {
                model: {
                    fields: {
                        id: "Id",
                        Id: { type: "string", editable: false, nullable: false  },
                        Value: { type: "string" },
                        Comment: { type: "string" }

                    }
                }
            },
            pageSize: 1000,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
        },
        height: 550,
        filterable: true,
        sortable: true,
        pageable: true,
        toolbar: ["create"],
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
            },
            { command: "destroy", title: "Action", width: "150px" }
        ]
    });
}
