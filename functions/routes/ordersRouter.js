const express = require("express");
const ordersRouter = express.Router();
const db_orders = require('../db/orders.js')
const db_auth = require('../db/auth')


module.exports = ordersRouter;

//GET all orders
ordersRouter.get("/", db_auth.isSuperUser, db_orders.getOrders);

//GET order by id
ordersRouter.get("/:id", db_orders.getOrderById);

//GET orders by user id
ordersRouter.get("/user/:id", db_orders.getOrdersByUserId)

//GET order products by id
ordersRouter.get("/orderproducts/:id", db_orders.getOrderProductsById);

//POST order
ordersRouter.post('/', db_orders.addOrder);

//PUT order
ordersRouter.put('/:id', db_orders.updateOrder);

//DELETE order
ordersRouter.delete('/:id', db_auth.isSuperUser, db_orders.deleteOrder);