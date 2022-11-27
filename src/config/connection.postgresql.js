const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'iorta_demo',
  password: 'apple',
  port: 5432,
})

function psPool (query = '', values = [], cb = null) {
  console.log(`SQL>>> ${query}`, values);
  if (!cb) {
    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, result) => {
        if (error) {
          console.error(error.stack);
          reject(error);
          return;
        }
        console.log("Query executed successfully!...");
        resolve(result);
      })
    });
  } else {
    pool.query(query, values, (error, result) => {
      if (error) {
        console.error(error.stack);
        cb(error, null);
        return;
      }
      console.log("Query executed successfully!...");
      cb(null, result);
    })
  }
}

module.exports = {
  query: psPool
};