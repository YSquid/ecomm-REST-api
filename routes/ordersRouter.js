const express = require('express')
const ordersRouter = express.Router();

module.exports =ordersRouter;

ordersRouter.get('/', (req, res) => {
    res.send("Orders GET return")
})