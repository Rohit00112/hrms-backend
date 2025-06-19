const express = require('express');
const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateCurrentUser,
  changeUserPassword,
  setTempPassword,
  toggleUserStatus,
  getUsersByRole,
  deleteUser,
  getDeletedUsers,
  restoreUser
} = require('../controllers/userController');
const {
  authenticateToken,
  requireAdmin,
  requireAdminOrManager,
  requireOwnershipOrAdmin
} = require('../middleware/auth');

const router = express.Router();

// User profile routes (require authentication)
router.get('/me', authenticateToken, getCurrentUser);                    // GET /api/users/me
router.put('/me', authenticateToken, updateCurrentUser);                 // PUT /api/users/me

// Admin user management routes (require admin access)
router.get('/', authenticateToken, requireAdminOrManager, getAllUsers);                         // GET /api/users
router.get('/deleted', authenticateToken, requireAdmin, getDeletedUsers);              // GET /api/users/deleted
router.get('/role/:role', authenticateToken, requireAdminOrManager, getUsersByRole);            // GET /api/users/role/:role
router.get('/:id', authenticateToken, requireOwnershipOrAdmin, getUserById);                      // GET /api/users/:id
router.put('/:id', authenticateToken, requireOwnershipOrAdmin, updateUser);                       // PUT /api/users/:id
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);                    // DELETE /api/users/:id (soft delete)

// User management operations (admin only)
router.put('/:id/toggle-status', authenticateToken, requireAdmin, toggleUserStatus);   // PUT /api/users/:id/toggle-status
router.put('/:id/change-password', authenticateToken, requireAdmin, changeUserPassword); // PUT /api/users/:id/change-password
router.put('/:id/temp-password', authenticateToken, requireAdmin, setTempPassword);    // PUT /api/users/:id/temp-password
router.put('/:id/restore', authenticateToken, requireAdmin, restoreUser);              // PUT /api/users/:id/restore

module.exports = router;
