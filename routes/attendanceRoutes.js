const express = require('express');
const {
  getAllAttendance,
  getAttendanceById,
  getAttendanceByEmployeeId,
  getAttendanceByDateRange,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  checkIn,
  checkOut
} = require('../controllers/attendanceController');

const router = express.Router();

// Basic CRUD operations
router.get('/', getAllAttendance);                    // GET /api/attendance
router.get('/date-range', getAttendanceByDateRange);  // GET /api/attendance/date-range?startDate=&endDate=
router.get('/:id', getAttendanceById);               // GET /api/attendance/:id
router.get('/employee/:employeeId', getAttendanceByEmployeeId); // GET /api/attendance/employee/:employeeId
router.post('/', createAttendance);                  // POST /api/attendance
router.put('/:id', updateAttendance);                // PUT /api/attendance/:id
router.delete('/:id', deleteAttendance);             // DELETE /api/attendance/:id (soft delete)

// Check-in/Check-out operations
router.post('/check-in', checkIn);                   // POST /api/attendance/check-in
router.post('/check-out', checkOut);                 // POST /api/attendance/check-out

module.exports = router;
