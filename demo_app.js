const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  // database: '<YOUR_DB_NAME>',
  // password: '<YOUR_PASSWORD>',
  database: 'iorta_demo',
  password: 'apple',
  port: 5432,
})

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post('/add-agent', (req, res) => {
  let first_name = req.body.firstName;
  let last_name = req.body.lastName;

  // You can create seprate file for that
  pool.query('SELECT * FROM uid', (error, result) => {
    if (error) {
      console.log("Error ", error)
      res.status(500).send({
        CODE: 'ERROR1',
        TXT: error.message
      });
      return;
    }

    let _calendar_ = new Date();
    let latest_year = _calendar_.getFullYear();
    let latest_month = _calendar_.getMonth() + 1;

    let last_index = result.rows[0].last_index;
    let month = result.rows[0].current_month;

    if (month == latest_month) {
      last_index += 1;
    } else {
      const updateQuery = `UPDATE uid SET current_month = ${latest_month}, last_index = 1`;
      pool.query(updateQuery, (error) => {
        if (!error) {
          console.log("UID is updated successfully");
        } else {
          console.error(error.stack)
        }
      });
      last_index = 1;
    }

    latest_month = latest_month < 10 ? '0' + latest_month : latest_month;
    if (last_index < 10) {
      last_index = '000' + last_index
    } else if (last_index >= 10 && last_index < 100) {
      last_index = '00' + last_index
    } else if (last_index >= 100 && last_index < 1000) {
      last_index = '0' + last_index
    }

    latest_year = latest_year.toString().slice(2);
    // =========================== please try to seprate it=============
    let newAgentID = 'AG' + latest_year + latest_month + last_index;
    console.log("newAgentID ", newAgentID);
    const insertQuery = `
    INSERT INTO agents_clone(
      agent_id,
      first_name,
      last_name
    ) VALUES ($1, $2, $3)
    RETURNING *;
    `;

    pool.query(insertQuery, [
      newAgentID,
      first_name,
      last_name
    ], (error, result) => {
      if (error) {
        console.error(error.stack)
        res.status(500).send({
          CODE: 'ERROR',
          TXT: error.message
        });
      } else {
        const updateQuery = `UPDATE uid SET last_index = last_index + 1`;
        pool.query(updateQuery, (error) => {
          if (!error) {
            console.log("UID is updated successfully")
          } else {
            console.error(error.stack)
          }
        });
        res.status(200).send({
          CODE: 'SUCCESS',
          TXT: result.rows
        });
      }
    });
  })
});

const PORT = 5025;
app.listen(PORT, () => {
  console.log("Server started successfully on " + PORT);
})


