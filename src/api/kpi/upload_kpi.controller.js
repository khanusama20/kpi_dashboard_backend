const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');
const async = require('async')

const bulkUploadKPI = async (req, res) => {
  try {
    let labels = await getKPILabels();
    if (labels.length === 0) {
      return;
    }

    let plainKPIObj = {};
    let size = labels.length;
    for (let i = 0; i < size; i++) {
      if (labels[i]['status'] == '1') {
        plainKPIObj = {
          ...plainKPIObj,
          [labels[i]['field_name']]: null
        }
      }
    }

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
    let kpiData = req.body.kpi_data || [];
    let bulk = [];
    async.everySeries(kpiData, (kpi, callback) => {
      // iterate obj
      let dataSchema = {};
      for (let props in mappingDirectory) {
        dataSchema = {
          ...dataSchema,
          [props]: kpi[mappingDirectory[props]]
        }
      }

      bulk.push(dataSchema);
      callback(null, true)
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
    let result = await pool.query('SELECT field_name, status FROM kpi_fields', []);
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