import express from 'express';
import employeeRoutes from './employeeRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);

export default router;
