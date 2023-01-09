const express = require("express");
const cartsRouter = express.Router();
const db_carts = require('../db/carts.js')

module.exports = cartsRouter;

//GET all carts
cartsRouter.get("/", db_carts.getCarts);

//GET carts by id
cartsRouter.get("/:userid", db_carts.getCartByUserId);
