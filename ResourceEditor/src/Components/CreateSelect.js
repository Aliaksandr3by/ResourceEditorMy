import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const CreateSelect = (datum) => {
    return (
        <div className="input-group" id="CountrySelect">
            <select className="custom-select" id="countrySelect" aria-label="Example select with button addon">
                <option disabled >Select language</option>
                {datum.map((item, key) => {
                    return (
                        <option value={item.Id} >`${key}. ${item.Id} - ${item.Value}(${item.Comment})`</option>
                    );
                })}
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
    data: PropTypes.array
};

export default CreateSelect;