const pool = require('./index.js')

const getProducts = (req, res) => {
    pool.query("SELECT * FROM products ORDER BY id ASC", (error, results) => {
        if (error) {
            throw error
        }

        res.status(200).send(results.rows)
    })
}

const getProductById = (req, res) => {
    const {id} = req.params
    pool.query("SELECT * FROM products WHERE id = $1", [id], (error, results) => {
        if (error) {
            throw error
        }

        res.status(200).send(results.rows)
    })
}

module.exports = {
    getProducts,
    getProductById
}