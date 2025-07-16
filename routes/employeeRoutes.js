import express from 'express';
import { createEmployee, getEmployees, getEmployeeByID, deleteEmployee } from '../controllers/employeeController.js';
import { authenticateToken, roleMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../utils/imageUpload.js';


const router = express.Router();

// Protected employee routes (require authentication)
router.post('/', [authenticateToken, roleMiddleware(['admin', 'manager']), upload.single('profileImage')], 
createEmployee);


router.get('/',authenticateToken, getEmployees);
router.get('/:id',authenticateToken, getEmployeeByID);
router.delete('/:id',[authenticateToken, roleMiddleware(['admin', 'manager'])], deleteEmployee);

export default router;
