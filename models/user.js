const mongoose = require('mongoose');
const softDeletePlugin = require('../plugins/softDelete');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'employee'],
        default: 'employee'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isTempPassword: {
        type: Boolean,
        default: false
    },
    tempPasswordExpiry: {
        type: Date,
        default: null
    },
    requirePasswordReset: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    }
},{timestamps: true})

// Apply soft delete plugin
userSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('User', userSchema);
