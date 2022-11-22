
const pool = require('../../config/connection.postgresql');

let getQueryResult = function () {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM uid_index', (error, result) => {
      if (error) {
        console.log("Error ", error)
        reject(error);
      } else {
        resolve(result.rows);
      }
    })
  });
}

const OPT = {
  'AG': 'agent_last_index',
  'CH': 'ch_last_index'
}

async function generateUID(initial = null) {
  try {
    let result = await getQueryResult();
    if (result.length === 0) {
      return null;
    }
    let _calendar_ = new Date();
    let current_year = _calendar_.getFullYear();
    let current_month = _calendar_.getMonth() + 1;
    
    // let current_month = AG21010001
    let currentIndex = result[0][OPT[initial]];
    console.log("initial : ", result[0][OPT[initial]])
    let year = result[0].current_year;
    if (current_year == year) {
      currentIndex = currentIndex + 1;
    } else {
      // Reset indexing for new year
      currentIndex = 0 + 1;
    }

    current_month = current_month < 10 ? '0'+current_month : current_month;
    if (currentIndex < 10) {
      currentIndex = '000'+currentIndex
    } else if (currentIndex >= 10 && currentIndex < 100) {
      currentIndex = '00'+currentIndex
    } else if (currentIndex >= 100 && currentIndex < 1000) {
      currentIndex = '0'+currentIndex
    }

    current_year = current_year.toString().slice(2);
    return initial+current_year+current_month+currentIndex;

  } catch (error) {
    throw error;
  }
}


module.exports = {
  generateUID: generateUID
}