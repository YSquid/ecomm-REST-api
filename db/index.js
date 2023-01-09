const  {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ahmads_source_for_sports',
    password: 'postgres',
    port: 5432
})

const getUsers = (req, res) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
      if (error) {
        throw error;
      }
  
      res.status(200).json(results.rows);
    });
  };

module.exports = {
    getUsers
}