const express = require('express');
const app = express();
const authRoutes = require('./routes/authroutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = app;