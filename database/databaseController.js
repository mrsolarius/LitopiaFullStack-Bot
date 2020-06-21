const { Pool } = require('pg');
const dbParam = require('./settings.json');
const pool = new Pool(dbParam);

module.exports = {
    query: (text, params) => pool.query(text, params),
};