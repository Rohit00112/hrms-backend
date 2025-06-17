const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
