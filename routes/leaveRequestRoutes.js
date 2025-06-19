const express = require('express');
const {
  getAllLeaveRequests,
  getLeaveRequestById,
  getLeaveRequestsByEmployeeId,
  getLeaveRequestsByStatus,
  createLeaveRequest,
  updateLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  deleteLeaveRequest,
  getPendingLeaveRequests,
  getLeaveRequestsByDateRange
} = require('../controllers/leaveRequestController');

const router = express.Router();

// Basic CRUD operations
router.get('/', getAllLeaveRequests);                    // GET /api/leave-requests
router.get('/pending', getPendingLeaveRequests);         // GET /api/leave-requests/pending
router.get('/date-range', getLeaveRequestsByDateRange);  // GET /api/leave-requests/date-range?startDate=&endDate=
router.get('/:id', getLeaveRequestById);                // GET /api/leave-requests/:id
router.get('/employee/:employeeId', getLeaveRequestsByEmployeeId); // GET /api/leave-requests/employee/:employeeId
router.get('/status/:status', getLeaveRequestsByStatus); // GET /api/leave-requests/status/:status
router.post('/', createLeaveRequest);                    // POST /api/leave-requests
router.put('/:id', updateLeaveRequest);                  // PUT /api/leave-requests/:id
router.delete('/:id', deleteLeaveRequest);               // DELETE /api/leave-requests/:id (soft delete)

// Leave request approval operations
router.put('/:id/approve', approveLeaveRequest);         // PUT /api/leave-requests/:id/approve
router.put('/:id/reject', rejectLeaveRequest);           // PUT /api/leave-requests/:id/reject

module.exports = router;
