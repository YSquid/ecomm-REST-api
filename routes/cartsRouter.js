const express = require("express");
const cartsRouter = express.Router();
const db_carts = require("../db/carts.js");
const db_products = require("../db/products.js");
const db_auth = require("../db/auth");

module.exports = cartsRouter;

//GET all carts
cartsRouter.get("/", db_auth.isSuperUser, db_carts.getCarts);

//GET carts by id
cartsRouter.get("/:id", db_carts.getCartById);

//POST cart
cartsRouter.post("/", db_products.checkStock, db_carts.addProductToCart);

cartsRouter.post(
  "/checkout/:user_id",
  db_carts.confirmStock,
  db_carts.checkoutCart,
  db_products.updateStock
);

//PUT cart
// cartsRouter.put("/updatecart/:id", db_carts.updateCart);
cartsRouter.put("/plusone/", db_carts.addOneToCart);
cartsRouter.put("/minusone/", db_carts.subtractOneFromCart);




// DEPRECATED
// cartsRouter.put("/updatecart/:id", db_carts.updateCart);
// cartsRouter.delete("/:id", db_carts.deleteCart);
