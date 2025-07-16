import jwt from "jsonwebtoken";
import Employee from "../models/employee.js"

const authenticateToken = async (req,res,next) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            })
        }

        const decoded = jwt.verify(token, "a-string-secret-at-least-256-bits-long");
        req.employee = await Employee.findById(decoded.id).select('-password');      

        next();

    }
    catch (Exception) {
        console.log(Exception.message);
        res.status(401).json({
            status: false,
            message: "Unauthorized"
        })
    }
    
}

const roleMiddleware = (role) => {
    return (req, res, next) => {
        // if(!req.employee.role === role) {
        if(!role.includes(req.employee.role)){
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            })
        }
        next();
    }
}

export { authenticateToken, roleMiddleware };