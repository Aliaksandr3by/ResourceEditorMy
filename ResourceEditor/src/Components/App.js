import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { HashRouter, Route, Switch, Link } from 'react-router-dom';


export default class Summary extends Component {
    constructor(props) {
        super(props);
    }

    static propType = {
        ingredients: PropTypes.number,
        steps: PropTypes.number,
        title: (props, propName) =>
            (typeof props[propName] !== 'string') ?
                new Error("A title must be a string") :
                (props[propName].length > 20) ?
                    new Error(`title is over 20 characters`) :
                    null
    }

    static defaultProps = {  ///неясен смысл
        ingredients: 0,
        steps: 0,
        title: "[recipe]"
    }

    render() {
        const { ingredients = -1, steps = -1, title = "unknown" } = this.props
        return (
            <div className="summary">
                <h1>{title}</h1>
                <p>
                    <span>{ingredients} Ingredients | </span>
                    <span>{steps} Steps</span>
                </p>
            </div>
        )
    }
}