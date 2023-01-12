const pool = require("./index.js");

//GET actions
const getCarts = (req, res, next) => {
  pool.query("SELECT * FROM carts ORDER BY id ASC", (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json(results.rows);
    }
  });
};

const getCartById = (req, res, next) => {
  const { id } = req.params;
  pool.query(
    "SELECT * FROM carts WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
};

//POST actions

const addCart = (req, res, next) => {
  const { user_id } = req.body;
  pool.query(
    `INSERT INTO carts (user_id) VALUES ($1) RETURNING id, user_id;`,
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

const updateCart = (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.body;
  pool.query(
    "UPDATE carts SET user_id = $2 WHERE id = $1 RETURNING id, user_id;",
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

const deleteCart = (req, res, next) => {
  const {id} = req.params
  pool.query(
    "DELETE FROM carts WHERE id = $1",
    [id],
    (error) => {
      if (error) {
        next(error)
      } else {
        res.status(200).send(`Cart with id: ${id} deleted`)
      }
    }
  )
}


module.exports = {
  getCarts,
  getCartById,
  addCart,
  updateCart,
  deleteCart
};
