const e = require("express");
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

//Create a cart (for testing, usually done autmatically on user creation)

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

//Confirm stock of all products in cart before creating order
const confirmStock = (req, res, next) => {
  const { user_id } = req.params;
  
  const query = `SELECT product_id, product_count, stock
 FROM carts_products
 JOIN products
 ON carts_products.product_id = products.id
 WHERE carts_products.cart_id = ${user_id}`;

 pool.query(query, (error, results) => {
  if (error) {
    next (error)
  } else if (results.rows.every((product) => {return product.product_count <= product.stock})){
    next();
  } else {
    const outOfStock = results.rows.filter((product) => {return product.product_count > product.stock})
    const outOfStockIds = outOfStock.map((product) => {return product.product_id})
    res.send(`Out of stock of the following product id: ${outOfStockIds}`)
  }
 })
};

//Checkout a cart and create order
const checkoutCart = (req, res, next) => {
  const { user_id } = req.params;

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
      res.locals.orders_products = results.rows
      next();
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
  confirmStock,
  checkoutCart,
  deleteCart,
};
