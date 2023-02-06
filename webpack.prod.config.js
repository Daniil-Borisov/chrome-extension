const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const common = require('./webpack.config');

module.exports = merge(common, {
  mode: 'production',
  /* Manage source maps generation process. Refer to https://webpack.js.org/configuration/devtool/#production */
  devtool: false,
  plugins: [new Dotenv({ path: './.env.prod' })],
});
