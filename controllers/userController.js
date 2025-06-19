const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get all users (excluding soft deleted)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash'); // Exclude password hash
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { passwordHash, ...updateData } = req.body; // Exclude password hash from direct updates
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update current user profile
const updateCurrentUser = async (req, res) => {
  try {
    const { passwordHash, ...updateData } = req.body; // Exclude password hash from direct updates
    const user = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Change user password (admin)
const changeUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        passwordHash,
        requirePasswordReset: false,
        isTempPassword: false,
        tempPasswordExpiry: null
      },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ 
      message: 'Password updated successfully',
      user 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set temporary password
const setTempPassword = async (req, res) => {
  try {
    const { tempPassword, expiryHours = 24 } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(tempPassword, saltRounds);
    
    const tempPasswordExpiry = new Date();
    tempPasswordExpiry.setHours(tempPasswordExpiry.getHours() + expiryHours);
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        passwordHash,
        isTempPassword: true,
        tempPasswordExpiry,
        requirePasswordReset: true
      },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ 
      message: 'Temporary password set successfully',
      user,
      expiresAt: tempPasswordExpiry
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Activate/Deactivate user
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get users by role
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role }).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Soft delete the user
    const deletedBy = req.user?.userId || null;
    await user.softDelete(deletedBy);
    
    res.json({ 
      message: 'User deleted successfully',
      user: {
        id: user._id,
        username: user.username,
        deletedAt: user.deletedAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get deleted users
const getDeletedUsers = async (req, res) => {
  try {
    const deletedUsers = await User.findDeleted().select('-passwordHash').populate('deletedBy');
    res.json(deletedUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Restore user
const restoreUser = async (req, res) => {
  try {
    const user = await User.restoreById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ 
      message: 'User restored successfully',
      user: {
        id: user._id,
        username: user.username,
        restoredAt: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
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
};
