import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CreateInput = ({ mainClass = "", valueTextContent = "", titleText = "NaN", editable = false }) => {
    let classTmp = `${mainClass}`;
    return (
        <input type="text" className={classTmp} name={mainClass} defaultValue={valueTextContent} title={titleText} readOnly={editable}/>
    );
};
CreateInput.prototype = {
    mainClass: PropTypes.string,
    valueTextContent: PropTypes.string,
    titleText: PropTypes.string,
    editable: PropTypes.bool
};

export default CreateInput;