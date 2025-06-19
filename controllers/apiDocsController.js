// API Documentation Controller
const getApiDocumentation = (req, res) => {
  const apiDocs = {
    title: "HRMS Backend API Documentation",
    version: "1.0.0",
    description: "Human Resource Management System API with comprehensive CRUD operations and soft delete functionality",
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    
    authentication: {
      type: "Bearer Token (JWT)",
      header: "Authorization: Bearer <token>",
      note: "Most endpoints require authentication. Use /api/auth/login to get a token."
    },

    endpoints: {
      authentication: {
        "POST /auth/register": {
          description: "Register a new user",
          body: {
            username: "string (required)",
            email: "string (required)",
            password: "string (required)",
            role: "string (optional: admin|manager|employee)"
          },
          response: "User object with JWT token"
        },
        "POST /auth/login": {
          description: "Login user",
          body: {
            username: "string (required)",
            password: "string (required)"
          },
          response: "JWT token and user info"
        }
      },

      users: {
        "GET /users/me": {
          description: "Get current user profile",
          auth: "Required",
          response: "Current user object"
        },
        "PUT /users/me": {
          description: "Update current user profile",
          auth: "Required",
          body: "User fields to update",
          response: "Updated user object"
        },
        "GET /users": {
          description: "Get all users",
          auth: "Admin/Manager required",
          response: "Array of user objects"
        },
        "GET /users/:id": {
          description: "Get user by ID",
          auth: "Owner or Admin/Manager required",
          response: "User object"
        },
        "PUT /users/:id/toggle-status": {
          description: "Activate/deactivate user",
          auth: "Admin required",
          response: "Updated user status"
        }
      },

      employees: {
        "GET /employees": {
          description: "Get all employees (excluding soft deleted)",
          auth: "Required",
          response: "Array of employee objects"
        },
        "GET /employees/:id": {
          description: "Get employee by ID",
          auth: "Required",
          response: "Employee object with populated references"
        },
        "POST /employees": {
          description: "Create new employee",
          auth: "Admin/Manager required",
          body: {
            userId: "ObjectId (required)",
            firstName: "string",
            lastName: "string",
            departmentId: "ObjectId",
            position: "string",
            salary: "number"
          },
          response: "Created employee object"
        },
        "PUT /employees/:id": {
          description: "Update employee",
          auth: "Admin/Manager required",
          body: "Employee fields to update",
          response: "Updated employee object"
        },
        "DELETE /employees/:id": {
          description: "Soft delete employee",
          auth: "Admin/Manager required",
          response: "Deletion confirmation"
        },
        "GET /employees/deleted/all": {
          description: "Get all soft deleted employees",
          auth: "Admin/Manager required",
          response: "Array of deleted employee objects"
        },
        "PUT /employees/:id/restore": {
          description: "Restore soft deleted employee",
          auth: "Admin/Manager required",
          response: "Restored employee object"
        }
      },

      departments: {
        "GET /departments": {
          description: "Get all departments",
          auth: "Required",
          response: "Array of department objects"
        },
        "POST /departments": {
          description: "Create new department",
          auth: "Admin/Manager required",
          body: {
            name: "string (required)",
            description: "string",
            managerId: "ObjectId"
          },
          response: "Created department object"
        }
      },

      attendance: {
        "GET /attendance": {
          description: "Get all attendance records",
          auth: "Required",
          response: "Array of attendance objects"
        },
        "GET /attendance/employee/:employeeId": {
          description: "Get attendance by employee ID",
          auth: "Required",
          response: "Array of attendance records for employee"
        },
        "GET /attendance/date-range": {
          description: "Get attendance by date range",
          auth: "Required",
          query: {
            startDate: "YYYY-MM-DD",
            endDate: "YYYY-MM-DD"
          },
          response: "Array of attendance records in date range"
        },
        "POST /attendance/check-in": {
          description: "Employee check-in",
          auth: "Required",
          body: {
            employeeId: "ObjectId (required)"
          },
          response: "Check-in confirmation"
        },
        "POST /attendance/check-out": {
          description: "Employee check-out",
          auth: "Required",
          body: {
            employeeId: "ObjectId (required)"
          },
          response: "Check-out confirmation"
        }
      },

      leaveRequests: {
        "GET /leave-requests": {
          description: "Get all leave requests",
          auth: "Required",
          response: "Array of leave request objects"
        },
        "GET /leave-requests/pending": {
          description: "Get pending leave requests",
          auth: "Required",
          response: "Array of pending leave requests"
        },
        "GET /leave-requests/employee/:employeeId": {
          description: "Get leave requests by employee",
          auth: "Required",
          response: "Array of leave requests for employee"
        },
        "POST /leave-requests": {
          description: "Create new leave request",
          auth: "Required",
          body: {
            employeeId: "ObjectId (required)",
            leaveType: "string (sick|vacation|personal)",
            startDate: "Date (required)",
            endDate: "Date (required)",
            reason: "string"
          },
          response: "Created leave request object"
        },
        "PUT /leave-requests/:id/approve": {
          description: "Approve leave request",
          auth: "Admin/Manager required",
          body: {
            approvedBy: "ObjectId (optional)"
          },
          response: "Approved leave request"
        },
        "PUT /leave-requests/:id/reject": {
          description: "Reject leave request",
          auth: "Admin/Manager required",
          body: {
            approvedBy: "ObjectId (optional)"
          },
          response: "Rejected leave request"
        }
      },

      dashboard: {
        "GET /dashboard/stats": {
          description: "Get dashboard overview statistics",
          auth: "Required",
          response: "Dashboard statistics object"
        },
        "GET /dashboard/employees-by-department": {
          description: "Get employee distribution by department",
          auth: "Required",
          response: "Array of department statistics"
        },
        "GET /dashboard/attendance-trends": {
          description: "Get attendance trends for last 7 days",
          auth: "Required",
          response: "Array of daily attendance statistics"
        },
        "GET /dashboard/recent-activities": {
          description: "Get recent activities",
          auth: "Required",
          query: {
            limit: "number (default: 10)"
          },
          response: "Array of recent activity objects"
        }
      }
    },

    roles: {
      admin: "Full access to all endpoints and operations",
      manager: "Can manage employees, departments, and approve leave requests",
      employee: "Can view own data and submit leave requests"
    },

    softDelete: {
      description: "All models support soft delete functionality",
      fields: {
        isDeleted: "Boolean (default: false)",
        deletedAt: "Date (null when not deleted)",
        deletedBy: "ObjectId (reference to user who deleted)"
      },
      behavior: "Soft deleted records are excluded from normal queries but can be retrieved with special endpoints"
    }
  };

  res.json(apiDocs);
};

module.exports = {
  getApiDocumentation
};
