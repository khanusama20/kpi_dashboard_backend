const { DesignationMasterJoiSchema } = require('./masters.joi');
const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');
const { generateUID } = require('../../utilities/generateUID');

let createDesignation = async function (req, res) {
  try {
    await DesignationMasterJoiSchema.validateAsync(req.body);
    let designationId = await generateUID('DC');

    const insertQuery = `
      INSERT INTO designations (
        desig_id,
        desig_name,
        channel_id,
        hierarchy_id,
        role_id,
        status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, current_timestamp, current_timestamp)
      RETURNING *;
    `;

    const values = [
      designationId,
      req.body.designation_name,
      req.body.channel_id,
      req.body.hierarchy_id,
      req.body.role_id,
      1
    ];

    pool.query(insertQuery, values, (error, result) => {
      if (error) {
        console.error(error.stack)
        resManager.DatabaseError(req, res, 'Database error: ' + error.message);
      } else {

        // To increate auto increment id
        const updateQuery = `UPDATE uid_index SET dc = dc + 1`;
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
  createDesignation: createDesignation
}