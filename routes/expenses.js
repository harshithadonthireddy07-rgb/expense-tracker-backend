const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');

// All routes here are protected — user must be logged in
// authMiddleware runs before every route in this file

// ==================
// GET ALL EXPENSES
// GET /api/expenses
// ==================
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Find all expenses belonging to logged in user
        // req.userId comes from our middleware
        const expenses = await Expense.find({ user: req.userId })
            .sort({ date: -1 }); // newest first

        res.json(expenses);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================
// ADD NEW EXPENSE
// POST /api/expenses
// ==================
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { description, amount, category } = req.body;

        // Validate all fields
        if (!description || !amount || !category) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        // Create new expense linked to logged in user
        const expense = new Expense({
            user: req.userId,  // link to logged in user
            description,
            amount,
            category
        });

        await expense.save();

        res.status(201).json({
            message: 'Expense added!',
            expense
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================
// DELETE EXPENSE
// DELETE /api/expenses/:id
// ==================
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Find the expense by ID
        const expense = await Expense.findById(req.params.id);

        // Check if expense exists
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Make sure user can only delete THEIR OWN expenses
        if (expense.user.toString() !== req.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await expense.deleteOne();

        res.json({ message: 'Expense deleted!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================
// GET EXPENSE SUMMARY
// GET /api/expenses/summary
// ==================
router.get('/summary', authMiddleware, async (req, res) => {
    try {
        // Get total spent per category
        const summary = await Expense.aggregate([
            { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(req.userId) } },
            { $group: {
                _id: '$category',
                total: { $sum: '$amount' }
            }},
            { $sort: { total: -1 } }
        ]);

        // Get overall total
        const total = await Expense.aggregate([
            { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(req.userId) } },
            { $group: {
                _id: null,
                total: { $sum: '$amount' }
            }}
        ]);

        res.json({
            categoryBreakdown: summary,
            totalSpent: total[0]?.total || 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;