const express = require('express');
const cors = require('cors');
const app = express();
const { job } = require('./api/sms');

job();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cors({
  origin: ['https://crm-app-p51g.onrender.com/', 'http://localhost:3000', 'http://localhost:3001']
}));


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

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on port ${process.env.PORT || 3001}`);
});