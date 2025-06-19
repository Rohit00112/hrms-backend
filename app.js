const express = require('express');
const app = express();
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRequestRoutes = require('./routes/leaveRequestRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { getApiDocumentation } = require('./controllers/apiDocsController');
const { errorHandler, notFound } = require('./middleware/errorHandler');

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);

// API Documentation endpoint
app.get('/api/docs', getApiDocumentation);

app.get('/', (req, res) => {
    res.json({
        message: 'HRMS Backend API',
        version: '1.0.0',
        documentation: '/api/docs',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            employees: '/api/employees',
            departments: '/api/departments',
            attendance: '/api/attendance',
            leaveRequests: '/api/leave-requests',
            dashboard: '/api/dashboard'
        }
    });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;