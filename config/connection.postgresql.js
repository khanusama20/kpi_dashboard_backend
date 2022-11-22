const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'iorta_demo',
  password: 'apple',
  port: 5432,
})

module.exports = pool;