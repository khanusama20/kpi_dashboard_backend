const { HierarchyMasterJoiSchema } = require('./masters.joi');
const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');
const { generateUID } = require('../../utilities/generateUID');

let createHierarchy = async function (req, res) {
  try {
    await HierarchyMasterJoiSchema.validateAsync(req.body);
    let hierarchy_code = await generateUID('HC');

    const insertQuery = `
      INSERT INTO hierarchies (
        hierarchy_code,
        hierarchy_name,
        level_code,
        channel_id,
        status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
      RETURNING *;
    `;

    const values = [
      hierarchy_code,
      req.body.hierarchy_name,
      req.body.level_code,
      req.body.channel_id,
      1
    ];

    pool.query(insertQuery, values, (error, result) => {
      if (error) {
        console.error(error.stack)
        resManager.DatabaseError(req, res, 'Database error: ' + error.message);
      } else {

        // To increate auto increment id
        const updateQuery = `UPDATE uid_index SET hc = hc + 1`;
        pool.query(updateQuery, (error) => {
          if (!error) {
            console.log("UID is updated successfully")
          } else {
            console.error(error.stack)
          }
        });
        resManager.success(req, res, result.rows);
      }
    });

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
  createHierarchy: createHierarchy
}