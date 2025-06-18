const mongoose = require('mongoose');

/**
 * Soft Delete Plugin for Mongoose
 * Adds soft delete functionality to any schema
 */
function softDeletePlugin(schema, options) {
  // Add soft delete fields to schema
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  });

  // Override find methods to exclude soft deleted documents by default
  schema.pre(/^find/, function() {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: { $ne: true } });
    }
  });

  // Override findOne methods
  schema.pre('findOne', function() {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: { $ne: true } });
    }
  });

  // Override findOneAndUpdate methods
  schema.pre('findOneAndUpdate', function() {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: { $ne: true } });
    }
  });

  // Override count and countDocuments
  schema.pre('countDocuments', function() {
    if (!this.getOptions().includeDeleted) {
      this.where({ isDeleted: { $ne: true } });
    }
  });

  // Add instance methods
  schema.methods.softDelete = function(deletedBy = null) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    if (deletedBy) {
      this.deletedBy = deletedBy;
    }
    return this.save();
  };

  schema.methods.restore = function() {
    this.isDeleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save();
  };

  // Add static methods
  schema.statics.findDeleted = function(conditions = {}) {
    return this.find({ ...conditions, isDeleted: true });
  };

  schema.statics.findWithDeleted = function(conditions = {}) {
    return this.find(conditions, null, { includeDeleted: true });
  };

  schema.statics.softDeleteById = function(id, deletedBy = null) {
    const updateData = {
      isDeleted: true,
      deletedAt: new Date()
    };
    if (deletedBy) {
      updateData.deletedBy = deletedBy;
    }
    return this.findByIdAndUpdate(id, updateData, { new: true });
  };

  schema.statics.restoreById = function(id) {
    return this.findByIdAndUpdate(id, {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null
    }, { new: true });
  };
}

module.exports = softDeletePlugin;
