const schedule = require('node-schedule');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();
const scheduleUrl = 'https://crm-server-2ja0.onrender.com/schedules/';
const timeFormat = {
  timeZone: 'Asia/Jerusalem',
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
}


const getSchedules = async () => {
  try {
    const response = await axios.get(scheduleUrl)
    return response.data;
  } catch (error) {
    console.error('Error getting schedules', error);
    throw error;
  }
}

const deleteSchedule = async (id) => {
  try {
    const response = await axios.delete(`${scheduleUrl}/${id}`)
    return response.data
  } catch(error) {
    console.error('Error deleting schedule', error);
    throw error;
  }
}

const job = schedule.scheduleJob('* * * * *', async () => {
  console.log('cron-job ran!')
  
  const schedules = await getSchedules();

  const now = new Date().toLocaleString('en-US', timeFormat);
  const [currentDate, currentTime] = now.split(', ');

  schedules.forEach(schedule => {
    
    if(currentDate === schedule.date && currentTime === schedule.time) {

      let data = qs.stringify({
        'post': '2',
        'token': process.env.smsApi,
        'msg': `This is a reminder that ${schedule.customerName} has requested a call today at ${schedule.time}. View customer here: ${schedule.customerUrl}`,
        'list': '0523453336',
        'from': 'wecome'
      });


      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://www.micropay.co.il/ExtApi/ScheduleSms.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

      deleteSchedule(schedule.id);
    }
  });
});

module.exports = job;