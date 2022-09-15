const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const appRoutes = require('./src/routes/index.routes');

// db connection
const pool = require('./src/config/connection.postgresql');

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

app.use((req, res, next) => {
  console.log(`${req.method} ${process.env.SERVER_ADDRESS}${req.url}`);
  next();
})
app.use('/api/v1', appRoutes);

const PORT = 5025;
app.listen(PORT, () => {
  console.log("Server started successfully on " + PORT);
})