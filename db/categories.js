const pool = require("./index.js");

const getCategories = (req, res, next) => {
  pool.query("SELECT * FROM categories ORDER BY id ASC", (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

const getCategoryById = (req, res, next) => {
  const { id } = req.params;
  pool.query(
    "SELECT * FROM categories WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        next(error);
      } else {
        res.status(200).send(results.rows);
      }
    }
  );
};

module.exports = {
  getCategories,
  getCategoryById,
};
