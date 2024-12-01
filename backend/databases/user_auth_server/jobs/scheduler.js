const schedule = require('node-schedule');
const { alertUsers } = require('../services/alert')

const startAlertJob = () => {
    const alert = schedule.scheduleJob('* * * * *', async () => {
        try {
            console.log('Running alert emails...');
            await alertUsers();
            console.log('Alert emails sent successfuly');

        } catch (error) {
            console.error('Error sending alerts:', error);
        }
    })
    return alert
}

module.exports = {
    startAlertJob
}