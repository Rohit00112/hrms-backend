const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveType: { type: String, enum: ['sick', 'vacation', 'personal'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
