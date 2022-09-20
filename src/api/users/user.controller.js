const moment = require('moment');
const bcrypt = require('bcrypt');
const { UserJoiSchema } = require('./user.joi');
const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');
const pattern = require('../../constants/pattern.regex');

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

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

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
      last_login_date,
      salt
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
      hash,
      data.emp_code,
      data.state,
      data.city,
      date,
      date,
      0,
      null,
      salt
    ];

    pool.query(insertQuery, values, (error, result) => {
      if (error) {
        console.error(error.stack)
        resManager.DatabaseError(req, res, 'Database error: ' + error.message);
      } else {
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

const login = async (req, res) => {
  try {
    const data = req.body;
    const query = 'SELECT salt, password, login_count FROM agents WHERE pan_no = $1';
    pool.query(query, [data.username], async (error, result) => {
      if (error) {
        console.error(error.stack)
        resManager.DatabaseError(req, res, 'Database error: ' + error.message);
      } else if (result.rows.length > 0) {
        let salt = result.rows[0].salt;
        const hash = bcrypt.hashSync(data.password, salt);
        if (hash !== result.rows[0].password) {
          resManager.Unauthorized(req, res, 'Invalid Credentials')
        } else {
          try {
            let login_count = result.rows[0].login_count + 1;
            let date = moment().format();
            
            let user_details = await pool
              .query('UPDATE agents SET last_login_date = $1, login_count = $2 WHERE pan_no = $3 RETURNING *;',
                [date, login_count, data.username]
              );
            resManager.success(req, res, user_details.rows);
          } catch (error) {
            resManager.InternalServerError(req, res, error.message);
          }
        }
      } else {
        resManager.success(req, res, result.rows);
      }
    })
  } catch (error) {
    resManager.InternalServerError(req, res, error.message);
  }
}
module.exports = {
  agentSignUp,
  login
}