const mongoose = require('mongoose');

// This defines what an Expense looks like in our database
const ExpenseSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
        // This links every expense to a specific user
        // So user A can never see user B's expenses
    },

    description: {
        type: String,
        required: true  // what was the expense for
    },

    amount: {
        type: Number,
        required: true  // how much was spent
    },

    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Books', 'Entertainment', 'Shopping', 'Other']
        // enum means only these values are allowed
    },

    date: {
        type: Date,
        default: Date.now  // automatically saves when expense was added
    }

});

// Export this model
module.exports = mongoose.model('Expense', ExpenseSchema);