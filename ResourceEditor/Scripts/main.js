
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

$(function () {
    //var dataSource = createDataSource();
    //createTable(dataSource);
});

$('#countrySelectKendo').change(function (e) {
    var value = $(this).val();
    //var dataSource = $("#grid").data("kendoGrid").dataSource;
    createTable(createDataSource());
    //dataSource.filter({ field: "language", operator: "eq", value: value });
});

function createTable(data) {
    $("#grid").kendoGrid({
        dataSource: data,
        height: 550,
        filterable: true,
        sortable: true,
        pageable: true,
        toolbar: ["create", "save", "cancel"],
        columns: [
            { field: "Id", title: "Id" },
            { field: "Value", title: "Value" },
            { field: "Comment", title: "Comment" },
            { command: "destroy", title: "Action", width: "150px" }
        ],
        editable: true
    });
}

function createDataSource() {
    let dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.ajax({
                    url: crudServiceBaseUrlRead,
                    type: 'POST',
                    //dataType: "jsonp",
                    data: {
                        id: $('#countrySelectKendo').val()
                    },
                    success: function (result) {
                        options.success(result);
                    },
                    error: function (result) {
                        options.error(result);
                    }
                });
            },
            //read: {
            //    type: 'POST',
            //    url: crudServiceBaseUrlRead,
            //    //dataType: "jsonp",
            //    data: {
            //        id: $('#countrySelectKendo').val()
            //    }
            //},
            submit: function (e) {
                var data = e.data;
                console.log(data);

                e.success(data.updated, "update");
                e.success(data.created, "create");
                e.success(data.destroyed, "destroy");
                e.error(null, "customerror", "custom error");
            }
        },
        serverFiltering: true,
        pageSize: 20,
        scrollable: true,
        batch: true,
        sortable: true,
        filterable: true,
        schema: {
            model: {
                id: "Id",
                fields: {
                    Id: { type: "string", editable: false, nullable: false },
                    Value: { type: "string", editable: true, validation: { required: true } },
                    Comment: { type: "string", editable: true }
                }
            }
        }
    });
    return dataSource;
}
