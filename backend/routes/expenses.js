const express = require('express');
const router = express.Router();
const expensesService = require('../services/expenses');

// GET /api/expenses
router.get('/expenses', async (req, res, next) => {
    try {
        const expenses = await expensesService.getAllExpenses();
        res.json(expenses);
    } catch (err) {
        console.error('Failed to get expenses:', err);
        res.status(500).json({ message: 'Failed to retrieve expenses' });
    }
});

// POST /api/expenses
router.post('/expenses', async (req, res, next) => {
    try {
        const newExpense = await expensesService.addExpense(req.body);
        res.status(201).json(newExpense);
    } catch (err) {
        console.error('Failed to add expense:', err);
        res.status(500).json({ message: 'Failed to add expense' });
    }
});

// POST /api/expenses/reset
router.post('/expenses/reset', (req, res, next) => {
    try {
        const resetData = expensesService.resetExpenses();
        res.json({ message: 'Data reset successfully', expenses: resetData });
    } catch (err) {
        console.error('Failed to reset expenses:', err);
        res.status(500).json({ message: 'Failed to reset data' });
    }
});

module.exports = router;