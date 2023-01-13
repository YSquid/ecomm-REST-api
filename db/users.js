const pool = require("./index.js");

const getUsers = (req, res, next) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json(results.rows);
    }
  });
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json(results.rows);
    }
  });
};


//POST actions

const addUser = (req, res, next) => {
  const { first_name, last_name, address, province_state, country, city } =
    req.body;
  pool.query(
    `INSERT INTO users (first_name, last_name, address, province_state, country, city) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, address, province_state, country, city;`,
    [first_name, last_name, address, province_state, country, city],
    (error, results) => {
      if (error) {
        next(error);
      } else {
        res.status(201).send(results.rows);
      }
    }
  );
};

//PUT actions

const updateUser= (req, res, next) => {
  const { id } = req.params;
  const { first_name, last_name, address, province_state, country, city } = req.body;
  pool.query(
    `UPDATE users SET first_name = $2, last_name = $3, address = $4, province_state = $5, country = $6, city = $7 
    WHERE id = $1 RETURNING id, first_name, last_name, address, province_state, country, city`,
    [id, first_name, last_name, address, province_state, country, city],
    (error, results) => {
      if (error) {
        next(error);
      } else {
        res.status(200).send(results.rows);
      }
    }
  );
};

//DELETE actions

const deleteUser = (req, res, next) => {
  const { id } = req.params;
  pool.query("DELETE FROM users WHERE id = $1", [id], (error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(`User with id: ${id} deleted`);
    }
  });
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser
};