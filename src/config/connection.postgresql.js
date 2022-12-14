const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'iorta_demo',
  password: 'apple',
  port: 5432,
})

function psPool (query = '', values = [], cb = null) {
  // independent
  setTimeout(() => {
    let log_query = query;
    for (let i = 0; i < values.length; i++) {
      let code = typeof(values[i]) == 'string' ? 1 : 0;
      log_query = log_query.replace('$'+(i+1), code == 1 ? `'${values[i]}'`: values[i]);
    }
    console.log(`SQL>>> ${log_query}`);
  }, 0);
  
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