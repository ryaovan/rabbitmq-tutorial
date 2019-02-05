module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'airbnb-base'],
  rules: {
    'brace-style': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-global-assign': 'warn',
    'linebreak-style': 0,
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'no-console': 0,
    'prefer-const': 2,
  },
};
