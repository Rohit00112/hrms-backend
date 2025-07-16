import Employee from '../models/employee.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if employee exists
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: employee._id, 
                email: employee.email 
            },
            "a-string-secret-at-least-256-bits-long",
            { expiresIn: '7d' }
        );

        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                employee: {
                    id: employee._id,
                    name: employee.name,
                    email: employee.email,
                    role: employee.role
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
}

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
}

export { login, logout };