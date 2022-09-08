const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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