import schedule from 'node-schedule'
import {alertUsers} from '../services/alert.js'

export const startAlertJob = () => {
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