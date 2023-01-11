const pool = require("./index.js");

const getProducts = (req, res, next) => {
  pool.query("SELECT * FROM products ORDER BY id ASC", (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

const getProductById = (req, res, next) => {
  const { id } = req.params;
  pool.query("SELECT * FROM products WHERE id = $1", [id], (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

module.exports = {
  getProducts,
  getProductById,
};
