import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const CreateButton = ({ mainClass = "", valueTextContent = "NaN", titleText = "NaN" }) => {
    return (
        <button type="button" className={mainClass} title={titleText}>{valueTextContent}</button>
    );
};
CreateButton.prototype = {
    mainClass: PropTypes.string,
    valueTextContent: PropTypes.string,
    titleText: PropTypes.string
};

export default CreateButton;