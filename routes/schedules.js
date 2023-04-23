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

// get all schedules or specific customer schedules
router.get('/', (req, res) => {
  const customerId = req.query.customer_id;

  if (customerId) {
    const sql = `SELECT * FROM schedules WHERE customer_id = ${customerId}`;

    con.query(sql, (err, rows) => {
      if (err) throw err;

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

    con.query(sql, (err, rows) => {
      if (err) throw err;

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

  con.query(sql, (err, rows) => {
    if(err) throw err;

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

  const formatDate = new Date(req.body.date).tolocaleString('en-US', timeFormat);
  console.log(formatDate)

  const sql = `
  UPDATE schedules
  SET 
  date = '${formatDate}',
  time = '${req.body.time}'
  WHERE id = ${req.params.id}`;

  con.query(sql, (err, result) => {
    if (err) throw err;

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

  con.query(sql, (err, response) => {
    if(err) throw err;

    console.log('schedule posted to DB');
    res.json({ message: 'Schedule added successfully' });
  })
});

// delete a schedule
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM schedules WHERE id = ${req.params.id}`;

  con.query(sql, (err, result) => {
    if (err) throw err;

    console.log('Schedule deleted');
    res.json({ message: 'Schedule deleted successfully' });
  });
});



module.exports = router;