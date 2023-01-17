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
  pool.query("SELECT * FROM carts WHERE id = $1", [id], (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json(results.rows);
    }
  });
};

//POST actions

//Add item to a cart using query params

const addProductToCart = (req, res, next) => {
  const { cart_id, product_id, product_count } = req.query;

  pool.query(
    `SELECT * FROM carts_products WHERE cart_id = $1 AND product_id = $2`,
    [cart_id, product_id],
    (error, results) => {
      if (error) {
        next(error);
      } else {
        if (results.rows[0]) {
          pool.query(
            `UPDATE carts_products
            SET product_count = product_count + $3, add_time = current_timestamp
            WHERE cart_id = $1 AND product_id = $2
            RETURNING cart_id, product_id, product_count;`,
            [cart_id, product_id, product_count],
            (error, results) => {
              if (error) {
                next(error);
              } else {
                res.status(201).send(results.rows);
              }
            }
          );
        } else {
          pool.query(
            `INSERT INTO carts_products (cart_id, product_id, product_count, add_time)
          VALUES ($1, $2, $3, current_timestamp)
          RETURNING cart_id, product_id, product_count;`,
            [cart_id, product_id, product_count],
            (error, results) => {
              if (error) {
                next(error);
              } else {
                res.status(201).send(results.rows);
              }
            }
          );
        }
      }
    }
  );
};

//Checkout a cart and create order
const checkoutCart = (req, res, next) => {
  const { cart_id, user_id } = req.query;

  const query = `
  WITH user_carts_products AS (
    DELETE FROM carts_products
      USING carts
    WHERE carts.id = carts_products.cart_id AND carts.user_id = ${user_id}
    RETURNING product_id, product_count
  ),
  current_order AS (
    INSERT INTO orders (user_id, add_time)
    VALUES (${user_id}, current_timestamp)
    RETURNING id AS order_id
  ),
  current_order_products AS (
    SELECT * FROM current_order
    CROSS JOIN user_carts_products
  )
  
  INSERT INTO orders_products (order_id, product_id, product_count, add_time) 
  SELECT order_id, product_id, product_count, current_timestamp FROM current_order_products
  RETURNING *`;

  pool.query(query, (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(results.rows);
    }
  });
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

const addOneToCart = (req, res, next) => {
  const { cart_id, product_id } = req.query;
  pool.query(
    `UPDATE carts_products SET product_count = (product_count + 1) WHERE cart_id = $1 AND product_id = $2
    RETURNING cart_id, product_id, product_count`,
    [cart_id, product_id],
    (error, results) => {
      if (error) {
        next(error);
      } else {
        res.send(results.rows);
      }
    }
  );
};

const subtractOneFromCart = (req, res, next) => {
  const { cart_id, product_id } = req.query;
  pool.query(
    `UPDATE carts_products SET product_count = (product_count - 1) WHERE cart_id = $1 AND product_id = $2
    RETURNING cart_id, product_id, product_count`,
    [cart_id, product_id],
    (error, results) => {
      if (error) {
        next(error);
      } else {
        res.send(results.rows);
      }
    }
  );
};

//DELETE actions

const deleteCart = (req, res, next) => {
  const { id } = req.params;
  pool.query("DELETE FROM carts WHERE id = $1", [id], (error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(`Cart with id: ${id} deleted`);
    }
  });
};

module.exports = {
  getCarts,
  getCartById,
  addProductToCart,
  updateCart,
  addOneToCart,
  subtractOneFromCart,
  checkoutCart,
  deleteCart,
};
