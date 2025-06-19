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

const router = express.Router();

// User profile routes
router.get('/me', getCurrentUser);                    // GET /api/users/me
router.put('/me', updateCurrentUser);                 // PUT /api/users/me

// Admin user management routes
router.get('/', getAllUsers);                         // GET /api/users
router.get('/deleted', getDeletedUsers);              // GET /api/users/deleted
router.get('/role/:role', getUsersByRole);            // GET /api/users/role/:role
router.get('/:id', getUserById);                      // GET /api/users/:id
router.put('/:id', updateUser);                       // PUT /api/users/:id
router.delete('/:id', deleteUser);                    // DELETE /api/users/:id (soft delete)

// User management operations
router.put('/:id/toggle-status', toggleUserStatus);   // PUT /api/users/:id/toggle-status
router.put('/:id/change-password', changeUserPassword); // PUT /api/users/:id/change-password
router.put('/:id/temp-password', setTempPassword);    // PUT /api/users/:id/temp-password
router.put('/:id/restore', restoreUser);              // PUT /api/users/:id/restore

module.exports = router;
