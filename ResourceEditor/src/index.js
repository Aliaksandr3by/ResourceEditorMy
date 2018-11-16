import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/scss/bootstrap.scss';

import CreateTable from './Components/CreateTable';


function CountrySelectUpdate(lang, url, sort = "Id", filter = "") {
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
            AjaxPOSTAsync(url, dataEN).then((titles) => {
                ReactDOM.render(<CreateTable datum={datum} titles={titles} />, rootMainTable);
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }
}

CountrySelectUpdate("it", urlControlSwitchLanguage, "");



/**
 * Ajax function
 * @param {string} url адрес контроллера
 * @param {object} object содержит идентификатор language языка
 * @returns {Promise} object
 */
function AjaxPOSTAsync(url, object) {
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