const express = require("express");
const categoriesRouter = express.Router();
const db_categories = require('../db/categories.js')

module.exports = categoriesRouter;

//GET all products
categoriesRouter.get("/", db_categories.getCategories);

//GET product by id
categoriesRouter.get("/:id", db_categories.getCategoryById);