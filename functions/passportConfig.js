const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const { emailExists, createUser, matchPassword, getUserById } = require("./db/auth.js");

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const userExists = await emailExists(email);

        if (userExists) {
          return done(null, false);
        }

        const user = await createUser(email, password);
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await emailExists(email);
        if (!user) return done(null, false);
        const isMatch = await matchPassword(password, user.password);
        if (!isMatch) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  "logout",
  new LocalStrategy(
    { usernameField: "email" },
    async (username, password, done) => {
      return done(null, false);
    }
  )
);


//serialize and deserialize user
passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id)
  return done(null, user);
});