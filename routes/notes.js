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

// get all notes or specific customer notes
router.get('/', (req, res) => {
  const customerId = req.query.customer_id;

  if (customerId) {
    const sql = `SELECT * FROM notes WHERE customer_id = ?`;

    pool.query(sql, [customerId], (err, rows) => {
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

    pool.query(sql, (err, rows) => {
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

  const sql = `SELECT * FROM notes WHERE id = ?`;

  pool.query(sql, [req.params.id], (err, rows) => {
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

  const dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ')

  const sql = `
  UPDATE notes
  SET 
  description = ?,
  date_created = ?
  WHERE id = ?`;

  pool.query(sql, [req.body.description, dateCreated, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Note edited');
    res.json({ message: 'Note edited successfully' });
  });

  // update customer last change date
  const customerSql = `
  UPDATE customers
  SET
  lastChange = ?
  WHERE id = ?`;

  pool.query(customerSql, [dateCreated, req.body.customer_id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Customer last change date updated');
  });
});


// post a new note
router.post('/', (req, res) => {

  const sql = `
  INSERT INTO notes 
  (description, customer_id) 
  VALUES (
    ?,
    ?
  )`;

  pool.query(sql, [req.body.description, req.body.customer_id], (err, response) => {
    if(err) res.status(500).json({ error: err.message });

    console.log('note posed to DB');
    res.json({ message: 'Note added successfully' });
  })

  // update customer last change date
  const lastChange = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const customerSql = `
  UPDATE customers
  SET
  lastChange = ?
  WHERE id = ?`;

  pool.query(customerSql, [lastChange, req.body.customer_id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Customer last change date updated');
  });
});

// delete a note
router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM notes WHERE id = ?`;

  pool.query(sql, [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Note deleted');
    res.json({ message: 'Note deleted successfully' });
  });

  // update customer last change date
  const lastChange = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const customerSql = `
  UPDATE customers
  SET
  lastChange = ?
  WHERE id = ?`;

  pool.query(customerSql, [lastChange, req.body.customer_id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });

    console.log('Customer last change date updated');
  });
});


module.exports = router;