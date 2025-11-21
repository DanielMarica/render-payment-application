const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const expensesFilePath = path.join(__dirname, '..', 'data', 'expenses.json');
const expensesInitFilePath = path.join(__dirname, '..', 'data', 'expenses.init.json');

const getAllExpenses = async () => {
    const data = await fsp.readFile(expensesFilePath, 'utf8');
    return JSON.parse(data);
};

const addExpense = async (expense) => {
    const expenses = await getAllExpenses();
    // A simple ID generation
    const newId = expenses.length > 0 ? Math.max(...expenses.map(e => parseInt(e.id) || 0)) + 1 : 1;
    const newExpense = { ...expense, id: newId.toString() };
    expenses.push(newExpense);
    await fsp.writeFile(expensesFilePath, JSON.stringify(expenses, null, 2));
    return newExpense;
};

const resetExpenses = () => {
    const initData = fs.readFileSync(expensesInitFilePath, 'utf8');
    fs.writeFileSync(expensesFilePath, initData);
    return JSON.parse(initData);
};

module.exports = {
    getAllExpenses,
    addExpense,
    resetExpenses,
};