const pool = require("./index.js");

//GET actions
const getCategories = (req, res, next) => {
  pool.query("SELECT * FROM categories ORDER BY id ASC;", (error, results) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(results.rows);
    }
  });
};

const getCategoryById = (req, res, next) => {
  const { id } = req.params;
  pool.query(
    "SELECT * FROM categories WHERE id = $1;",
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

const addCategory = (req, res, next) => {
  const { name, description } = req.body;
  pool.query(
    `INSERT INTO categories (name, description) 
    VALUES ($1, $2) RETURNING id, name, description;`,
    [name, description],
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

const updateCategory = (req, res, next) => {
  const { id } = req.params;
  const { name, description} = req.body;
  pool.query(
    "UPDATE categories SET name = $2, description = $3 WHERE id = $1 RETURNING id, name, description",
    [id, name, description],
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

const deleteCategory = (req, res, next) => {
  const { id } = req.params;
  pool.query("DELETE FROM categories WHERE id = $1", [id], (error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(`Category with id: ${id} deleted`);
    }
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory
};
