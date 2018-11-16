import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import CreateButton from './CreateButton';
import CreateInput from './CreateInput';

const CreateRow = ({ data = { "Id": "", "Value": "", "Comment": "" }, titleText = { "Id": "", "Value": "", "Comment": "" } }) => {
    const buttonName = data.Id !== "" ? "Save" : "Insert";
    return (
        <tr>
            <th><CreateInput mainClass="inputDataId" valueTextContent={data.Id} titleText={titleText.Id} editable={String(data.Id).length > 0} /></th>
            <td><CreateInput mainClass="inputDataValue" valueTextContent={data.Value} titleText={titleText.Value} editable={false} /></td>
            <td><CreateInput mainClass="inputDataComment" valueTextContent={data.Comment} titleText={titleText.Comment} editable={false} /></td>
            <td><CreateButton mainClass="saveLineButton btn btn-info d-inline w-100" valueTextContent={buttonName} titleText="" /></td>
            <td><CreateButton mainClass="deleteLineButton  btn btn-danger d-inline w-100" valueTextContent="DELETE" titleText="" /></td>
        </tr>
    );
};
CreateRow.prototype = {
    data: PropTypes.object,
    titleText: PropTypes.string
};

export default CreateRow;