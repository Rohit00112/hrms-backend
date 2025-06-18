const Employee = require('../models/Employee');
const User = require('../models/User');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('userId departmentId');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId departmentId');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Soft delete the employee
    const deletedBy = req.user?.userId || null; // Assuming middleware sets req.user
    await employee.softDelete(deletedBy);

    res.json({
      message: 'Employee deleted successfully',
      employee: {
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        deletedAt: employee.deletedAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all deleted employees
const getDeletedEmployees = async (req, res) => {
  try {
    const deletedEmployees = await Employee.findDeleted().populate('userId departmentId deletedBy');
    res.json(deletedEmployees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all employees including deleted ones
const getAllEmployeesWithDeleted = async (req, res) => {
  try {
    const employees = await Employee.findWithDeleted().populate('userId departmentId');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Restore a soft deleted employee
const restoreEmployee = async (req, res) => {
  try {
    const employee = await Employee.restoreById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.json({
      message: 'Employee restored successfully',
      employee: {
        id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
        restoredAt: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Permanently delete an employee (hard delete)
const permanentlyDeleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.json({ message: 'Employee permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDeletedEmployees,
  getAllEmployeesWithDeleted,
  restoreEmployee,
  permanentlyDeleteEmployee
};
