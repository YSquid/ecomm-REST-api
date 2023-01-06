const express = require('express')
const apiRouter = express.Router();
const productsRouter = require('./productsRouter')
const usersRouter = require('./usersRouter')
const ordersRouter = require('./ordersRouter')
const cartsRouter = require('./cartsRouter')


//Mount respective endpoint router at paths
apiRouter.use('/products/', productsRouter)
apiRouter.use('/users/', usersRouter)
apiRouter.use('/orders/', ordersRouter)
apiRouter.use('/carts/', cartsRouter)

module.exports = apiRouter;