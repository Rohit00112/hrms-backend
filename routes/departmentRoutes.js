const express = require('express');
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDeletedDepartments,
  getAllDepartmentsWithDeleted,
  restoreDepartment,
  permanentlyDeleteDepartment
} = require('../controllers/departmentController');

const router = express.Router();

// Basic CRUD operations
router.get('/', getAllDepartments);             // GET /api/departments
router.get('/:id', getDepartmentById);         // GET /api/departments/:id
router.post('/', createDepartment);            // POST /api/departments
router.put('/:id', updateDepartment);          // PUT /api/departments/:id
router.delete('/:id', deleteDepartment);       // DELETE /api/departments/:id (soft delete)

// Soft delete management routes
router.get('/deleted/all', getDeletedDepartments);           // GET /api/departments/deleted/all
router.get('/with-deleted/all', getAllDepartmentsWithDeleted); // GET /api/departments/with-deleted/all
router.put('/:id/restore', restoreDepartment);               // PUT /api/departments/:id/restore
router.delete('/:id/permanent', permanentlyDeleteDepartment); // DELETE /api/departments/:id/permanent

module.exports = router;
