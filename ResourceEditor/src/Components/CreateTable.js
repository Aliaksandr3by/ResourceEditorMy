import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import CreateRow from './CreateRow';

const CreateTable = ({ datum = [{ "Id": "", "Value": "", "Comment": "" }], titles = [{ "Id": "", "Value": "", "Comment": "" }]}) => {
    return (
        <table className="table" id="mainTable">
            <thead className="thead-dark" id="mainDataHeadTable">
                <tr>
                    <th scope="col"><button className="BtnSort btn btn-outline-info btn-block" value="Id" id="BtnSortId" type="button">Id</button></th>
                    <th scope="col"><button className="BtnSort btn btn-outline-info btn-block" value="Value" id="BtnSortValue" type="button">Value</button></th>
                    <th scope="col"><button className="BtnSort btn btn-outline-info btn-block" value="Comment" id="BtnSortComment" type="button">Comment</button></th>
                    <th scope="col"/>
                    <th scope="col"/>
                </tr>
            </thead>
            <thead className="thead-light" id="mainDataHeadFilterTable">
                <tr>
                    <th scope="col"><input type="search" className="inputSearch form-control d-flex" name="Id" placeholder="Filter by Id" /></th>
                    <th scope="col"><input type="search" className="inputSearch form-control d-flex" name="Value" placeholder="Filter by Value" /></th>
                    <th scope="col"><input type="search" className="inputSearch form-control d-flex" name="Comment" placeholder="Filter by Comment" /></th>
                    <th scope="col" colSpan={2}><button className="BtnSort btn btn-outline-danger btn-block" id="BtnClear" type="button">Clear</button></th>
                </tr>
            </thead>
            <tbody id="mainDataBodyTable">
                {datum.map((data, key) => {
                    let _title = {
                        "Id": "Missing item EN",
                        "Value": "Missing item EN",
                        "Comment": "Missing item EN"
                    };
                    titles.map((title) => {
                        if (data.Id === title.Id) {
                            _title = title;
                        }
                    });

                    return (
                        <CreateRow key={key} data={data} titleText={_title} />
                    );
                })}
                
            </tbody>
        </table>
        );



    
};
CreateTable.prototype = {
    datum: PropTypes.array,
    titles: PropTypes.array
};

export default CreateTable;