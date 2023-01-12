const pool = require("./index.js");

//GET actions
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

//POST actions

const addOrder = (req, res, next) => {
  const { user_id } = req.body;
  pool.query(
    `INSERT INTO orders (user_id) VALUES ($1) RETURNING id, user_id;`,
    [user_id],
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

const updateOrder = (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.body;
  pool.query(
    "UPDATE orders SET user_id = $2 WHERE id = $1 RETURNING id, user_id;",
    [id, user_id],
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

const deleteOrder = (req, res, next) => {
  const {id} = req.params
  pool.query(
    "DELETE FROM orders WHERE id = $1",
    [id],
    (error) => {
      if (error) {
        next(error)
      } else {
        res.status(200).send(`Order with id: ${id} deleted`)
      }
    }
  )
}

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder
};
