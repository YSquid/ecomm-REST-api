const bcrypt = require('bcrypt')

const pool = require("./index.js");

const emailExists = async(email) => {
    const data = await pool.query(
        "SELECT * FROM users WHERE email =$1", [email]
    );

    //can't find email in users table condition
    if (data.rowCount == 0 ) return false;
    return data.rows[0];
}


const createUser = async (email, password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const data = await pool.query(
        "INSERT INTO users (email, password, type) VALUES ($1, $2, 'regular') RETURNING id, type, email, password",
        [email, hash]
    );
    //can't insert user into table condition
    if (data.rowCount == 0) return false;
    return data.rows[0];
}

const matchPassword = async (password, hashPassword) => {
    const match = await bcrypt.compare(password, hashPassword);
    return match
};

const checkAuthenticated = (req, res, next)  => {
    if (req.isAuthenticated()) {
      console.log("Is authenticated");
      return next();
    }
  
    res.redirect("/login");
  }

 const getUserById = async (id) => {
    const data = pool.query("SELECT id, email FROM users WHERE id = $1", [id]);
    if (data.rowCount == 0) return false;
    return data.rows;
  }

module.exports = {
    emailExists,
    createUser,
    matchPassword,
    checkAuthenticated,
    getUserById
}