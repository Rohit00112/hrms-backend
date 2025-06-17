const express = require('express');
const app = express();
const authRoutes = require('./routes/authroutes');

app.use(express.json());


app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = app;