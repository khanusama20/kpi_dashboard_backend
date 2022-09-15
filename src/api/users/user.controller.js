const moment = require('moment');
const { UserJoiSchema } = require('./user.joi');
const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');

/**
 * 
 * @param { Object } req 
 * @param { Object } res 
 */
const agentSignUp = async (req, res) => {
  try {
    await UserJoiSchema.validateAsync(req.body);
    let data = req.body;
    let age = moment(req.body.birth_date.split('/').join(''), 'MMDDYYYY').fromNow();
    let date = moment().format();

    age = age.split(' ')[0];

    const insertQuery = `
    INSERT INTO agents(
      first_name,
      last_name,
      pan_no,
      email,
      mobile_no,
      gender,
      birth_date,
      age,
      password,
      emp_code,
      state,
      city,
      created_at,
      updated_at,
      login_count,
      last_login_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *;
    `;

    const values = [
      data.first_name,
      data.last_name,
      data.pan_no,
      data.email,
      data.mobile_no,
      data.gender,
      data.birth_date,
      age,
      data.password,
      data.emp_code,
      data.state,
      data.city,
      date,
      date,
      0,
      null
    ];

    pool.query(insertQuery, values, (error, result) => {
      if (error) {
        console.error(error.stack)
        resManager.DatabaseError(req, res, 'Database error: ' + error.message);
        pool.end();
      } else {
        resManager.success(req, res, result.rows);
        pool.end();
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
  agentSignUp
}