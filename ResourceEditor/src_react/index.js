import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import 'bootstrap';


import CreateSelect from './Components/CreateSelect';
import CreateTable from './Components/CreateTable';

document.addEventListener('DOMContentLoaded', function () {

    getCountryList(urlControlSelectCountry);
    //CountrySelectUpdate("it", urlControlSwitchLanguage);

    document.getElementById('CountrySelect').addEventListener('change', (e) => {
        const that = e.target.value;
        localStorage.setItem("countrySelect", String(that));
        getDataResourceWithTitle(that, urlControlSwitchLanguage, "", "");

    });

});



function getCountryList(url) {
    const CountrySelect = document.getElementById('CountrySelect');
    if (CountrySelect) {
        AjaxPOSTAsync(url).then((data) => {
            ReactDOM.render(<CreateSelect langList={data} />, CountrySelect);
        }).catch((error) => {
            console.error(error);
        });
    }
}

function getDataResourceWithTitle(lang, url, sort = "Id", filter = "") {
    const rootMainTable = document.getElementById('rootMainTable');

    if (rootMainTable) {
        const dataLG = {
            "language": lang,
            "sort": sort,
            "filter": filter
        };
        const dataEN = {
            "language": "en",
            "sort": sort,
            "filter": filter
        };
        AjaxPOSTAsync(url, dataLG).then((datum) => {
            if (!datum["error"]) {
                AjaxPOSTAsync(url, dataEN).then((titles) => {
                    ReactDOM.render(<CreateTable dataResource={datum} titleResource={titles} />, rootMainTable);
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                console.error(datum["error"]);
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}

/**
 * Ajax function
 * @param {string} url адрес контроллера
 * @param {object} object содержит идентификатор language языка
 * @returns {Promise} object
 */
function AjaxPOSTAsync(url, object = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.responseType = 'json';
        xhr.onload = (e) => {
            const that = e.target;
            if (that.status >= 200 && that.status < 300 || that.status === 304) {
                //resolve(JSON.parse(xhr.responseText));
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        if (object) {
            xhr.send(JSON.stringify(object));
        }
        else {
            xhr.send();
        }
    });
}
