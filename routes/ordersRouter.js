const express = require('express')
const ordersRouter = express.Router();
const ordersJSON = require('../json_db/orders.json')

module.exports =ordersRouter;

ordersRouter.get('/', (req, res) => {
    const orders = ordersJSON
    res.send(orders)
})