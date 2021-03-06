module.exports = {
  env: {
    es6: true,
    browser: true
  },
  extends: "standard",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {}
};
