const express = require("express");
const productsRouter = express.Router();
const db_products = require("../db/products.js");
const db_auth = require("../db/auth");

module.exports = productsRouter;

//GET all products
productsRouter.get("/", db_products.getProducts);

//GET categories - passed array, must come before the by id route
productsRouter.get('/categories', db_products.getProductsByCategories)

//GET product by id
productsRouter.get("/:id", db_products.getProductById);


//POST product
productsRouter.post("/", db_auth.checkAuthenticated, db_auth.isSuperUser, db_products.addProduct);

//PUT product
productsRouter.put("/:id", db_auth.checkAuthenticated , db_auth.isSuperUser, db_products.updateProduct);

//DELETE product

productsRouter.delete("/:id", db_auth.checkAuthenticated, db_auth.isSuperUser, db_products.deleteProduct);
