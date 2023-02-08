const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.EXPRESS_PORT || 3000;
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
require("./passportConfig")(passport);
const db_auth = require('./db/auth')

module.exports = app;

//Middleware stack
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//Define session variables and intialize session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//serialize and deserialize user
passport.serializeUser((user, done) => {
  return done(null, user.email);
});
passport.deserializeUser((email, done) => {
  return done(null, db_auth.getUserByEmail(email));
});

//Show logs
let showlogs = (req, res, next) => {
  console.log(`=== Session ===`)
  console.log(req.session)
  console.log(`=== Passport ===`)
  console.log(req.session.passport)
  next();
}

app.use(showlogs);

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

app.post(
  "/login",
  passport.authenticate("local-login", { session: true }),
  (req, res) => {
    res.redirect("/api");
  }
);

//Logout route
app.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {return next(error)}
  })
  res.redirect("/login")
} )

//Register route
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post(
  "/register",
  passport.authenticate("local-signup", { session: true }),
  (req, res, next) => {
    res.redirect("/login/?email=");
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
