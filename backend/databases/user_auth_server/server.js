require('dotenv').config()
const app = require('./app');
const SIGNIN_SERVER_PORT = process.env.PORT || 5001;

app.listen(SIGNIN_SERVER_PORT, () => {
    console.log(`User Auth Server is running on port ${SIGNIN_SERVER_PORT}`);
});
