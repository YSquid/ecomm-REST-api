const express = require('express')
const productsRouter = express.Router();

module.exports = productsRouter;

productsRouter.get("/", (req, res) => {
    res.send("Products GET return")
})