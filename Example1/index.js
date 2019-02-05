/**
 * This is the entry point to the application, and it's structure
 * is dictacted by the ESM package's documentation.
 *
 * In short, ESM allows the use of ES6 type modules by wrapping commonjs
 *
 * See ESM for more details
 */
require = require('esm')(module);
module.exports = require('./main.js');
