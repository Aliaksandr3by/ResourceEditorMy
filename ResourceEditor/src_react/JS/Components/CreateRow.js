import React, { Component } from "react";
import PropTypes from "prop-types";

import CreateButton from "./CreateButton";
import CreateInput from "./CreateInput";
import CreateTextArea from "./CreateTextarea";

const CreateRow = ({ datum = {}, titleText = {} }) => {
    const buttonName = datum.Id !== "" ? "Save" : "Insert";
    const InputMainClassId = `inputDataId form-control d-flex w-100 ${titleText.Id ? "" : "error"}`;
    const TextAreaMainClassValue = `inputDataValue form-control d-flex w-100 ${titleText.Id ? "" : "error"}`;
    const TextAreaMainClassComment = `inputDataComment form-control d-flex w-100 ${titleText.Id ? "" : "error"}`;
    const ButtonMainClassSave = `saveLineButton btn btn-info d-inline w-100`;
    const ButtonMainClassDelete = `deleteLineButton  btn btn-danger d-inline w-100`;


    return (
        <tr>
            <th><CreateInput mainClass={InputMainClassId} valueTextContent={datum.Id} titleText={titleText.Id} editable={String(datum.Id).length > 0} /></th>
            <td><CreateTextArea mainClass={TextAreaMainClassValue} valueTextContent={datum.Value} titleText={titleText.Value} editable={false} /></td>
            <td><CreateTextArea mainClass={TextAreaMainClassComment} valueTextContent={datum.Comment} titleText={titleText.Comment} editable={false} /></td>
            <td><CreateButton mainClass={ButtonMainClassSave} valueTextContent={buttonName} titleText="" /></td>
            <td><CreateButton mainClass={ButtonMainClassDelete} valueTextContent="DELETE" titleText="" /></td>
        </tr>
    );
};
CreateRow.prototype = {
    data: PropTypes.object,
    titleText: PropTypes.object
};

export default CreateRow;