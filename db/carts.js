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

//NOT NEEDED - CARTS AUTO ADDED WITH TRIGGER ON USER ADD
// const addCart = (req, res, next) => {
//   const { user_id } = req.body;
//   pool.query(
//     `INSERT INTO carts (user_id) VALUES ($1) RETURNING id, user_id;`,
//     [user_id],
//     (error, results) => {
//       if (error) {
//         next(error);
//       } else {
//         res.status(201).send(results.rows);
//       }
//     }
//   );
// };

//Add item to a cart using query params

const addProductToCart = (req, res, next) => {
  const {cart_id, product_id} = req.query
  pool.query(
    `INSERT INTO carts_products (cart_id, product_id) VALUES ($1, $2) 
    RETURNING cart_id, product_id;`,
    [cart_id, product_id],
    (error, results) => {
      if (error) {
        next(error)
      } else {
        res.status(201).send(results.rows)
      }
    }
  )
}

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
  addProductToCart,
  updateCart,
  deleteCart
};
