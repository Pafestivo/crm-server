const express = require('express');
const router = express.Router();
const pool = require('../db.js');
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

// return all customers on /customers
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM customers';

  pool.query(sql, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });

    const customers = rows.map(row => ({
        id: row.id,
        name: row.name,
        phone: `0${row.phone}`,
        email: row.email,
        status: row.status,
        lastChange: new Date(row.lastChange).toLocaleString('en-US', timeFormat)
    }))
    console.log('Data received from Db');
    res.json(customers);
  });
});

// return a single customer on /customers/:id
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM customers WHERE id = ?';
  pool.query(sql, [req.params.id], (err, rows) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('Customer received from Db');
    console.log(rows);
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
  const lastChange = new Date().toLocaleString('en-US', timeFormat)
  const sql = 'INSERT INTO customers (name, phone, email, status, lastChange) VALUES (?, ?, ?, ?, ?)';
  pool.query(sql, [name, phone, email, status, lastChange], (err, response) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('Customer posted to Db');
    res.json({ message: 'Customer added successfully' });
  })
});

// delete a customer
router.delete('/:id', (req, res) => {
  const deleteNotesSql = 'DELETE FROM notes WHERE customer_id = ?';
  const deleteSchedulesSql = 'DELETE FROM schedules WHERE customer_id = ?';
  const deleteCustomerSql = 'DELETE FROM customers WHERE id = ?';
  pool.query(deleteNotesSql, [req.params.id], (err, response) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('Customer notes deleted from Db');

    pool.query(deleteSchedulesSql, [req.params.id], (err, response) => {
      if(err) res.status(500).json({ error: err.message });

      console.log('Customer schedules deleted from Db');
    })

    pool.query(deleteCustomerSql, [req.params.id], (err, response) => {
      if(err) res.status(500).json({ error: err.message });

      console.log('Customer deleted from Db')
    })

    
    res.json({ message: 'Customer deleted successfully' });
  })
});

// update a customer
router.put('/:id', (req, res) => {

  const { name, email, phone, status } = req.body;
  const id = req.params.id;
  const lastChange = new Date().toLocaleString('en-US', timeFormat)
  const sql = `
  UPDATE customers
  SET 
  name = ?,
  email = ?,
  phone = ?,
  status = ?,
  lastChange = ?
  WHERE id = ?`;

  pool.query(sql, [name, email, phone, status, lastChange,id], (err, response) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('Customer updated on Db')
    res.json({ message: 'Customer updated successfully' });
  })
});

module.exports = router;