const pool = require('./index.js')

const getCarts = (req, res) => {
    pool.query("SELECT * FROM carts ORDER BY id ASC", (error, results) => {
        if (error) {
            throw error
        }

        res.status(200).json(results.rows)
    })
}

const getCartByUserId = (req, res) => {
    const {userid} = req.params
    pool.query("SELECT * FROM carts WHERE user_id = $1", [userid], (error, results) =>{ 
        if (error) {
            throw error
        }
        
        res.status(200).json(results.rows)
    })
}

module.exports = {
    getCarts,
    getCartByUserId
}