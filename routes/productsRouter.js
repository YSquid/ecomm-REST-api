const express = require("express");
const productsRouter = express.Router();
const db_products = require('../db/products.js')

module.exports = productsRouter;

//GET all products
productsRouter.get("/", db_products.getProducts);

//GET product by id
productsRouter.get("/:id", db_products.getProductById);

//POST product
productsRouter.post('/', db_products.addProduct)

//PUT product
productsRouter.put('/:id', db_products.updateProduct)

//testing update stock
// productsRouter.put('/updateStock', db_products.updateStock)

//DELETE product

productsRouter.delete('/:id', db_products.deleteProduct)
