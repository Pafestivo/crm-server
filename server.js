const express = require('express');
const cors = require('cors');
const app = express();
const { job } = require('./api/sms');

job();

app.use(cors({origin: 'http://localhost:3001'}));

const customerRouter = require('./routes/customers');
const notesRouter = require('./routes/notes');
const schedulesRouter = require('./routes/schedules');

app.use('/customers', customerRouter);
app.use('/notes', notesRouter);
app.use('/schedules', schedulesRouter);


//404 page
app.use((req, res) => {
  res.status(404).send('404 page not found');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});