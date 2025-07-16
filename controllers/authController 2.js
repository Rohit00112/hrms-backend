// import jwt from 'jsonwebtoken';
// import Employee from '../models/employee.js';
// import bcrypt from 'bcryptjs';



// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const employee = await Employee.findOne({ email }).select('+password');

//         if (!employee) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid email or password'
//             });
//         }

//         const isMatch = await bcrypt.compare(password, employee.password);

//         if (!isMatch) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid email or password'
//             });
//         }

//         const token = jwt.sign({ id: employee._id, email: employee.email }, "a-string-secret-at-least-256-bits-long", {
//             expiresIn: '1h'
//         });

//         res.cookie('token', token, {
//             httpOnly: true,
//             expires: new Date(Date.now() + 3600000),
//             secure: process.env.NODE_ENV === 'production'
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             data: {
//                 token
//             }
//         });
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error logging in',
//             error: error.message
//         });
//     }
// };

// export { login };

import jwt from "jsonwebtoken";
import Employee from "../models/employee.js";
import bcrypt from "bcryptjs";

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({email}).select('+password');
        if (!employee) {
            res.status(400).json({
                status: false,
                message: "Invalid email or password"
            })
        }
        const isMatch = await bcrypt.compare(password, employee.password);
        if(!isMatch) { 
            res.status(400).json({
                status: false,
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign({
            id: employee._id,
            email: employee.email,
            role: employee.role
        }, process.env.JWT_SECRET || 'your-secret-key-here', {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000),
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                employee: {
                    id: employee._id,
                    name: employee.name,
                    email: employee.email,
                    role: employee.role
                },
                token
            }
        })
    }
    catch (Exception) {
        res.status(500).json({
            status: false,
            message: "Error logging in"
        })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            status: true,
            message: "Logout successful"
        })
    }
    catch (Exception) {
        res.status(500).json({
            status: false,
            message: "Error logging out"
        })
    }
}

export { login, logout }