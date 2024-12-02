import axios from 'axios';
import zmq from 'zeromq'
import Queue from 'queue';
import pool from '../config/db.js';

const socket = new zmq.Request();
socket.connect("tcp://localhost:5567");
const alertQueue = new Queue({ concurrency: 1})

const getAllUsers = async () => {
    try {
        const results  = await pool.query(
            'SELECT * FROM users'
        );
        return results.rows
    } catch (error) {
        console.error("Error fetching user data:", error);
        response.status(500).json({ message: "Error retrieving user data" });
    }
}

const getTrackedItems = async (userId) => {
    try {

        const userTrackedItems  = await pool.query(
            'SELECT * FROM user_item_tracking WHERE user_id = $1', [userId]
        )

        if (userTrackedItems.rows.length === 0) {
            console.log('No tracked items found for this user ');
        }

        const trackedItems = [];
        for(const item of userTrackedItems.rows){
            try {
                const thresholdPrice = await pool.query(
                    'SELECT threshold_price FROM alerts WHERE user_id = $1 AND item_id = $2',
                    [userId, item.item_id]
                )

                if(thresholdPrice.rows.length > 0) {
                    trackedItems.push({
                        ...item,
                        threshold_price: parseFloat(thresholdPrice.rows[0].threshold_price)
                    })
                }
            } catch (error) {
                console.error('Error fetching threshold price:', error);
            }
        }
        return trackedItems
    } catch (err) {
        console.error('Error fetching tracked items and threshold prices: ', err);
        throw err;
    }
}
const combineUserDataWithProducts = async (userId) => {
    try{
        const trackedItems = await getTrackedItems(userId)

        const productIds = trackedItems.map(item => item.item_id);

        const combinedData = [];

        for (const productId of productIds) {
            try {
                const productDetails = await axios.get(`http://localhost:3000/api/product/product-details/${productId}`)
                combinedData.push(productDetails.data);
            } catch (error) {
                console.error('Error fetching product details: ', error);
            }
        }

        const combineItems = trackedItems.map(item => {
            const productDetail = combinedData.find(product => product.id === item.item_id);
            return {
                ...item,
                ...productDetail
            };
        });

        return combineItems
    } catch (error) {
        console.error('Failed to fetch tracking data:', error);
    }
}

export const alertUsers = async () => {
    const allUsers = await getAllUsers()

    for(const user in allUsers){
        const trackedItems  = await combineUserDataWithProducts(allUsers[user].id);
        if (trackedItems) {
            trackedItems.forEach(item => {
                if (parseFloat(item.metrics[0].price) <= item.threshold_price) {
                    const email = allUsers[user].email;
                    const name = item.name;
                    const url = item.url
                    const alertData = {email, name, url}
                    alertQueue.push(() => sendAlert(alertData))
                }
            });
        }

    }
    alertQueue.start()
}

const sendAlert = async (data) => {
    try {
        await socket.send(JSON.stringify(data))
        const buffer = await socket.receive();
        const msg = buffer.toString();
        console.log(msg);

    } catch (error) {
        console.error('Failed to send data to microservice:', error);
    }

}