import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CreateRow from './CreateRow';

const CreateTable = ({ dataResource = [{ "Id": "", "Value": "", "Comment": "" }], titleResource = [{ "Id": "", "Value": "", "Comment": "" }] }) => {
    return (
        <table className="table" id="mainTable">
            <caption>ResX data view</caption>
            <thead className="thead-dark" id="mainDataHeadTable">
                <tr>
                    <th scope="col"><button className="BtnSort btn btn-outline-info btn-block" value="Id" id="BtnSortId" type="button">Id</button></th>
                    <th scope="col"><button className="BtnSort btn btn-outline-info btn-block" value="Value" id="BtnSortValue" type="button">Value</button></th>
                    <th scope="col"><button className="BtnSort btn btn-outline-info btn-block" value="Comment" id="BtnSortComment" type="button">Comment</button></th>
                    <th scope="col" />
                    <th scope="col" />
                </tr>
            </thead>
            <thead className="thead-light" id="mainDataHeadFilterTable">
                <tr>
                    <th scope="col"><input type="search" className="inputSearch form-control d-flex" name="Id" placeholder="Filter by Id" /></th>
                    <th scope="col"><input type="search" className="inputSearch form-control d-flex" name="Value" placeholder="Filter by Value" /></th>
                    <th scope="col"><input type="search" className="inputSearch form-control d-flex" name="Comment" placeholder="Filter by Comment" /></th>
                    <th scope="col" colSpan={2}><button className="btn btn-outline-danger btn-block" id="BtnClear" type="button">Clear</button></th>
                </tr>
            </thead>
            <tbody id="mainDataBodyTable">
                {
                    dataResource.map((data, key) => {
                        let _title = {};
                        titleResource.map((title) => {
                            if (data.Id === title.Id) {
                                _title = title;
                            }
                        });

                        return (
                            <CreateRow key={key} datum={data} titleText={_title} />
                        );
                    })
                }
            </tbody>
        </table>
    );
};
CreateTable.prototype = {
    dataResource: PropTypes.array,
    titleResource: PropTypes.array
};

export default CreateTable;