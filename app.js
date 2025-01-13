const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace with a real DB like MongoDB or MySQL)
let data = {
    accountBalance: 1000,  // Default starting account balance
    currency: "KES", // Default currency set to Ksh (Kenyan Shilling)
    monthlyExpenditure: 0,
    expenditures: []
};

// API endpoint to get current data
app.get('/api/expenses', (req, res) => {
    res.json({
        accountBalance: data.accountBalance,
        monthlyExpenditure: data.monthlyExpenditure,
        currency: data.currency
    });
});

// API endpoint to set initial balance and currency
app.post('/api/set-initial-balance', (req, res) => {
    const { initialBalance, currency } = req.body;

    if (isNaN(initialBalance) || initialBalance <= 0 || !currency) {
        return res.status(400).json({ error: 'Invalid initial balance or currency' });
    }

    data.accountBalance = initialBalance;
    data.currency = currency;
    res.json({ accountBalance: data.accountBalance, currency: data.currency, monthlyExpenditure: data.monthlyExpenditure });
});

// API endpoint to add funds
app.post('/api/add-funds', (req, res) => {
    const { addAmount } = req.body;

    if (isNaN(addAmount) || addAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount to add' });
    }

    data.accountBalance += addAmount;
    res.json({ accountBalance: data.accountBalance, currency: data.currency });
});

// API endpoint to add a new expenditure
app.post('/api/expenses', (req, res) => {
    const { day, category, amount } = req.body;

    if (!day || !category || isNaN(amount)) {
        return res.status(400).json({ error: 'Invalid expenditure data' });
    }

    // Add expenditure to the list and update monthly expenditure and account balance
    data.expenditures.push({ day, category, amount });
    data.monthlyExpenditure += amount;
    data.accountBalance -= amount;

    res.json({
        accountBalance: data.accountBalance,
        monthlyExpenditure: data.monthlyExpenditure,
        currency: data.currency
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
