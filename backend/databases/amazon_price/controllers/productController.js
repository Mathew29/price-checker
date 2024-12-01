const pool = require('../config/db')
const zmq = require('zeromq')


const addProduct = async (request, response) => {
    const sock = new zmq.Request()
    sock.connect("tcp://localhost:5566")

    const {product} = request.body

    try{
        await sock.send(product)

        const [msg] = await sock.receive()

        const productData = JSON.parse(msg.toString())

        const { price, discount, image: image_url, product_name: name, asin } = productData

        await pool.query('BEGIN');

        const result = await pool.query(
            `
            INSERT INTO products (name, image_url, asin, url)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (asin)
            DO UPDATE SET name = EXCLUDED.name, image_url = EXCLUDED.image_url, url = EXCLUDED.url
            RETURNING *
            `,
            [name, image_url, asin, product]
        );

        if (result.rows.length === 0) {
            console.log("No rows returned from insert.");
            return response.status(500).json({ message: "Failed to insert product" });
        }
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
            productId: result.rows[0].id
        });

    } catch(error) {
        await pool.query('ROLLBACK')
        console.error('Error in addProduct: ', error);
        response.status(500).send("An error occurred while adding the product")

    }
}

const getProductDetails = async (request, response) => {
    const { productId } = request.params;

    try {

        const productResult = await pool.query(
            `SELECT id, name, image_url, asin, url FROM products WHERE id = $1`,
            [productId]
        );


        const metricsResult = await pool.query(
            `SELECT price, discount, record_date FROM dailymetrics WHERE product_id = $1 ORDER BY record_date DESC`,
            [productId]
        );

        if (productResult.rows.length === 0) {
            return response.status(404).json({ message: "Product not found" });
        }

        const productData = {
            ...productResult.rows[0],
            metrics: metricsResult.rows,
        };

        response.json(productData);
    } catch (error) {
        console.error("Error fetching product data:", error);
        response.status(500).json({ message: "Error retrieving product data" });
    }
}

const getAllProducts = async () => {
    try {
        console.log("Retrieving all products...");

        results  = await pool.query(
            'SELECT * FROM products'
        );
        return results.rows
    } catch (error) {
        console.error("Error fetching product data:", error);
        response.status(500).json({ message: "Error retrieving product data" });
    }
}

const updateProducts = async () => {
    const sock = new zmq.Request()
    sock.connect("tcp://localhost:5566")
    try {
        console.log("Starting to update items");
        allProducts = await getAllProducts();


        for(const product of allProducts) {
            await sock.send(product['url'])

            const [msg] = await sock.receive()

            const productData = JSON.parse(msg.toString())

            const { price, discount, image: image_url, product_name: name, asin } = productData

            await pool.query('BEGIN');

            prod = {
                'id': product.id,
                'price': price,
                'discount': discount
            }
            await updateDailyMetrics(prod)
            await pool.query('COMMIT');
        }
        console.log("items updated...");

    } catch (error) {
        await pool.query('ROLLBACK')
        console.error('Error in updateProducts: ', error);
    }
}

const updateDailyMetrics = async (product) => {
    try {
        const {id, price, discount} = product
        console.log('PRODUCT ID: ',id);
        console.log('price : ',price);
        console.log('discount : ',discount);


        const existingMetric = await pool.query(
            'SELECT * FROM dailymetrics WHERE product_id = $1 AND record_date = CURRENT_DATE',
            [id]
        );
        console.log('existingMetric : ',existingMetric.rows);
        if (existingMetric.rows.length > 0) {
            console.log('Updating existing daily metric...');
            await pool.query(
                'UPDATE dailymetrics SET price = $1, discount = $2 WHERE product_id = $3 AND record_date = CURRENT_DATE',
                [price, discount, id]
            );
        } else {
            console.log('Inserting new daily metric...');
            await pool.query(
                'INSERT INTO dailymetrics (product_id, price, discount) VALUES ($1, $2, $3)',
                [id, price, discount]
            );
        }
    } catch (error) {
        console.error('Error in updateDailyMetrics:', error);
    }
}


module.exports = {
    addProduct,
    getProductDetails,
    updateProducts
}