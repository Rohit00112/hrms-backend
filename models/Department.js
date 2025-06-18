const mongoose = require('mongoose');
const softDeletePlugin = require('../plugins/softDelete');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

// Apply soft delete plugin
departmentSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Department', departmentSchema);
