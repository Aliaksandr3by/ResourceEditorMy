import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CreateTextArea = ({ mainClass = "", valueTextContent = "", titleText = "missing data", editable = false }) => {
    let classTmp = `${mainClass}`;
    return (
        <textarea className={classTmp} name={mainClass} title={titleText} readOnly={editable} rows={1} defaultValue={valueTextContent}/>
    );
};
CreateTextArea.prototype = {
    mainClass: PropTypes.string,
    valueTextContent: PropTypes.string,
    titleText: PropTypes.string,
    editable: PropTypes.bool
};

export default CreateTextArea;