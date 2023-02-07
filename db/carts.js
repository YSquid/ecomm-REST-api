// const e = require("express");
const supabase = require("./index");

//GET actions
const getCarts = async (req, res, next) => {
  const { data, error } = await supabase.from("carts").select();

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

const getCartById = async (req, res, next) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("carts").select().eq("id", id);

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

//POST actions

//Add item to a cart using query params

const addProductToCart = async (req, res, next) => {
  const { cart_id, product_id, product_count } = req.query;

  //select rows where the cart id and product id matches selection
  const { data, error } = await supabase
    .from("carts_products")
    .select()
    .eq("cart_id", cart_id)
    .eq("product_id", product_id);

  //calculate new total amount of product if its in cart, if not newTotal is just product_count;
  let newTotal;
  if (data.length > 0) {
    newTotal = Number(product_count) + Number(data[0].product_count);
  } else {
    newTotal = Number(product_count);
  }

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    //if data has length, i.e. that product is in cart, update with count
    if (data.length > 0) {
      const { data, error } = await supabase
        .from("carts_products")
        .update({ product_count: newTotal })
        .eq("cart_id", cart_id)
        .eq("product_id", product_id)
        .select();
      if (error) {
        res.status(404);
        next(error.message);
      } else {
        res.status(200).send(data);
      }
    } else {
      //if data has no length i.e. that product is not in cart, add it with count
      const { data, error } = await supabase
        .from("carts_products")
        .insert({
          cart_id: cart_id,
          product_id: product_id,
          product_count: product_count,
        })
        .select();
      if (error) {
        res.status(404);
        next(error.message);
      } else {
        res.status(200).send(data);
      }
    }
  }
};

//Confirm stock of all products in cart before creating order
const confirmStock = async (req, res, next) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("carts_products")
    .select(
      `product_id, product_count, products(
      stock
    )`
    )
    .eq("cart_id", user_id);
  if (error) {
    res.status(404);
    next(error.message);
    //check every product has enough stock
  } else if (
    data.every((product) => {
      return product.product_count <= product.products.stock;
    })
  ) {
    // res.send("send to next in live");
    next();
  } else {
    const outOfStock = data.filter((product) => {
      return product.product_count > product.products.stock;
    });

    const outOfStockIds = outOfStock.map((product) => {
      return product.product_id;
    });

    res.send(`Out of stock on product with id: ${outOfStockIds}`);
  }
};

//Checkout a cart and create order
const checkoutCart = async (req, res, next) => {
  const { user_id } = req.params;

  //fetch the info carts_products needed to make orders and orders_products entries
  const { data, error } = await supabase
    .from("carts_products")
    .select("cart_id, product_id, product_count")
    .eq("cart_id", user_id);
  // console.log(data);
  const productCount = data.length;

  //create the order in orders, return the data
  const orderData = await supabase
    .from("orders")
    .insert({ user_id: user_id })
    .select();
  //extract the orderId
  const orderId = orderData.data[0].id;
  
  //loop through and create entry in orders_products for each product data from carts_products
  for (let i = 0; i < productCount; i++) {
    let product_id = data[i].product_id;
    let product_count = data[i].product_count;

    const innerData = await supabase
      .from("orders_products")
      .insert({
        order_id: orderId,
        product_id: product_id,
        product_count: product_count,
      })
      .select();
      // console.log(innerData)
  }

  //delete from carts_products
  await supabase.from("carts_products").delete().eq('cart_id', user_id);



  let finalData = await supabase.from("orders_products").select().eq('order_id', orderId)
  res.locals.orders_products = finalData.data;
  next();

  // const query = `
  // WITH user_carts_products AS (
  //   DELETE FROM carts_products
  //     USING carts
  //   WHERE carts.id = carts_products.cart_id AND carts.user_id = ${user_id}
  //   RETURNING product_id, product_count
  // ),
  // current_order AS (
  //   INSERT INTO orders (user_id, add_time)
  //   VALUES (${user_id}, current_timestamp)
  //   RETURNING id AS order_id
  // ),
  // current_order_products AS (
  //   SELECT * FROM current_order
  //   CROSS JOIN user_carts_products
  // )

  // INSERT INTO orders_products (order_id, product_id, product_count, add_time)
  // SELECT order_id, product_id, product_count, current_timestamp FROM current_order_products
  // RETURNING *`;

  // pool.query(query, (error, results) => {
  //   if (error) {
  //     next(error);
  //   } else {
  //     res.locals.orders_products = results.rows;
  //     next();
  //   }
  // });
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
