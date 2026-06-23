const mongoose = require('mongoose');

// This defines what a User looks like in our database
const UserSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true  // name is compulsory
    },

    email: {
        type: String,
        required: true,
        unique: true    // no two users can have same email
    },

    password: {
        type: String,
        required: true  // password is compulsory
    },

    createdAt: {
        type: Date,
        default: Date.now  // automatically saves signup time
    }

});

// Export this model so other files can use it
module.exports = mongoose.model('User', UserSchema);