const express = require("express");
const cartsRouter = express.Router();
const cartsJSON = require("../json_db/carts.json");

module.exports = cartsRouter;

//GET all carts
cartsRouter.get("/", (req, res) => {
  res.status(200).send(cartsJSON);
});

//GET carts by id
cartsRouter.get("/:userid", (req, res) => {
  const { userid } = req.params;
  const filteredCarts = cartsJSON.carts.filter((cart) => {
    return cart.userid == userid;
  });
  if (filteredCarts.length > 0) {
    res.status(200).send(filteredCarts);
  } else {
    res
      .status(404)
      .send(
        "Resource not found. Ensure the url is correct and you are connected to the internet."
      );
  }
});
