const express = require('express');
const app = express();
const authRoutes = require('./routes/authroutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRequestRoutes = require('./routes/leaveRequestRoutes');

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = app;