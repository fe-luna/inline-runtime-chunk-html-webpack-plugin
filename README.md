# inline-runtime-chunk-html-webpack-plugin

[![npm](https://img.shields.io/npm/v/inline-runtime-chunk-html-webpack-plugin.svg)](https://www.npmjs.com/package/inline-runtime-chunk-html-webpack-plugin)

Inline Webpack's runtime chunks to the output html to save http request. It requires [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) and Webpack 5.

## Installation

``` sh
npm install inline-runtime-chunk-html-webpack-plugin --save-dev
```


## Usage

``` js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineRuntimeChunkPlugin = require('inline-runtime-chunk-html-webpack-plugin');

module.exports = {
  output: {
    // the default value of output.publicPath is "auto"
    // but it can\'t not automatically determine after inline runtime chunk within html
    // you can set publicPath to '' to get similar results
    publicPath: '',
    filename: '[name].[contenthash].js',
  },
  optimization: {
    // adds an additional chunk containing only the runtime to entrypoint
    runtimeChunk: 'single'
  },
  plugins: [
    new HtmlPlugin(),
    new InlineRuntimeChunkPlugin()
  ],
}
```
