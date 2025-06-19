const Attendance = require('../models/Attendance');

// Get all attendance records (excluding soft deleted)
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('employeeId');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attendance by ID
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate('employeeId');
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attendance by employee ID
const getAttendanceByEmployeeId = async (req, res) => {
  try {
    const attendance = await Attendance.find({ employeeId: req.params.employeeId }).populate('employeeId');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attendance by date range
const getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendance = await Attendance.find(query).populate('employeeId');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new attendance record
const createAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update attendance record
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete attendance record
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
    
    // Soft delete the attendance record
    const deletedBy = req.user?.userId || null; // Assuming middleware sets req.user
    await attendance.softDelete(deletedBy);
    
    res.json({ 
      message: 'Attendance record deleted successfully',
      attendance: {
        id: attendance._id,
        date: attendance.date,
        deletedAt: attendance.deletedAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check in employee
const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if attendance already exists for today
    let attendance = await Attendance.findOne({
      employeeId,
      date: today
    });
    
    if (attendance) {
      if (attendance.checkIn) {
        return res.status(400).json({ message: 'Employee already checked in today' });
      }
      // Update existing record
      attendance.checkIn = new Date();
      attendance.status = 'present';
    } else {
      // Create new attendance record
      attendance = new Attendance({
        employeeId,
        date: today,
        checkIn: new Date(),
        status: 'present'
      });
    }
    
    await attendance.save();
    res.json({ message: 'Check-in successful', attendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check out employee
const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employeeId,
      date: today
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for today' });
    }
    
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Employee already checked out today' });
    }
    
    attendance.checkOut = new Date();
    await attendance.save();
    
    res.json({ message: 'Check-out successful', attendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAttendance,
  getAttendanceById,
  getAttendanceByEmployeeId,
  getAttendanceByDateRange,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  checkIn,
  checkOut
};
