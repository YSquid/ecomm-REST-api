const pool = require("./index.js");

const getOrders = (req, res, next) => {
  pool.query("SELECT * FROM orders ORDER BY id ASC", (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json(results.rows);
    }
  });
};

const getOrderById = (req, res, next) => {
  const { id } = req.params;
  pool.query("SELECT * FROM orders WHERE id = $1", [id], (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

module.exports = {
  getOrders,
  getOrderById,
};
