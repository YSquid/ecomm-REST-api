const express = require("express");
const app = express();
require("dotenv").config();
const serverless = require("serverless-http");
const PORT = process.env.EXPRESS_PORT || 3000;
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
require("./passportConfig");
const cookieParser = require('cookie-parser')
const memoryStore = new session.MemoryStore();


//Middleware stack
//allows cross and setting of session for passport https://stackoverflow.com/questions/19043511/passport-js-fails-to-maintain-session-in-cross-domain
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Define session variables and intialize session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: memoryStore,
    cookie: {
      sameSite: 'none',
      secure: true,
      maxAge: 86400
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());


//Mount apiRouter (from routes/api) at '/api' path
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

//Homepage route
app.get("/", (req, res) => {
  res.send("Home page");
});


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
});

module.exports.handler = serverless(app);
