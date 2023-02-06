const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const common = require('./webpack.config');
const environment = require('./environment');

module.exports = merge(common, {
  mode: 'development',
  /* Manage source maps generation process */
  devtool: 'cheap-module-source-map',
  /* Development Server Configuration */
  devServer: {
    static: {
      directory: environment.paths.output,
      publicPath: '/',
      watch: true,
    },
    client: {
      overlay: true,
    },
    open: true,
    compress: true,
    hot: false,
    ...environment.server,
  },
   /* File watcher options */
   watchOptions: {
    aggregateTimeout: 300,
    poll: 300,
    ignored: /node_modules/,
  },
  plugins: [new Dotenv({ path: './.env.ext' })],
});

// const { join } = require('path');
// module.exports = {
//     entry: {
//         index: './src/index.js'
//     },
//     output: {
//         path: join(__dirname, 'public'),
//         filename: '[name].bundle.js',
//     },
//     devServer: {
//         port: 3010,
//         static: join(__dirname, 'public'),
//         // watchContentBase: true,
//         open: true,
//     },
//     module: {
//         rules: [
//           {
//             test: /\.js|jsx/,
//             exclude: /node_modules/,
//             use: {
//               loader: 'babel-loader',
//             },
//             resolve: {
//               extensions: ['', '.js', '.jsx'],
//             },
//           },
//           {
//             test: /.s?css$/,
//             exclude: /node_modules/,
//             use: ['style-loader', 'css-loader', 'sass-loader'],
//           },
//           {
//             test: /\.svg/,
//             use: {
//               loader: 'svg-url-loader',
//               options: {
//                 // make all svg images to work in IE
//                 iesafe: true,
//               },
//             },
//           },
//         ],
//     },
// };