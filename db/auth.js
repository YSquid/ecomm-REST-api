const bcrypt = require("bcrypt");
const supabase = require("./index");

const emailExists = async (email) => {
  const { data } = await supabase.from("users").select().eq("email", email);
  //can't find email in users table condition
  if (data.length == 0) return false;
  //if exists, returns object with id, email, password, superuser(bool). This is used to define user
  return data[0];
};

const createUser = async (email, password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const {data} = await supabase.from("users").insert({email: email, password: hash, superuser: 'false'}).select();
  console.log(data)

  //can't insert user into table condition
  if (data.length == 0) return false;
  //returns object with id, email, password, superuser(bool). This is used to define user
  return data[0];
};

const matchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
};

const getUserByEmail = async (email) => {
  const {data} = await supabase.from("users").select('email').eq('email', email);
  if (data.length == 0) return false;
  return data[0];
};

module.exports = {
  emailExists,
  createUser,
  matchPassword,
  checkAuthenticated,
  getUserByEmail,
};
