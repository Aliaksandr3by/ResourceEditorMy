
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

