const schedule = require('node-schedule')
const { updateProducts } = require('../controllers/productController')

const scheduleProductUpdate = () => {
    schedule.scheduleJob('0 0 * * *', async () => {
        console.log('Time to update all products');
        try {
            await updateProducts();
        } catch (error) {
            console.error('Scheduled Job Failed: ', error.message);

        }
    })
}

module.exports = {
    scheduleProductUpdate
}