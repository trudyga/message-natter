const mysql = require('./mysql');

let model;
if (process.env.STORAGE_MODEL === 'mysql')
    model = mysql;

module.exports = model;