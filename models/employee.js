import {mongoose} from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        validate: {
            validator: function(email) {
                return Employee.findOne({ email }).then(employee => !employee);
            },
            message: 'Email already exists'
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    role:{
        type: String,
        enum: ['admin', 'employee', 'manager'],
        default: 'employee'
    },
    profileImage: {
        type: String,
        default: ''

        // type: [String],
        // default: []
    }
});


const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;