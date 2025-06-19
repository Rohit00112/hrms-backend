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
const {
  authenticateToken,
  requireAdmin,
  requireAdminOrManager
} = require('../middleware/auth');

const router = express.Router();

// You can later add authentication middleware here

// Basic CRUD operations (require authentication)
router.get('/', authenticateToken, getAllEmployees);             // GET /api/employees
router.get('/:id', authenticateToken, getEmployeeById);         // GET /api/employees/:id
router.post('/', authenticateToken, requireAdminOrManager, createEmployee);            // POST /api/employees
router.put('/:id', authenticateToken, requireAdminOrManager, updateEmployee);          // PUT /api/employees/:id
router.delete('/:id', authenticateToken, requireAdminOrManager, deleteEmployee);       // DELETE /api/employees/:id (soft delete)

// Soft delete management routes (admin/manager only)
router.get('/deleted/all', authenticateToken, requireAdminOrManager, getDeletedEmployees);           // GET /api/employees/deleted/all
router.get('/with-deleted/all', authenticateToken, requireAdminOrManager, getAllEmployeesWithDeleted); // GET /api/employees/with-deleted/all
router.put('/:id/restore', authenticateToken, requireAdminOrManager, restoreEmployee);               // PUT /api/employees/:id/restore
router.delete('/:id/permanent', authenticateToken, requireAdmin, permanentlyDeleteEmployee); // DELETE /api/employees/:id/permanent

module.exports = router;
