const cron = require("node-cron");

const jsonServer = require("json-server")
const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 3000

server.use(middlewares)
server.use(router)

server.listen(port)

const scheduleUrl = 'https://crm-server-2ja0.onrender.com/schedules';
const timeFormat = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
}

const getSchedules = async () => {
  const response = await fetch(scheduleUrl, {
    method: 'GET'
  });
  const schedules = await response.json();
  return schedules;
}

const deleteSchedule = async (id) => {
  const response = await fetch(`${scheduleUrl}/${id}`, {
    method: 'DELETE'
  });
  const schedule = await response.json();
  return schedule;
}

cron.schedule('* * * * *', async () => {

  const schedules = await getSchedules();

  const now = new Date().toLocaleString(undefined, timeFormat);
  const [currentDate, currentTime] = now.split(', ');

  schedules.forEach(schedule => {
    if(currentDate === schedule.date && currentTime === schedule.time) {
      console.log(`This is a reminder that ${schedule.customer} has requested a call today at ${schedule.time}. His phone number is ${schedule.customerPhone}`)
    }
    deleteSchedule(schedule.id);
  });
});