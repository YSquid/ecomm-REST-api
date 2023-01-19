const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.EXPRESS_PORT || 3000;
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const pool = require("./db/index");
require("./passportConfig")(passport);


module.exports = app;

//Middleware stack
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "FcEN9gUDmbwGKwBhlviX",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  console.log(user)
  return done(null, user.id)});
passport.deserializeUser((id, done) => {
  console.log(id)
  return done(null, getUserById(id));
});

//Mount apiRouter (from routes/api) at '/api' path
const apiRouter = require("./routes/api");
app.use("/api", checkAuthenticated, apiRouter);

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

//Register route
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post(
  "/register",
  passport.authenticate("local-signup", { session: true }),
  (req, res, next) => {
    res.redirect("/api");
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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("Is authenticated");
    return next();
  }

  res.redirect("/login");
}

async function getUserById(id) {
  const data =  pool.query(
    "SELECT id, email FROM users WHERE id = $1",
    [id]
  )
  if (data.rowCount == 0) return false;
  return data.rows;
}

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
  // console.log(process.env) -- confirming process.env object
});
