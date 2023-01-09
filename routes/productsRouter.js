const express = require("express");
const productsRouter = express.Router();
const db_products = require('../db/products.js')

module.exports = productsRouter;

//GET all products
productsRouter.get("/", db_products.getProducts);

//GET product by id
productsRouter.get("/:id", db_products.getProductById);