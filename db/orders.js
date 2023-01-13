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

//Create order from carts/checkout/:id route

//Looks up and passes the user_id associated with the cart
const cartInfo = (req, res, next) => {
  res.locals.cart_id = req.params.id;
  pool.query(
    `SELECT user_id FROM carts WHERE id = $1`,
    [res.locals.cart_id],
    (error, results) => {
      if (error) {
        next(error);
      } else if (results.rows[0]){
        res.locals.user_id = results.rows[0].user_id
        next();
      } else {
        res.send("No Cart Found.")
      }
    }
  );
};

//Gets all products associated with the cart and passes as an array
const cartsProducts = (req, res, next) => {
  pool.query(
    `SELECT product_id FROM carts_products WHERE cart_id = $1`,
    [res.locals.user_id],
    (error, results) => {
      if (error) {
        next (error)
      } else {
        res.locals.product_ids = results.rows.map((product) => {
          return product.product_id
        })
        next();
      }
    }
  )
};

//Creates an order with the associated user_id
const createOrder = (req, res, next) => {
  pool.query(
    `INSERT INTO orders (user_id)
    VALUES ($1) RETURNING id, user_id`,
    [res.locals.user_id],
    (error, results) => {
      if (error) {
        next (error)
      } else {
        res.locals.order_id = results.rows[0].id
        next();
      }
    }
  )
}

//Creates rows in orders products with the order_id and product_ids
const ordersProducts = (req, res, next) => {
  for (let i = 0; i < res.locals.product_ids.length; i++) {
    pool.query(
      `INSERT INTO orders_products (order_id, product_id)
      VALUES ($1, $2) RETURNING order_id, product_id`,
      [res.locals.order_id, res.locals.product_ids[i]],
      (error, results) => {
        if (error) {
          next (error)
        } else {
          res.send(results.rows)
        }
      }
    )
  }
}

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
  const { id } = req.params;
  pool.query("DELETE FROM orders WHERE id = $1", [id], (error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(`Order with id: ${id} deleted`);
    }
  });
};

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  cartInfo,
  cartsProducts,
  createOrder,
  ordersProducts,
  updateOrder,
  deleteOrder,
};
