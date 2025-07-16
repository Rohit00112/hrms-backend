import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://subedirohit49:Belbari890@cluster0.lqorrbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

// Initialize database connection
connectDB();

export default connectDB;
