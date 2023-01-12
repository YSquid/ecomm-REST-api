const pool = require("./index.js");

//GET actions

const getProducts = (req, res, next) => {
  pool.query("SELECT * FROM products ORDER BY id ASC;", (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

const getProductById = (req, res, next) => {
  const { id } = req.params;
  pool.query(
    "SELECT * FROM products WHERE id = $1;",
    [id],
    (error, results) => {
      if (error) {
        next(error);
      } else {
        res.status(200).send(results.rows);
      }
    }
  );
};

//POST actions

const addProduct = (req, res, next) => {
  const { name, description, price, stock } = req.body;
  pool.query(
    "INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING name, description, price, stock;",
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

const updateProduct = (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  pool.query(
    "UPDATE products SET name = $2, description = $3, price = $4, stock = $5 WHERE id = $1 RETURNING name, description, price, stock",
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

const deleteProduct = (req, res, next) => {
  const {id} = req.params
  pool.query(
    "DELETE FROM products WHERE id = $1",
    [id],
    (error) => {
      if (error) {
        next(error)
      } else {
        res.status(200).send(`Product with id: ${id} deleted`)
      }
    }
  )
}

//exports
module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
