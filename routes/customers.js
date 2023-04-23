const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const timeFormat = {
  timeZone: 'Asia/Jerusalem',
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
}

const con = mysql.createConnection({
  host: 'sql216.main-hosting.eu',
  user: 'u636091749_or_r',
  password: '8#XdXWJmt',
  database: 'u636091749_devdb'
})

// connect to database
con.connect((err) => {
  if (err) {
    console.log('Error connecting to Db', err);
    return;
  }
  console.log('Connection established');
});

con.on('error', (err) => {
  console.error('MySQL error:', err);
});

// return all customers on /customers
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM customers';

  con.query(sql, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Data received from Db');
    const customers = rows.map(row => ({
        id: row.id,
        name: row.name,
        phone: `0${row.phone}`,
        email: row.email,
        status: row.status,
        lastChange: new Date(row.lastChange).toLocaleString('en-US', timeFormat)
    }))
    res.json(customers);
  });
});

// return a single customer on /customers/:id
router.get('/:id', (req, res) => {
  const sql = `SELECT * FROM customers WHERE id = ${req.params.id}`;
  con.query(sql, (err, rows) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('Customer received from Db');
    const row = rows[0]
    const customer = {
      id: row.id,
      name: row.name,
      phone: `0${row.phone}`,
      email: row.email,
      status: row.status,
      lastChange: new Date(row.lastChange).toLocaleString('en-US', timeFormat)
    }
    res.json(customer);
  })
});

// post a new customer on /customers
router.post('/', (req, res) => {

  const { name, email, phone, status } = req.body;
  const sql = `INSERT INTO customers (name, phone, email, status, lastChange) VALUES ('${name}', '${phone}', '${email}', '${status}', CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00', '+03:00'))`;
  con.query(sql, (err, response) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('Customer posted to Db');
    res.json({ message: 'Customer added successfully' });
  })
});

// delete a customer
router.delete('/:id', (req, res) => {
  const deleteNotesSql = `DELETE FROM notes WHERE customer_id = ${req.params.id}`;
  const deleteSchedulesSql = `DELETE FROM schedules WHERE customer_id = ${req.params.id}`;
  const deleteCustomerSql = `DELETE FROM customers WHERE id = ${req.params.id}`;
  con.query(deleteNotesSql, (err, response) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('Customer notes deleted from Db');

    con.query(deleteSchedulesSql, (err, response) => {
      if(err) res.status(500).json({ error: err.message });

      console.log('Customer schedules deleted from Db');
    })

    con.query(deleteCustomerSql, (err, response) => {
      if(err) res.status(500).json({ error: err.message });

      console.log('Customer deleted from Db')
    })

    
    res.json({ message: 'Customer deleted successfully' });
  })
});

// update a customer
router.put('/:id', (req, res) => {

  const sql = `
  UPDATE customers
  SET 
  name = '${req.body.name}',
  email = '${req.body.email}',
  phone = '${req.body.phone}',
  status = '${req.body.status}',
  lastChange = CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00', '+03:00')
  WHERE id = ${req.params.id}`;

  con.query(sql, (err, response) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('Customer updated on Db')
    res.json({ message: 'Customer updated successfully' });
  })
});

module.exports = router;