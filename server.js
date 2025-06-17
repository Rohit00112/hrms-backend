const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();
const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});