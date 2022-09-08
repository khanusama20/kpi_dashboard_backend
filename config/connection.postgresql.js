const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sdx',
  password: 'apple',
  port: 5432,
})

module.exports = pool;