// const mysql = require('mysql2');
// require('dotenv').config()

// // createPool is better than createConnection for a real app. multiple requests don't have to wait
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
// })

// // Test connection on startup
// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error('Database connection failed:', err.message)
//   } else {
//     console.log('Database connected successfully!')
//     connection.release()
//   }
// })

// // .promise() lets us use async/await instead of callbacks
// const db = pool.promise()

// module.exports = db

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;