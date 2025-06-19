const express = require('express');
const {
  getDashboardStats,
  getEmployeesByDepartment,
  getAttendanceTrends,
  getLeaveRequestStats,
  getRecentActivities
} = require('../controllers/dashboardController');

const router = express.Router();

// Dashboard analytics routes
router.get('/stats', getDashboardStats);                    // GET /api/dashboard/stats
router.get('/employees-by-department', getEmployeesByDepartment); // GET /api/dashboard/employees-by-department
router.get('/attendance-trends', getAttendanceTrends);       // GET /api/dashboard/attendance-trends
router.get('/leave-request-stats', getLeaveRequestStats);   // GET /api/dashboard/leave-request-stats
router.get('/recent-activities', getRecentActivities);      // GET /api/dashboard/recent-activities?limit=10

module.exports = router;
