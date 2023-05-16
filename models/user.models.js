const mongoose = require('mongoose');

// User Schema
let userSchema = mongoose.Schema({
    username: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    }
},
    {
        timestamps: true
    }
)


//Export Mongoose model 
let User = mongoose.model('user', userSchema);
module.exports = User