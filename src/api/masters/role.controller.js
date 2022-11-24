const { RoleMasterJoiSchema } = require('./channel.joi');
const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');
const { generateUID } = require('../../utilities/generateUID');

let createRole = async function (req, res) {
  try {
    await RoleMasterJoiSchema.validateAsync(req.body);
    let role_id = await generateUID('RC');

    const insertQuery = `
    INSERT INTO roles(
      role_id,
      role_name,
      status,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, current_timestamp, current_timestamp)
    RETURNING *;
    `;

    const values = [
      role_id,
      req.body.role_name,
      1
    ];

    pool.query(insertQuery, values, (error, result) => {
      if (error) {
        console.error(error.stack)
        resManager.DatabaseError(req, res, 'Database error: ' + error.message);
      } else {

        // To increate auto increment id
        const updateQuery = `UPDATE uid_index SET rc = rc + 1`;
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
  createRole: createRole
}