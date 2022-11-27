const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');
const { MappingJoiSchema } = require('./kpi.joi');
const async = require('async')

const columnMapping = async (req, res) => {
  try {
    await MappingJoiSchema.validateAsync(req.body, {
      abortEarly: false
    });

    const insertQuery = `
      INSERT INTO kpi_mapping(
        mapping_for,
        label_name,
        sheet_col_name,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, current_timestamp)
      RETURNING *;
    `;
    
    let refelected = [];
    async.everySeries(req.body.col_mappings, (item, callback) => {
      pool.query(insertQuery, [
        req.body.mapping_for,
        item.label_name,
        item.sheet_col_name,
        1
      ], (error, result) => {
        if (error) {
          callback(error, null)
        } else {
          console.log(result.rows);
          refelected.push(result.rows[0].id);
          callback(null, true);
        }
      })
    }, async error => {
      if (error) {
        // reverse -
        if (refelected.length > 0) {
          let elements = [];
          for (let i = 0; i < refelected.length; i++) {
            elements.push(`$${i+1}`);
          }
          let deleteQuery = `DELETE FROM kpi_mapping WHERE mapping_for IN (${elements.join(', ')})`;
          let deletedResult = await pool.query(deleteQuery, refelected);
          console.log("Deleted Result : ", deletedResult);
        }
        resManager.DatabaseError(req, res, 'Database error: ' + error.message);
      } else {
        resManager.success(req, res, "Mapping upgraded successfully");
      }
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

module.exports = {
  columnMapping: columnMapping
}