const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'empkpi',
  password: 'apple',
  port: 5432,
})

module.exports = pool;