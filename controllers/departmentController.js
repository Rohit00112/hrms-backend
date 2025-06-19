const Department = require('../models/Department');

// Get all departments (excluding soft deleted)
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('managerId');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('managerId');
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new department
const createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete department
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    
    // Soft delete the department
    const deletedBy = req.user?.userId || null; // Assuming middleware sets req.user
    await department.softDelete(deletedBy);
    
    res.json({ 
      message: 'Department deleted successfully',
      department: {
        id: department._id,
        name: department.name,
        deletedAt: department.deletedAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all deleted departments
const getDeletedDepartments = async (req, res) => {
  try {
    const deletedDepartments = await Department.findDeleted().populate('managerId deletedBy');
    res.json(deletedDepartments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all departments including deleted ones
const getAllDepartmentsWithDeleted = async (req, res) => {
  try {
    const departments = await Department.findWithDeleted().populate('managerId');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Restore a soft deleted department
const restoreDepartment = async (req, res) => {
  try {
    const department = await Department.restoreById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    
    res.json({ 
      message: 'Department restored successfully',
      department: {
        id: department._id,
        name: department.name,
        restoredAt: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Permanently delete a department (hard delete)
const permanentlyDeleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    
    res.json({ message: 'Department permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDeletedDepartments,
  getAllDepartmentsWithDeleted,
  restoreDepartment,
  permanentlyDeleteDepartment
};
