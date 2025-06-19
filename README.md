# HRMS Backend API

A comprehensive Human Resource Management System backend built with Node.js, Express, and MongoDB. Features include employee management, attendance tracking, leave requests, and soft delete functionality.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Employee Management** - Complete CRUD operations for employee records
- **Department Management** - Organize employees by departments
- **Attendance Tracking** - Check-in/check-out functionality with reporting
- **Leave Request System** - Submit, approve, and track leave requests
- **Soft Delete** - All models support soft delete with restore functionality
- **Dashboard Analytics** - Statistics and trends for HR insights
- **Role-Based Access** - Admin, Manager, and Employee roles with different permissions

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Environment Variables**: dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hrms-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGO_URI=mongodb://username:password@localhost:27017/hrms?authSource=admin
   PORT=3000
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

Visit `/api/docs` endpoint for complete API documentation, or check the endpoints below:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users` - Get all users (Admin/Manager)
- `PUT /api/users/:id/toggle-status` - Activate/deactivate user (Admin)

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee (Admin/Manager)
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee (Admin/Manager)
- `DELETE /api/employees/:id` - Soft delete employee (Admin/Manager)
- `GET /api/employees/deleted/all` - Get deleted employees (Admin/Manager)
- `PUT /api/employees/:id/restore` - Restore employee (Admin/Manager)

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department (Admin/Manager)
- `PUT /api/departments/:id` - Update department (Admin/Manager)
- `DELETE /api/departments/:id` - Soft delete department (Admin/Manager)

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/check-in` - Employee check-in
- `POST /api/attendance/check-out` - Employee check-out
- `GET /api/attendance/employee/:employeeId` - Get employee attendance
- `GET /api/attendance/date-range` - Get attendance by date range

### Leave Requests
- `GET /api/leave-requests` - Get leave requests
- `POST /api/leave-requests` - Create leave request
- `GET /api/leave-requests/pending` - Get pending requests
- `PUT /api/leave-requests/:id/approve` - Approve request (Admin/Manager)
- `PUT /api/leave-requests/:id/reject` - Reject request (Admin/Manager)

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/employees-by-department` - Employee distribution
- `GET /api/dashboard/attendance-trends` - Attendance trends
- `GET /api/dashboard/recent-activities` - Recent activities

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **Admin**: Full access to all operations
- **Manager**: Can manage employees, departments, and approve leave requests
- **Employee**: Can view own data and submit leave requests

## 🗃️ Database Models

### User
- username, email, passwordHash
- role (admin/manager/employee)
- isActive, lastLogin
- Soft delete fields

### Employee
- Personal info (firstName, lastName, dateOfBirth)
- Work info (position, salary, hireDate)
- References to User and Department
- Soft delete fields

### Department
- name, description
- managerId reference
- Soft delete fields

### Attendance
- employeeId reference
- date, checkIn, checkOut
- status (present/absent/late)
- Soft delete fields

### LeaveRequest
- employeeId reference
- leaveType (sick/vacation/personal)
- startDate, endDate, reason
- status (pending/approved/rejected)
- approvedBy reference
- Soft delete fields

## 🔄 Soft Delete

All models support soft delete functionality:
- Records are marked as deleted instead of being removed
- Soft deleted records are excluded from normal queries
- Special endpoints available to view and restore deleted records
- Fields: `isDeleted`, `deletedAt`, `deletedBy`

## 🚦 Error Handling

The API includes comprehensive error handling:
- Validation errors
- Authentication errors
- Database errors
- 404 for undefined routes
- Global error middleware

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support, email [your-email] or create an issue in the repository.
