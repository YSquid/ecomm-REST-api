const express = require('express')
const cartsRouter = express.Router();
const cartsJSON = require('../json_db/carts.json')

module.exports = cartsRouter;

cartsRouter.get('/', (req, res) => {
    const carts = cartsJSON
    res.send(carts)
})