const express = require("express");
const ordersRouter = express.Router();
const ordersJSON = require("../json_db/orders.json");

module.exports = ordersRouter;

//GET all orders
ordersRouter.get("/", (req, res) => {
  const orders = ordersJSON;
  res.send(orders);
});

//GET order by id
ordersRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  const filteredOrders = ordersJSON.orders.filter((order) => {
    return order.id == id;
  });

  if (filteredOrders.length > 0) {
    res.status(200).send(filteredOrders);
  } else {
    res
      .status(404)
      .send(
        "Resource not found. Ensure the url is correct and you are connected to the internet."
      );
  }
});
