// Function to format currency
function formatCurrency(amount, currency) {
    const options = { style: 'currency', currency: currency };
    
    // Use 'en-KE' locale for Kenyan Shilling (KES)
    if (currency === 'KES') {
        options.locale = 'en-KE';  // Kenya locale for formatting Ksh
    }
    
    return new Intl.NumberFormat(options.locale || 'en-US', options).format(amount);
}

// Handle setting the initial balance
document.getElementById("setInitialBalanceBtn").addEventListener("click", function() {
    const initialBalance = parseFloat(document.getElementById("initialBalance").value);
    const currency = document.getElementById("currencySelect").value;

    if (isNaN(initialBalance) || initialBalance <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Send the initial balance and currency to the server
    fetch('/api/set-initial-balance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ initialBalance, currency })
    })
    .then(response => response.json())
    .then(data => {
        // Update the account balance display with the formatted currency
        document.getElementById("accountBalance").textContent = formatCurrency(data.accountBalance, data.currency);
        document.getElementById("monthlyExpenditure").textContent = formatCurrency(data.monthlyExpenditure, data.currency);
        alert("Initial balance set successfully!");
    })
    .catch(err => console.error("Error setting initial balance:", err));
});

// Handle adding more funds to the account
document.getElementById("addFundsBtn").addEventListener("click", function() {
    const addAmount = parseFloat(document.getElementById("addFunds").value);

    if (isNaN(addAmount) || addAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Send the add funds request to the server
    fetch('/api/add-funds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ addAmount })
    })
    .then(response => response.json())
    .then(data => {
        // Update the account balance display with the formatted currency
        document.getElementById("accountBalance").textContent = formatCurrency(data.accountBalance, data.currency);
        alert("Funds added successfully!");
    })
    .catch(err => console.error("Error adding funds:", err));
});

// Handle form submission for weekly expenditure
document.getElementById("expenseFormElement").addEventListener("submit", function(event) {
    event.preventDefault();

    const day = document.getElementById("day").value;
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (!day || !category || isNaN(amount)) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const expenseData = {
        day: day,
        category: category,
        amount: amount
    };

    // Send expense data to the server
    fetch('/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
    })
    .then(response => response.json())
    .then(data => {
        updateAccountSummary(data);
    })
    .catch(err => console.error("Error:", err));
});

// Update account summary
function updateAccountSummary(data) {
    document.getElementById("accountBalance").textContent = formatCurrency(data.accountBalance, data.currency);
    document.getElementById("monthlyExpenditure").textContent = formatCurrency(data.monthlyExpenditure, data.currency);
    displayMonthlySummary(data.monthlyExpenditure, data.currency);
}

// Display monthly summary
function displayMonthlySummary(monthlyExpenditure, currency) {
    const summarySection = document.getElementById("monthlySummary");
    summarySection.innerHTML = `<p>Total monthly expenditure: ${formatCurrency(monthlyExpenditure, currency)}</p>`;
}

// Initial load of data when the page is loaded
window.onload = function() {
    fetch('/api/expenses')
    .then(response => response.json())
    .then(data => {
        updateAccountSummary(data);
    })
    .catch(err => console.error("Error:", err));
};
