const express = require('express')
const cartsRouter = express.Router();
const cartsJSON = require('../json_db/carts.json')

module.exports = cartsRouter;

cartsRouter.get('/', (req, res) => {
    res.send(cartsJSON)
})

cartsRouter.get('/:userid', (req, res) => {
   const {userid} = req.params
   const filteredCarts = cartsJSON.carts.filter((cart) => {
    return cart.userID == userid
   })
   res.send(filteredCarts)
})

