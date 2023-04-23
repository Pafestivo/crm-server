const express = require('express');
const cors = require('cors');
const app = express();
const { job } = require('./api/sms');

job();

app.use(cors({
  origin: ['https://crm-app-p51g.onrender.com/', 'http://localhost/3000', 'http://localhost:3001']
}));

const customerRouter = require('./routes/customers');
const notesRouter = require('./routes/notes');
const schedulesRouter = require('./routes/schedules');

app.use('/customers', customerRouter);
app.use('/notes', notesRouter);
app.use('/schedules', schedulesRouter);

// Error catcher middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//404 page
app.use((req, res) => {
  res.status(404).send('404 page not found');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});