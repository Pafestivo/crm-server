const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
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
pool.createConnection((err) => {
  if (err) {
    console.log('Error connecting to Db', err);
    return;
  }
  console.log('Connection established');
});

pool.on('error', (err) => {
  console.error('MySQL error:', err);
});

// get all notes or specific customer notes
router.get('/', (req, res) => {
  const customerId = req.query.customer_id;

  if (customerId) {
    const sql = `SELECT * FROM notes WHERE customer_id = ${customerId}`;

    con.query(sql, (err, rows) => {
      if (err) res.status(500).json({ error: err.message });

      console.log('Notes received from Db');
      const notes = rows.map(row => ({
          id: row.id,
          date: new Date(row.date_created).toLocaleString('en-US', timeFormat),
          description: row.description,
          customer_id: row.customer_id
        }))

      res.json(notes);
    });
  } else {
    const sql = 'SELECT * FROM notes';

    con.query(sql, (err, rows) => {
      if (err) res.status(500).json({ error: err.message });

      console.log('Notes received from Db');
      const notes = rows.map(row => ({
          id: row.id,
          date: new Date(row.date_created).toLocaleString('en-US', timeFormat),
          description: row.description,
          customer_id: row.customer_id
        }))
      res.json(notes);
    });
  }
});


// get specific note
router.get('/:id', (req, res) => {

  const sql = `SELECT * FROM notes WHERE id = ${req.params.id}`;

  con.query(sql, (err, rows) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('note received from Db');
    const row = rows[0]
    const note = {
      id: row.id,
      description: row.description,
      date: new Date(row.date_created).toLocaleString('en-US', timeFormat),
      customer_id: row.customer_id
    }
    res.json(note);
  })
});


// edit a note
router.put('/:id', (req, res) => {

  const sql = `
  UPDATE notes
  SET 
  description = '${req.body.description}',
  date_created = CONVERT_TZ(CURRENT_TIMESTAMP(), '+00:00', '+03:00')
  WHERE id = ${req.params.id}`;

  con.query(sql, (err, result) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Note edited');
    res.json({ message: 'Note edited successfully' });
  });
});


// post a new note
router.post('/', (req, res) => {

  const sql = `
  INSERT INTO notes 
  (description, customer_id) 
  VALUES (
    '${req.body.description}',
    '${req.body.customer_id}'
  )`;

  con.query(sql, (err, response) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('note posed to DB');
    res.json({ message: 'Note added successfully' });
  })
});

// delete a note
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM notes WHERE id = ${req.params.id}`;

  con.query(sql, (err, result) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Note deleted');
    res.json({ message: 'Note deleted successfully' });
  });
});


module.exports = router;