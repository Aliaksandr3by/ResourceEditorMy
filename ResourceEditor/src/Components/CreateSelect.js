import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { isArray } from 'util';

const CreateSelect = (datum = {}) => {
    const datumTmp = datum.datum;
    return (
        <div className="input-group">
            <select className="custom-select" id="countrySelect" aria-label="Example select with button addon">
                <option disabled >Select language</option>
                {
                    datumTmp.map((item, key, array) => {
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
    data: PropTypes.object
};

export default CreateSelect;