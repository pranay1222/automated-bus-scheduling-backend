require('dotenv').config()
const mysql = require('mysql2')

console.log('Connecting with:')
console.log('Host:', process.env.DB_HOST)
console.log('User:', process.env.DB_USER)
console.log('Database:', process.env.DB_NAME)

const connection = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err.message)
  } else {
    console.log('DB connected successfully!')
  }
  connection.end()
})