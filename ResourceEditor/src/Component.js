import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const titleText = (titleText) => {
    return {
        "Id": !!titleText && "Id" in titleText ? titleText.Id : "",
        "Value": !!titleText && "Value" in titleText ? titleText.Value : "",
        "Comment": !!titleText && "Comment" in titleText ? titleText.Comment : ""
    };
};

export const CreateInput = ({ mainClass = "", valueTextContent = "", titleText = "NaN", editable = false }) => {
    let classTmp = `${mainClass} form-control d-inline w-100`;
    return (
        <input type="text" className={classTmp} name={mainClass} defaultValue={valueTextContent} title={titleText} readOnly={editable}></input>
    );
};
CreateInput.prototype = {
    mainClass: PropTypes.string,
    valueTextContent: PropTypes.string,
    titleText: PropTypes.string,
    editable: PropTypes.bool
}

export const CreateButton = ({ mainClass = "", valueTextContent = "NaN", titleText = "NaN" }) => {
    return (
        <button type="button" className={mainClass} title={titleText}>{valueTextContent}</button>
    );
}
CreateButton.prototype = {
    mainClass: PropTypes.string,
    valueTextContent: PropTypes.string,
    titleText: PropTypes.string
}

export const CreateRow = ({ data, titleText }) => {
    const buttonName = data.Id !== "" ? "Save" : "Insert";
    return (
        <tr>
            <th><CreateInput mainClass="inputDataId" valueTextContent={data.Id} titleText={titleText.Id} editable={String(data.Id).length > 0} ></CreateInput></th>
            <td><CreateInput mainClass="inputDataValue" valueTextContent={data.Value} titleText={titleText.Value} editable={false} ></CreateInput></td>
            <td><CreateInput mainClass="inputDataComment" valueTextContent={data.Comment} titleText={titleText.Comment} editable={false} ></CreateInput></td>
            <td><CreateButton mainClass="saveLineButton btn btn-info d-inline w-100" valueTextContent={buttonName} titleText="" ></CreateButton></td>
            <td><CreateButton mainClass="deleteLineButton  btn btn-danger d-inline w-100" valueTextContent="DELETE" titleText="" ></CreateButton></td>
        </tr>
    );
};
