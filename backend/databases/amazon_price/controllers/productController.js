const pool = require('../config/db')
const zmq = require('zeromq')


addProduct = async (request, response) => {
    const sock = new zmq.Request()
    sock.connect("tcp://localhost:5566")

    const {product} = request.body

    try{
        await sock.send(product)

        const [msg] = await sock.receive()
        console.log("Received message:", msg.toString())

        const productData = JSON.parse(msg.toString())

        const { price, discount, image: image_url, product_name: name, asin } = productData

        await pool.query('BEGIN');

        const result = await pool.query(
            `
            INSERT INTO products (name, image_url, asin)
            VALUES ($1, $2, $3)
            ON CONFLICT (asin)
            DO UPDATE SET name = EXCLUDED.name, image_url = EXCLUDED.image_url
            RETURNING *
            `,
            [name, image_url, asin]
        );

        const productId = result.rows[0].id;

        const existingMetric = await pool.query(
            'SELECT * FROM dailymetrics WHERE product_id = $1 AND record_date = CURRENT_DATE',
            [productId]
        );

        if (existingMetric.rows.length > 0) {

            await pool.query(
                'UPDATE dailymetrics SET price = $1, discount = $2 WHERE product_id = $3 AND record_date = CURRENT_DATE',
                [price, discount, productId]
            );
        } else {

            await pool.query(
                'INSERT INTO dailymetrics (product_id, price, discount) VALUES ($1, $2, $3)',
                [productId, price, discount]
            );
        }


        await pool.query('COMMIT');

        response.status(201).json({
            message: `Product added successfully.`,
            productId: productId
        });

    } catch(error) {
        await pool.query('ROLLBACK')
        console.error('Error in createProduct: ', error);
        response.status(500).send("An error occurred while adding the product")

    }
}


module.exports = {
    addProduct
}