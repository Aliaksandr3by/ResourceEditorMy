import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CreateSelect = (langList = {}) => {
    let datumTmp = langList.langList;
    if (typeof datumTmp === "string") {
        datumTmp = JSON.parse(datumTmp);
    }
    console.dir(datumTmp);
    return (
        <div className="input-group">
            <select className="custom-select" id="countrySelect" aria-label="Example select with button addon">
                <option disabled >Select language</option>
                {
                    Array.from(datumTmp).map(function (item, key, array) {
                        return (
                            <option key={key} value={item.Id}>{key + 1}. {item.Id} - {item.Value} ({item.Comment})</option>
                        );
                    })
                }
            </select>
            <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button" id="countrySelectRefresh">Refresh</button>
            </div>
            <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button" id="ResourceSave">Download</button>
            </div>
        </div>
    );
};
CountrySelect.prototype = {
    langList: PropTypes.object
};

export default CreateSelect;