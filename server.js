const express = require('express');
const cors = require('cors');
const app = express();

app.get("/", (req, res) => {
  res.redirect('/customers');
});

app.use(cors({origin: 'http://localhost:3001'}));

const customerRouter = require('./routes/customers');
const notesRouter = require('./routes/notes');
const schedulesRouter = require('./routes/schedules');

app.use('/customers', customerRouter);
app.use('/notes', notesRouter);
app.use('/schedules', schedulesRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});