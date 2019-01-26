"use strict";
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const paths = {
    DIST: path.resolve(__dirname, "public"),
    SRC: path.resolve(__dirname, "src_react"),
    JS: path.resolve(__dirname, "src_react/js"),
};

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: path.join(paths.JS, "index.js"),
    output: {
        path: paths.DIST,
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader",
                ],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ],
    },
    plugins: [
        new ExtractTextPlugin("bundle.css"),
    ]
};
