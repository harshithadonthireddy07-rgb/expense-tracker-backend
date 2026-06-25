const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

// ==================
// GET BUDGET FOR CURRENT MONTH
// GET /api/budget
// ==================
router.get('/', authMiddleware, async (req, res) => {
    try {
        const month = new Date().toISOString().slice(0, 7); // "2026-06"
        
        let budget = await Budget.findOne({ 
            user: req.userId, 
            month 
        });

        if (!budget) {
            // Create default budget if none exists
            budget = new Budget({
                user: req.userId,
                month,
                monthlyBudget: 0,
                categoryBudgets: {
                    Food: 0, Transport: 0, Books: 0,
                    Entertainment: 0, Shopping: 0, Other: 0
                }
            });
            await budget.save();
        }

        res.json(budget);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================
// UPDATE BUDGET
// POST /api/budget
// ==================
router.post('/', authMiddleware, async (req, res) => {
    try {
        const month = new Date().toISOString().slice(0, 7);
        const { monthlyBudget, categoryBudgets } = req.body;

        let budget = await Budget.findOne({ user: req.userId, month });

        if (!budget) {
            budget = new Budget({
                user: req.userId,
                month,
                monthlyBudget: monthlyBudget || 0,
                categoryBudgets: categoryBudgets || {}
            });
        } else {
            if (monthlyBudget !== undefined) budget.monthlyBudget = monthlyBudget;
            if (categoryBudgets) budget.categoryBudgets = categoryBudgets;
        }

        await budget.save();
        res.json({ message: 'Budget updated!', budget });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================
// GET MONTHLY HISTORY
// GET /api/budget/history
// ==================
router.get('/history', authMiddleware, async (req, res) => {
    try {
        // Get last 6 months of expenses
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const history = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.userId),
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json(history);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;