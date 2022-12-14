const resManager = require('../../utilities/responseManager'); // resManager = Response Managaer
const pool = require('../../config/connection.postgresql');

const agentKPI = async (req, res) => {
  try {
    let agentId = req.query.agent;
    if (!agentId) {
      resManager.BadRequest(req, res, 'Agent id is required, please send in the query section');
      return;
    }

    let promiseResult = await Promise.all(
      [
        new Promise((resolve, reject) => {
          pool.query(`SELECT * FROM agent_kpi WHERE agent_id = $1 ORDER BY kpi_date DESC LIMIT 1`, [agentId], (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result.rows)
            }
          })
        }),
        new Promise((resolve, reject) => {
          pool.query(`SELECT lable_name, field_name, status FROM kpi_fields`, [], (error, result) => {
            if (error) {
              reject(error)
            } else {
              let obj = {};
              for (let i = 0; i < result.rows.length; i++) {
                obj = {
                  ...obj,
                  [result.rows[i]['field_name']]: result.rows[i]['lable_name']
                }
              }
              resolve(obj);
            }
          })
        })
      ]
    );

    let master = promiseResult[1];
    let newMapping = promiseResult[0].map(e => {
      let mdElement = { ...e };
      for (let props in master) {
        let props_ = props.toLowerCase();
        mdElement = {
          ...mdElement,
          [master[props]]: e[props_]
        }
        delete mdElement[props_];
      }
      return mdElement;
    })
    resManager.success(req, res, newMapping);
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
  agentKPI: agentKPI
}