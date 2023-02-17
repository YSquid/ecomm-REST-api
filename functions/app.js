const express = require("express");
const app = express();
require("dotenv").config();
const serverless = require('serverless-http')
const PORT = process.env.EXPRESS_PORT || 3000;
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
require("./passportConfig")(passport);
const db_auth = require("./db/auth");
let ejs = require('ejs');
// const cors = require("cors");


//Middleware stack
//allows cross and setting of session for passport https://stackoverflow.com/questions/19043511/passport-js-fails-to-maintain-session-in-cross-domain
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
       res.sendStatus(200);
   } else {
       next();
   }
  });


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//Define session variables and intialize session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    // sameSite: "none",
    // cookie: { maxAge: 86400 },
    // secure: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//serialize and deserialize user
passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser((id, done) => {
  return done(null, db_auth.getUserById(id));
});


// Show login details
// let showlogs = (req, res, next) => {
//   console.log(`=== Session ===`);
//   console.log(req.session);
//   console.log(`=== Passport ===`);
//   console.log(req.session.passport);
//   next();
// };
// app.use(showlogs);

//Mount apiRouter (from routes/api) at '/api' path
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

//Homepage route
app.get("/", (req, res) => {
  res.send("Home page");
});

//Login routes
//login page general
app.get("/login", db_auth.isLoggedIn, (req, res) => {
  res.render("login.ejs");
});

//local login post
app.post(
  "/login",
  passport.authenticate("local-login", {
    session: true,
  }),
  (req, res) => {
    res.json({ token: req.user.id });
  }
);

//Logout route
app.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
  });
  res.status(200).send("Logged Out");
});

//Register route
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post(
  "/register",
  passport.authenticate("local-signup", { session: true }),
  (req, res, next) => {
    res.status(201).json({ user: req.session.passport.user });
  }
);

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