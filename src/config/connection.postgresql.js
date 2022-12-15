const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'iorta_demo',
  password: 'apple',
  port: 5432,
})
const log = require('./logger')();

function psPool (query = '', values = [], cb = null) {
  // independent
  setTimeout(() => {
    let log_query = query;
    for (let i = 0; i < values.length; i++) {
      let code = typeof(values[i]) == 'string' ? 1 : 0;
      log_query = log_query.replace('$'+(i+1), code == 1 ? `'${values[i]}'`: values[i]);
    }
    log.info(log_query);
    // log.info(`SQL>>> ${log_query}`);
  }, 0);
  
  if (!cb) {
    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, result) => {
        if (error) {
          log.error(error.stack);
          reject(error);
          return;
        }
        log.info("Query executed successfully!...");
        resolve(result);
      })
    });
  } else {
    pool.query(query, values, (error, result) => {
      if (error) {
        log.error(error.stack);
        cb(error, null);
        return;
      }
      log.info("Query executed successfully!...");
      cb(null, result);
    })
  }
}

module.exports = {
  query: psPool
};