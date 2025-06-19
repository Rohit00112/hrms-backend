const User = require('../models/User');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');

// Get dashboard overview statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get counts for all entities
    const [
      totalUsers,
      activeUsers,
      totalEmployees,
      totalDepartments,
      pendingLeaveRequests,
      approvedLeaveRequests,
      todayAttendance
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Employee.countDocuments(),
      Department.countDocuments(),
      LeaveRequest.countDocuments({ status: 'pending' }),
      LeaveRequest.countDocuments({ status: 'approved' }),
      Attendance.countDocuments({ 
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      })
    ]);

    // Calculate attendance rate for today
    const totalEmployeesForAttendance = await Employee.countDocuments();
    const attendanceRate = totalEmployeesForAttendance > 0 
      ? ((todayAttendance / totalEmployeesForAttendance) * 100).toFixed(2)
      : 0;

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers
      },
      employees: {
        total: totalEmployees
      },
      departments: {
        total: totalDepartments
      },
      leaveRequests: {
        pending: pendingLeaveRequests,
        approved: approvedLeaveRequests
      },
      attendance: {
        today: todayAttendance,
        rate: `${attendanceRate}%`
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employee distribution by department
const getEmployeesByDepartment = async (req, res) => {
  try {
    const departmentStats = await Employee.aggregate([
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$department._id',
          departmentName: { $first: '$department.name' },
          employeeCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          departmentName: { $ifNull: ['$departmentName', 'Unassigned'] },
          employeeCount: 1
        }
      },
      {
        $sort: { employeeCount: -1 }
      }
    ]);

    res.json(departmentStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attendance trends for the last 7 days
const getAttendanceTrends = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const attendanceTrends = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          present: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          },
          late: {
            $sum: {
              $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
            }
          },
          total: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(attendanceTrends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leave request statistics
const getLeaveRequestStats = async (req, res) => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const [
      monthlyStats,
      typeStats,
      statusStats
    ] = await Promise.all([
      // Monthly leave requests
      LeaveRequest.aggregate([
        {
          $match: {
            createdAt: {
              $gte: currentMonth,
              $lt: nextMonth
            }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      // Leave requests by type
      LeaveRequest.aggregate([
        {
          $group: {
            _id: '$leaveType',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),
      // Overall status distribution
      LeaveRequest.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      monthly: monthlyStats,
      byType: typeStats,
      byStatus: statusStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get recent activities (latest leave requests, attendance, etc.)
const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const [
      recentLeaveRequests,
      recentAttendance
    ] = await Promise.all([
      LeaveRequest.find()
        .populate('employeeId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(limit),
      Attendance.find()
        .populate('employeeId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(limit)
    ]);

    // Combine and sort by date
    const activities = [
      ...recentLeaveRequests.map(lr => ({
        type: 'leave_request',
        id: lr._id,
        employee: lr.employeeId,
        data: {
          leaveType: lr.leaveType,
          status: lr.status,
          startDate: lr.startDate,
          endDate: lr.endDate
        },
        createdAt: lr.createdAt
      })),
      ...recentAttendance.map(att => ({
        type: 'attendance',
        id: att._id,
        employee: att.employeeId,
        data: {
          date: att.date,
          status: att.status,
          checkIn: att.checkIn,
          checkOut: att.checkOut
        },
        createdAt: att.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardStats,
  getEmployeesByDepartment,
  getAttendanceTrends,
  getLeaveRequestStats,
  getRecentActivities
};
