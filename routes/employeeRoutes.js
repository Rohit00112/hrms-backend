const express = require('express');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDeletedEmployees,
  getAllEmployeesWithDeleted,
  restoreEmployee,
  permanentlyDeleteEmployee
} = require('../controllers/employeeController');

const router = express.Router();

// You can later add authentication middleware here

// Basic CRUD operations
router.get('/', getAllEmployees);             // GET /api/employees
router.get('/:id', getEmployeeById);         // GET /api/employees/:id
router.post('/', createEmployee);            // POST /api/employees
router.put('/:id', updateEmployee);          // PUT /api/employees/:id
router.delete('/:id', deleteEmployee);       // DELETE /api/employees/:id (soft delete)

// Soft delete management routes
router.get('/deleted/all', getDeletedEmployees);           // GET /api/employees/deleted/all
router.get('/with-deleted/all', getAllEmployeesWithDeleted); // GET /api/employees/with-deleted/all
router.put('/:id/restore', restoreEmployee);               // PUT /api/employees/:id/restore
router.delete('/:id/permanent', permanentlyDeleteEmployee); // DELETE /api/employees/:id/permanent

module.exports = router;
