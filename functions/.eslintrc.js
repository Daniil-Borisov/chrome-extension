/* eslint-disable comma-dangle */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    "ecmaVersion": 12,
    "parser": "@babel/eslint-parser"
  },
  extends: [
    "eslint:recommended",
    "google"
  ],
  rules: {
    "quotes": ["error", "double"],
    "linebreak-style": ["off", "windows"]
  }
};
