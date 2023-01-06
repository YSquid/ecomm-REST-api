const express = require('express')
const productsRouter = express.Router();
const productsJSON = require('../json_db/products.json')

module.exports = productsRouter;

productsRouter.get("/", (req, res) => {
    const products = productsJSON
    res.send(products)
})