const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

// get all schedules or specific customer schedules
router.get('/', (req, res) => {
  const customerId = req.query.customer_id;

  if (customerId) {
    const sql = `SELECT * FROM schedules WHERE customer_id = ${customerId}`;

    pool.query(sql, (err, rows) => {
      if (err) res.status(500).json({ error: err.message });

      console.log('Schedules received from Db');
      const schedules = rows.map(row => ({
          id: row.id,
          customerUrl: row.customerUrl,
          date: row.date,
          time: row.time,
          customerName: row.customerName,
          customer_id: row.customer_id
        }))

      res.json(schedules);
    });
  } else {
    const sql = 'SELECT * FROM schedules';

    pool.query(sql, (err, rows) => {
      if (err) res.status(500).json({ error: err.message });

      console.log('schedules received from Db');
      const schedules = rows.map(row => ({
          id: row.id,
          customerUrl: row.customerUrl,
          date: row.date,
          time: row.time,
          customerName: row.customerName,
          customer_id: row.customer_id
        }))
      res.json(schedules);
    });
  }
});

// get specific schedule
router.get('/:id', (req, res) => {

  const sql = `SELECT * FROM schedules WHERE id = ${req.params.id}`;

  pool.query(sql, (err, rows) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('schedule received from Db');
    const row = rows[0]
    const schedule = {
      id: row.id,
      customerUrl: row.customerUrl,
      date: row.date,
      time: row.time,
      customerName: row.customerName,
      customer_id: row.customer_id
    }
    res.json(schedule);
  })
});

// update a schedule
router.put('/:id', (req, res) => {

  const sql = `
  UPDATE schedules
  SET 
  date = '${req.body.date}',
  time = '${req.body.time}'
  WHERE id = ${req.params.id}`;

  pool.query(sql, (err, result) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Schedule edited');
    res.json({ message: 'Schedule edited successfully' });
  });
});

// post a new schedule
router.post('/', (req, res) => {

  const sql = `
  INSERT INTO schedules
  (customerUrl, date, time, customerName, customer_id) 
  VALUES (
    '${req.body.customerUrl}',
    '${req.body.date}',
    '${req.body.time}',
    '${req.body.customerName}',
    '${req.body.customer_id}'
  )`;

  pool.query(sql, (err, response) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('schedule posted to DB');
    res.json({ message: 'Schedule added successfully' });
  })
});

// delete a schedule
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM schedules WHERE id = ${req.params.id}`;

  pool.query(sql, (err, result) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Schedule deleted');
    res.json({ message: 'Schedule deleted successfully' });
  });
});



module.exports = router;