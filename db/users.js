const pool = require('./index.js')

const getUsers = (req, res) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
      if (error) {
        throw error;
      }
  
      res.status(200).json(results.rows);
    });
  };

const getUserById = (req, res) => {
    const {id} = req.params
    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
        if (error) {
            throw error
        }
    
        res.status(200).json(results.rows)
    })
}

module.exports = {
    getUsers,
    getUserById
}