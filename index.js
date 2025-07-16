import express from 'express';
import './config/database.js';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));


// seed admin user
import Employee from './models/employee.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
    try {
        const admin = await Employee.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin', 10);
            await Employee.create({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}

seedAdmin();


// Routes
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})