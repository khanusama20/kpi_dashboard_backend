const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');
const { KPILabelMasterJoiSchema } = require('./kpi.joi');

const addNewLabel = async (req, res) => {
  try {
    await KPILabelMasterJoiSchema.validateAsync(req.body, {
      abortEarly: false
    });

    const insertQuery = `
      INSERT INTO kpi_fields(
        field_name,
        status,
        created_at
      ) VALUES ($1, $2, current_timestamp)
      RETURNING *;
    `;

    let result = await pool.query(insertQuery, [ req.body.field_name, 1 ]);
    
    // if success then we add new column in the kpi table
    let col_name = req.body.field_name.split(' ').join('_');
    const alterQuery = `ALTER TABLE agent_kpi ADD COLUMN ${col_name} VARCHAR(20);`
    let updatedResult = await pool.query(alterQuery, []);

    const updateQuery = `UPDATE agent_kpi SET ${col_name} = $1 RETURNING *;`;
    let setResult = await pool.query(updateQuery, [null]);

    console.log("New column affected", updatedResult.rows, setResult.rows);
    resManager.success(req, res, result.rows);
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
  addNewLabel: addNewLabel
}