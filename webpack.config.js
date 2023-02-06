const { join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bg: "./src/ServiceWorker/index.ts",
    extension: "./src/Extension/index.tsx"
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '',
  },
  // devServer: {
  //   port: 3011,
  //   static: join(__dirname, 'dist'),
  //   open: true,
  // },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./public" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$|tsx/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
        resolve: {
          extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
        },
      },
      {
        test:/\.js$|jsx/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
        resolve: {
          extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
        },
      },
      {
        test: /.s?css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag",
              attributes: {id: 'iffy-styles'},
            },
          },
          'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg/,
        use: {
          loader: 'svg-url-loader',
          options: {
            // make all svg images to work in IE
            iesafe: true,
          },
        },
      },
    ],
  },
  target: 'web'
};
