const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.EXPRESS_PORT || 3000;

module.exports = app;

//Middleware for parsing request bodies
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Mount apiRouter (from routes/api) at '/api' path
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

//Homepage route
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send("Bad request - check the url and path paramters you are sending. Error message:" + err);
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
  // console.log(process.env) -- confirming process.env object
});
