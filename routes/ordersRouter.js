const express = require("express");
const ordersRouter = express.Router();
const db_orders = require('../db/orders.js')


module.exports = ordersRouter;

//GET all orders
ordersRouter.get("/", db_orders.getOrders);

//GET order by id
ordersRouter.get("/:id", db_orders.getOrderById);

//POST order
ordersRouter.post('/', db_orders.addOrder)

//PUT order
ordersRouter.put('/:id', db_orders.updateOrder)

//DELETE order
ordersRouter.delete('/:id', db_orders.deleteOrder)