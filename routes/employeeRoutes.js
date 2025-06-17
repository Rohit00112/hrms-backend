const express = require('express');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

const router = express.Router();

// You can later add authentication middleware here

router.get('/', getAllEmployees);             // GET /api/employees
router.get('/:id', getEmployeeById);         // GET /api/employees/:id
router.post('/', createEmployee);            // POST /api/employees
router.put('/:id', updateEmployee);          // PUT /api/employees/:id
router.delete('/:id', deleteEmployee);       // DELETE /api/employees/:id

module.exports = router;
