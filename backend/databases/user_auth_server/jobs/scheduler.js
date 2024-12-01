const schedule = require('node-schedule');
const {alertUsers} = require('../services/alert')

const alert = schedule.scheduleJob('*/1 * * * *', async () => {
    try {
        console.log('Running alert emails...');
        await alertUsers();
        console.log('Alert emails sent successfuly');

    } catch (error) {
        console.error('Error sending alerts:', error);
    }
})

module.exports = {
    alert
}