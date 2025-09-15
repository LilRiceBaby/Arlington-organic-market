const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP default = empty
  database: 'ArlingtonOrganicMarket'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database.');
});

module.exports = db;

//this is newly added 
