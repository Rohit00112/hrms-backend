const mongoose = require('mongoose');
const softDeletePlugin = require('../plugins/softDelete');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
  notes: String
}, { timestamps: true });

// Apply soft delete plugin
attendanceSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Attendance', attendanceSchema);
