const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

const getAllExpenses = async () => {
    const expenses = await prisma.expense.findMany({
        orderBy: {
            date: 'desc'
        }
    });
    return expenses;
};

const addExpense = async (expense) => {
    const newExpense = await prisma.expense.create({
        data: {
            date: new Date(expense.date),
            description: expense.description,
            payer: expense.payer,
            amount: parseFloat(expense.amount)
        }
    });
    return newExpense;
};

const resetExpenses = async () => {
    // Supprimer toutes les expenses
    await prisma.expense.deleteMany();
    
    // Réinitialiser avec les données initiales (optionnel)
    const fs = require('fs');
    const path = require('path');
    const expensesInitFilePath = path.join(__dirname, '..', 'data', 'expenses.init.json');
    const initData = JSON.parse(fs.readFileSync(expensesInitFilePath, 'utf8'));
    
    // Recréer les expenses initiales
    for (const expense of initData) {
        await prisma.expense.create({
            data: {
                date: new Date(expense.date),
                description: expense.description,
                payer: expense.payer,
                amount: expense.amount
            }
        });
    }
    
    return await getAllExpenses();
};

module.exports = {
    getAllExpenses,
    addExpense,
    resetExpenses,
};