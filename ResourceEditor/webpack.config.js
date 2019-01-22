"use strict";

const path = require("path");

// const WebpackNotifierPlugin = require("webpack-notifier");
// const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Constant with our paths
const paths = {
    DIST: path.resolve(__dirname, "public"),
    SRC: path.resolve(__dirname, "src_react"),
    JS: path.resolve(__dirname, "src_react/JS"),
};

module.exports = {
    mode: "development",
    entry: path.join(paths.JS, "index.js"),
    output: {
        path: paths.DIST,
        filename: "app.bundle.js",
    },
    plugins: [
        // new WebpackNotifierPlugin(),
        // new BrowserSyncPlugin(),
        // new ExtractTextPlugin('style.bundle.css')
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader",
                ],
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devtool: "inline-source-map"
};
