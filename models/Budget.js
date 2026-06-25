const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Monthly overall budget
    monthlyBudget: {
        type: Number,
        default: 0
    },
    // Category wise budgets
    categoryBudgets: {
        Food: { type: Number, default: 0 },
        Transport: { type: Number, default: 0 },
        Books: { type: Number, default: 0 },
        Entertainment: { type: Number, default: 0 },
        Shopping: { type: Number, default: 0 },
        Other: { type: Number, default: 0 }
    },
    month: {
        type: String,  // format: "2026-06"
        required: true
    }
});

module.exports = mongoose.model('Budget', BudgetSchema);