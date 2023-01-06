const express = require('express')
const cartsRouter = express.Router();

module.exports = cartsRouter;

cartsRouter.get('/', (req, res) => {
    res.send('Carts GET return')
})