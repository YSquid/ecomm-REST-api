const express = require("express");
const cartsRouter = express.Router();
const db_carts = require("../db/carts.js");

module.exports = cartsRouter;

//GET all carts
cartsRouter.get("/", db_carts.getCarts);

//GET carts by id
cartsRouter.get("/:id", db_carts.getCartById);

//POST cart
cartsRouter.post("/", db_carts.addProductToCart);

//PUT cart
cartsRouter.put("/:id", db_carts.updateCart);

//DELETE cart
cartsRouter.delete("/:id", db_carts.deleteCart);
