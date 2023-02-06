const supabase = require("./index");

//GET actions

const getProducts = async (req, res) => {
  try {
    const { data } = await supabase.from("products").select();
    res.status(200).send(data);
  } catch (error) {
    res.send(error);
  }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("products")
      .select()
      .eq("id", id);
    //catch errors such as type errors
    if (error) {
      res.status(404);
      next(error.message);
      //case where query is allowed, but no rows returned
    } else if (data.length < 1) {
      res.status(404);
      next(`No proudct with id:${id} found`);
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    next(error);
  }
};

//Check for stock of product is > 0

const checkStock = async (req, res, next) => {
  const { product_id, product_count } = req.query;

  const { data, error } = await supabase
    .from("products")
    .select(`name, stock`)
    .eq("id", product_id);
  console.log(data);

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    if (data.length === 0) {
      res.send("No product with that id found");
    } else if (data[0].stock >= product_count) {
      res.send("enough stock, would be next in live");
    } else {
      res.status(200).send("Not enough stock");
    }
  }

  // pool.query(
  //   `SELECT stock, name FROM products WHERE id = $1`,
  //   [product_id],
  //   (error, results) => {
  //     if (error) {
  //       next(error);
  //     } else {
  //       if (results.rows.length === 0) {
  //         res.send("No product with that ID found");
  //       } else {
  //         if (results.rows[0].stock >= product_count) {
  //           next();
  //         } else {
  //           res.status(200).send("Not enough stock");
  //         }
  //       }
  //     }
  //   }
  // );
};

//POST actions

const addProduct = (req, res, next) => {
  const { name, description, price, stock } = req.body;
  pool.query(
    "INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING id, name, description, price, stock;",
    [name, description, price, stock],
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

const updateProduct = (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  pool.query(
    "UPDATE products SET name = $2, description = $3, price = $4, stock = $5 WHERE id = $1 RETURNING id, name, description, price, stock",
    [id, name, description, price, stock],
    (error, results) => {
      if (error) {
        next(error);
      } else {
        res.status(200).send(results.rows);
      }
    }
  );
};

//Update stock - run after a cart checkout middlware

const updateStock = (req, res, next) => {
  res.locals.orders_products.forEach((product) => {
    pool.query(
      `UPDATE products
      SET stock = (stock - $1) WHERE id = $2
      RETURNING id, name, description, price, stock`,
      [product.product_count, product.product_id],
      (error, results) => {
        if (error) {
          next(error);
        }
      }
    );
  });
  res.status(200).send(res.locals.orders_products);
};
//DELETE actions

const deleteProduct = (req, res, next) => {
  const { id } = req.params;
  pool.query("DELETE FROM products WHERE id = $1", [id], (error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(`Product with id: ${id} deleted`);
    }
  });
};

//exports
module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  checkStock,
  updateStock,
  deleteProduct,
};
