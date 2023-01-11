const pool = require("./index.js");

const getUsers = (req, res, next) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      next(error);
    }

    res.status(200).json(results.rows);
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

module.exports = {
  getUsers,
  getUserById,
};
