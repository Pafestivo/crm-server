const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'sql216.main-hosting.eu',
  user: 'u636091749_or_r',
  password: '8#XdXWJmt',
  database: 'u636091749_devdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// connect to database
pool.getConnection((err) => {
  if (err) {
    console.log('Error connecting to Db', err);
    return;
  }
  console.log('Connection established');
});

pool.on('error', (err) => {
  console.error('MySQL error:', err);
});

module.exports = pool;