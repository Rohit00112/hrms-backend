import Employee from '../models/employee.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';



// const createEmployee = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // Check if employee already exists
//         const existingEmployee = await Employee.findOne({ email });
//         if (existingEmployee) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Employee with this email already exists'
//             });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // // upload image
//         const uploadedFile = req.file;
//         const profileImage = uploadedFile ? uploadedFile.filename : '';

//         // upload multiple images
//         // const uploadedFiles = req.files;
//         // const profileImage = uploadedFiles ? uploadedFiles.map(file => file.filename) : [];




//         // Create new employee
//         const employee = new Employee({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//             profileImage
//         });

//         const savedEmployee = await employee.save();

//         // Return employee data without password
//         const { password: _, ...employeeData } = savedEmployee.toObject();

//         res.status(201).json({
//             success: true,
//             message: 'Employee created successfully',
//             data: employeeData
//         });
//     }
//     catch (error) {
//         console.error('Error creating employee:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating employee',
//             error: error.message
//         });
//     }
// };

const createEmployee = async (req, res) => {
    try {

        const employee = new Employee(req.body);
        const hashedPassword = await bcrypt.hash(employee.password, 10);
        employee.password = hashedPassword;
        const savedEmployee = await employee.save();

        sendEmail(employee.email, 'Welcome to our company', 'Hello ' 
            + employee.name + 
            ', welcome to our company. We are glad to have you on board. ' + 
            `Your login credentials are as follows: \nEmail: ' `
            + employee.email + '\nPassword: ' + req.body.password + '\n\nThank you,\nAdmin');

        const { password: _, ...employeeData } = savedEmployee.toObject();
        employeeData.profileImage = req.file.filename;

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employeeData
        });
        console.log(savedEmployee);
        console.log(req.body);
    }
    catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating employee',
            error: error.message
        });
    }
}

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().select('-password');
        res.status(200).json({
            success: true,
            message: 'Employees retrieved successfully',
            data: employees
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving employees',
            error: error.message
        });
    }
}


const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: updatedEmployee
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating employee',
            error: error.message
        });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting employee',
            error: error.message
        });
    }
};

const getEmployeeByID = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id);

        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee with that id doesnot exist."
            })
        }

        res.status(200).json({
            success: true,
            message: "Employee retrived successfully",
            data: employee
        })
    }
    catch (Exception) {
        res.status(500).json({
            success: false,
            message: "Error retriving employee"
        })
    }
}

export { createEmployee, getEmployees, getEmployeeByID, deleteEmployee };
