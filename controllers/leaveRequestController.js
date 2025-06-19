const LeaveRequest = require('../models/LeaveRequest');

// Get all leave requests (excluding soft deleted)
const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().populate('employeeId approvedBy');
    res.json(leaveRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leave request by ID
const getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id).populate('employeeId approvedBy');
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });
    res.json(leaveRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leave requests by employee ID
const getLeaveRequestsByEmployeeId = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ employeeId: req.params.employeeId }).populate('employeeId approvedBy');
    res.json(leaveRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leave requests by status
const getLeaveRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const leaveRequests = await LeaveRequest.find({ status }).populate('employeeId approvedBy');
    res.json(leaveRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new leave request
const createLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = new LeaveRequest(req.body);
    await leaveRequest.save();
    res.status(201).json(leaveRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update leave request
const updateLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });
    res.json(leaveRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Approve leave request
const approveLeaveRequest = async (req, res) => {
  try {
    const { approvedBy } = req.body;
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        approvedBy: approvedBy || req.user?.userId
      },
      { new: true }
    ).populate('employeeId approvedBy');
    
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });
    
    res.json({ 
      message: 'Leave request approved successfully',
      leaveRequest 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject leave request
const rejectLeaveRequest = async (req, res) => {
  try {
    const { approvedBy } = req.body;
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        approvedBy: approvedBy || req.user?.userId
      },
      { new: true }
    ).populate('employeeId approvedBy');
    
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });
    
    res.json({ 
      message: 'Leave request rejected',
      leaveRequest 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete leave request
const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });
    
    // Soft delete the leave request
    const deletedBy = req.user?.userId || null; // Assuming middleware sets req.user
    await leaveRequest.softDelete(deletedBy);
    
    res.json({ 
      message: 'Leave request deleted successfully',
      leaveRequest: {
        id: leaveRequest._id,
        leaveType: leaveRequest.leaveType,
        deletedAt: leaveRequest.deletedAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get pending leave requests
const getPendingLeaveRequests = async (req, res) => {
  try {
    const pendingRequests = await LeaveRequest.find({ status: 'pending' }).populate('employeeId');
    res.json(pendingRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leave requests by date range
const getLeaveRequestsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.$or = [
        {
          startDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        },
        {
          endDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      ];
    }
    
    const leaveRequests = await LeaveRequest.find(query).populate('employeeId approvedBy');
    res.json(leaveRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
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
};
