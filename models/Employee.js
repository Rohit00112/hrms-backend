const mongoose = require('mongoose');
const softDeletePlugin = require('../plugins/softDelete');

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  contactNumber: String,
  address: String,
  hireDate: Date,
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  position: String,
  salary: Number,
  employmentType: { type: String, enum: ['full-time', 'part-time', 'contract'] },
  leaveBalance: {
    annual: { type: Number, default: 0 },
    sick: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Apply soft delete plugin
employeeSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Employee', employeeSchema);
