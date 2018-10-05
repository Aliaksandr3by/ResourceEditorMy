
var count = 0;
$("#addTableRow").click(
    function myfunction() {
        $('#mainTable').children('tbody').append(`<tr></tr>`);
        let tablAddRow2 = $('#mainTable').children('tbody').children('tr');
        tablAddRow2.last().append(`<th><input scope="row" type="text" name="list[${count}].Id" /></th>`);
        tablAddRow2.last().append(`<td><input type="text" name="list[${count}].Value" /></td>`);
        tablAddRow2.last().append(`<td><input type="text" name="list[${count}].Comment" /></td>`);
        count++;
    }
);

$('#rootMainTable').on('click', '.deleteLineButton', $(this), function (e) {
    var that = $(this);
    $.ajax({
        type: 'GET',
        url: urlControlActionDelete,
        data: {
            Id: $('#countrySelect').val(),
            list: that.val()
        },
        success: function (data, textStatus) {
            console.log(textStatus);
            //location.reload();

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
            { command: "destroy", title: "Action", width: "150px" },
            { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
        ],
        editable: "inline"
    });
}

function createDataSource() {
    let dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.ajax({
                    url: crudServiceBaseUrlRead,
                    type: 'POST',
                    dataType: "json",
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
            update: {
                type: 'POST',
                url: crudServiceBaseUrlUpdate,
                //dataType: "jsonp"
            },
            create: {
                type: 'POST',
                url: crudServiceBaseUrlCreate,
                dataType: "json"
            },
            destroy: {
                url: crudServiceBaseUrlDelete,
                dataType: "json"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return { models: kendo.stringify(options.models) };
                }
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
