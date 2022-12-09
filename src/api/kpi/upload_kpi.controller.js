const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');
const async = require('async')

const bulkUploadKPI = async (req, res) => {
  try {
    let labels = await getKPILabels();
    if (labels.length === 0) {
      return;
    }

    const months = {
      "january": "01",
      "february": "02",
      "march": "03",
      "april": "04",
      "may": "05",
      "june": "06",
      "july": "07",
      "august": "08",
      "september": "09",
      "october": "10",
      "november": "11",
      "december": "12"
    };

    if (!months[req.body.month.toLowerCase()]) {
      resManager.BadRequest(req, res, `Please verify month name once, ${Object.keys(months).join(", ")}`);
      return;
    }

    if (!/^(19|20)\d{2}$/.test(req.body.year)) {
      resManager.BadRequest(req, res, `Invalid year input`);
      return;
    }

    let plainKPIObj = {};
    let size = labels.length;
    for (let i = 0; i < size; i++) {
      if (labels[i]['status'] == '1') {
        plainKPIObj = {
          ...plainKPIObj,
          [labels[i]['lable_name']]: labels[i]['field_name']
        }
      }
    }

    // resManager.success(req, res, {
    //   db_table_cols: db_table_cols,
    //   lastValue: lastValue,
    //   identifiers: identifiers
    // });
    // return;

    let colMapping = await getKPIColumnMapping(req.query.kpi_for);
    let mappingDirectory = {};
    size = colMapping.length;
    for (let i = 0; i < size; i++) {
      mappingDirectory = {
        ...mappingDirectory,
        [colMapping[i]['label_name']]: colMapping[i]['sheet_col_name']
      }
    }

    // resManager.success(req, res, mappingDirectory);
    // return;

    // resManager.success(req, res, mappingDirectory);
    let kpiData = req.body.kpi_data || [];
    let bulk = [];

    let db_table_cols = 'agent_id, kpi_date, month_name, year_txt, ';
    let identifiers = '$1, $2, $3, $4, ';
    let lastValue = 5;
    let insertQuery = '';
    async.everySeries(kpiData, (kpi, callback) => {
      // iterate obj
      let dataSchema = {};
      let values = [
        kpi["Agent ID"],
        new Date(),
        req.body.month.toLowerCase(),
        req.body.year,
      ];
      for (let props in mappingDirectory) {
        dataSchema = {
          ...dataSchema,
          [plainKPIObj[props]]: kpi[mappingDirectory[props]]
        }

        db_table_cols += plainKPIObj[props]+', ';
        identifiers += `$${lastValue}, `;
        lastValue += 1;
        values.push(kpi[mappingDirectory[props]])
      }

      insertQuery = `
        INSERT INTO agent_kpi(
          ${db_table_cols}
          created_at,
          updated_at
        ) VALUES (${identifiers} current_timestamp, current_timestamp)
        RETURNING *;
      `;

      pool.query(insertQuery, values, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          // These are static cols in the table
          db_table_cols = 'agent_id, kpi_date, month_name, year_txt, ';
          identifiers = '$1, $2, $3, $4, ';
          lastValue = 5;
          bulk.push(result);
          callback(null, true)
        }
      });      
    }, () => {
      resManager.success(req, res, bulk);
    })
  } catch (error) {
    console.log(error.stack);
    if (error.name === 'ValidationError') {
      resManager.BadRequest(req, res, error.message); 
    } else {
      resManager.InternalServerError(req, res, error.message); 
    }
  }
}

const getKPILabels = async () => {
  try {
    let result = await pool.query('SELECT lable_name, field_name, status FROM kpi_fields', []);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

const getKPIColumnMapping = async (filter = '') => {
  try {
    let result = await pool.query('SELECT label_name, sheet_col_name FROM kpi_mapping WHERE mapping_for = $1', [filter]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  bulkUploadKPI: bulkUploadKPI
}