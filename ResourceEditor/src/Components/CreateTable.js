import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import CreateRow from './CreateRow';

const CreateTable = ({ datum = [], titles = [] }) => {
    let i = 0;
    for (let data of datum) {
        let _title = {
            "Id": "Missing item EN",
            "Value": "Missing item EN",
            "Comment": "Missing item EN"
        };
        for (let title of titles) {
            if (data.Id === title.Id) {
                _title = title;
            }
        }
        <CreateRow key={i++} data={data} titleText={_title} />;
    }

    return (
        <div>
            qwe
        </div>
        );


};
CreateTable.prototype = {
    data: PropTypes.array,
    titleText: PropTypes.array
};

export default CreateTable;