const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
