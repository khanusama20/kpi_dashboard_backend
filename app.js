const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// db connection
const pool = require('./config/connection.postgresql');

try {
  pool.query('SELECT $1::text as message', ['Database connection established!'], (err, res) => {
    console.log(err ? err.stack : res.rows[0].message); // Hello World!
  })
} catch (error) {
  console.log("Something went wrong while connecting to databases");
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const PORT = 5025;
app.listen(PORT, () => {
  console.log("Server started successfully on " + PORT);
})