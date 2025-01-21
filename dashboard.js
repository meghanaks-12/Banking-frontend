// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        // Redirect to login page if not logged in
        window.location.href = 'index.html';
    }
    // Load user data when page loads
    loadUserData();
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Load user data from localStorage
function loadUserData() {
    const userId = sessionStorage.getItem('userId') || '1234567890'; // Default user ID
    const storedTransactions = localStorage.getItem(`transactions_${userId}`);
    const storedBalance = localStorage.getItem(`balance_${userId}`);
    
    // Initialize or load transactions
    transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    
    // Initialize or load balance
    currentBalance = storedBalance ? parseFloat(storedBalance) : 1000000.00;
    
    // Update UI
    updateBalance();
}

// Save user data to localStorage
function saveUserData() {
    const userId = sessionStorage.getItem('userId') || '1234567890';
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
    localStorage.setItem(`balance_${userId}`, currentBalance.toString());
}

// Logout function
function logout() {
    // Save data before logging out
    saveUserData();
    // Clear session storage
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = 'index.html';
}

// Initialize variables
let transactions = [];
let currentBalance = 1000000.00;

// Function to format amount in Indian currency format
function formatIndianCurrency(amount) {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(amount);
}

function openModal(type) {
    const modal = document.getElementById('transactionModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('transactionForm');
    
    modalTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    modal.dataset.type = type;
    modal.style.display = 'block';

    form.onsubmit = handleTransaction;
}

function closeModal() {
    document.getElementById('transactionModal').style.display = 'none';
    document.getElementById('amount').value = '';
}

function handleTransaction(e) {
    e.preventDefault();
    const type = document.getElementById('transactionModal').dataset.type;
    const amount = parseFloat(document.getElementById('amount').value);

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }

    if (type === 'withdraw' && amount > currentBalance) {
        alert('Insufficient funds!');
        return;
    }

    if (type === 'withdraw') {
        currentBalance -= amount;
        transactions.unshift({
            type: 'Withdrawal',
            amount: amount,
            date: new Date().toLocaleDateString('en-IN'),
            timestamp: new Date().getTime()
        });
    } else {
        currentBalance += amount;
        transactions.unshift({
            type: 'Deposit',
            amount: amount,
            date: new Date().toLocaleDateString('en-IN'),
            timestamp: new Date().getTime()
        });
    }

    // Save data after each transaction
    saveUserData();
    updateBalance();
    closeModal();
    // Refresh transaction history if it's visible
    const transactionList = document.querySelector('.transaction-list');
    if (transactionList.style.display === 'block') {
        viewTransactionHistory();
    }
}

function checkBalance() {
    alert(`Your current balance is: ${formatIndianCurrency(currentBalance)}`);
}

function updateBalance() {
    document.getElementById('currentBalance').textContent = formatIndianCurrency(currentBalance);
}

function viewTransactionHistory() {
    const transactionList = document.querySelector('.transaction-list');
    transactionList.style.display = 'block';
    transactionList.innerHTML = '';

    if (transactions.length === 0) {
        transactionList.innerHTML = '<p class="transaction-item">No transactions found.</p>';
        return;
    }

    // Sort transactions by timestamp in descending order
    const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

    sortedTransactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div>
                <strong>${transaction.type}</strong>
                <div>${transaction.date}</div>
            </div>
            <div>${formatIndianCurrency(transaction.amount)}</div>
        `;
        transactionList.appendChild(item);
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('transactionModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize balance display and load data when page loads
loadUserData();


