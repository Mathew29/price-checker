const app = require('./app')
const PORT = process.env.SERVER_PORT || 5011

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
