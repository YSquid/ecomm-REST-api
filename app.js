const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.EXPRESS_PORT || 3000;
const passport = require("passport");
require("./passportConfig")(passport);

module.exports = app;

//Middleware for parsing request bodies
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))

//Mount apiRouter (from routes/api) at '/api' path
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

//Homepage route
app.get("/", (req, res) => {
  res.render("home.ejs", { name: "Ahmad" });
});

//Login routes
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  //placeholder
  res.send('Login placeholder')
})

//Register route
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post(
"/register", 
  passport.authenticate("local-signup", { session: false }), (req, res, next) => {
  res.json({user: req.user})
})

//Default error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send(
      "Bad request - check the url and path paramters you are sending. Error message:" +
        err
    );
});


app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
  // console.log(process.env) -- confirming process.env object
});
