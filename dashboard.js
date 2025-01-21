// // Check if user is logged in
// function checkAuth() {
//     const isLoggedIn = sessionStorage.getItem('isLoggedIn');
//     if (!isLoggedIn) {
//         // Redirect to login page if not logged in
//         window.location.href = 'index.html';
//     }
//     // Load user data when page loads
//     loadUserData();
// }

// // Run auth check when page loads
// document.addEventListener('DOMContentLoaded', checkAuth);

// // Load user data from localStorage
// function loadUserData() { 
//     const userId = sessionStorage.getItem('userId') || '1234567890'; // Default user ID
//     const storedTransactions = localStorage.getItem(`transactions_${userId}`);
//     const storedBalance = localStorage.getItem(`balance_${userId}`);
    
//     // Initialize or load transactions
//     transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    
//     // Initialize or load balance
//     currentBalance = storedBalance ? parseFloat(storedBalance) : 1000000.00;
    
//     // Update UI
//     updateBalance();
// }

// // Save user data to localStorage
// function saveUserData() {
//     const userId = sessionStorage.getItem('userId') || '1234567890';
//     localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
//     localStorage.setItem(`balance_${userId}`, currentBalance.toString());
// }

// // Logout function
// function logout() {
//     // Save data before logging out
//     saveUserData();
//     // Clear session storage
//     sessionStorage.clear();
//     // Redirect to login page
//     window.location.href = 'index.html';
// }

// // Initialize variables
// let transactions = [];
// let currentBalance = 1000000.00;

// // Function to format amount in Indian currency format
// function formatIndianCurrency(amount) {
//     const formatter = new Intl.NumberFormat('en-IN', {
//         style: 'currency',
//         currency: 'INR',
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//     });
//     return formatter.format(amount);
// }

// function openModal(type) {
//     const modal = document.getElementById('transactionModal');
//     const modalTitle = document.getElementById('modalTitle');
//     const form = document.getElementById('transactionForm');
    
//     modalTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
//     modal.dataset.type = type;
//     modal.style.display = 'block';

//     form.onsubmit = handleTransaction;
// }

// function closeModal() {
//     document.getElementById('transactionModal').style.display = 'none';
//     document.getElementById('amount').value = '';
// }

// function handleTransaction(e) {
//     e.preventDefault();
//     const type = document.getElementById('transactionModal').dataset.type;
//     const amount = parseFloat(document.getElementById('amount').value);

//     if (isNaN(amount) || amount <= 0) {
//         alert('Please enter a valid amount!');
//         return;
//     }

//     if (type === 'withdraw' && amount > currentBalance) {
//         alert('Insufficient funds!');
//         return;
//     }

//     if (type === 'withdraw') {
//         currentBalance -= amount;
//         transactions.unshift({
//             type: 'Withdrawal',
//             amount: amount,
//             date: new Date().toLocaleDateString('en-IN'),
//             timestamp: new Date().getTime()
//         });
//     } else {
//         currentBalance += amount;
//         transactions.unshift({
//             type: 'Deposit',
//             amount: amount,
//             date: new Date().toLocaleDateString('en-IN'),
//             timestamp: new Date().getTime()
//         });
//     }

//     // Save data after each transaction
//     saveUserData();
//     updateBalance();
//     closeModal();
//     // Refresh transaction history if it's visible
//     const transactionList = document.querySelector('.transaction-list');
//     if (transactionList.style.display === 'block') {
//         viewTransactionHistory();
//     }
// }

// function checkBalance() {
//     alert(`Your current balance is: ${formatIndianCurrency(currentBalance)}`);
// }

// function updateBalance() {
//     document.getElementById('currentBalance').textContent = formatIndianCurrency(currentBalance);
// }

// function viewTransactionHistory() {
//     const transactionList = document.querySelector('.transaction-list');
//     transactionList.style.display = 'block';
//     transactionList.innerHTML = '';

//     if (transactions.length === 0) {
//         transactionList.innerHTML = '<p class="transaction-item">No transactions found.</p>';
//         return;
//     }

//     // Sort transactions by timestamp in descending order
//     const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

//     sortedTransactions.forEach(transaction => {
//         const item = document.createElement('div');
//         item.className = 'transaction-item';
//         item.innerHTML = `
//             <div>
//                 <strong>${transaction.type}</strong>
//                 <div>${transaction.date}</div>
//             </div>
//             <div>${formatIndianCurrency(transaction.amount)}</div>
//         `;
//         transactionList.appendChild(item);
//     });
// }

// // Close modal when clicking outside
// window.onclick = function(event) {
//     const modal = document.getElementById('transactionModal');
//     if (event.target === modal) {
//         closeModal();
//     }
// }

// // Initialize balance display and load data when page loads
// loadUserData();


// Define default users and their initial data
const defaultUsers = {
    'customer123': {
        username: 'Meghana K S',
        accountNumber: '1234567890',
        password: 'password123',
        branchName: 'Kochi Branch',
        initialBalance: 1000000.00
    },
    'user456': {
        username: 'Jyotika K J',
        accountNumber: '0987654321',
        password: 'password456',
        branchName: 'Chennai Branch',
        initialBalance: 750000.00
    }
};

// Initialize system if not already done
function initializeSystem() {
    if (!localStorage.getItem('systemInitialized')) {
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        
        // Initialize data for each user
        Object.keys(defaultUsers).forEach(userId => {
            if (!localStorage.getItem(`transactions_${userId}`)) {
                localStorage.setItem(`transactions_${userId}`, '[]');
                localStorage.setItem(`balance_${userId}`, defaultUsers[userId].initialBalance.toString());
            }
        });
        
        localStorage.setItem('systemInitialized', 'true');
    }
}

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentUser = sessionStorage.getItem('customerID');
    
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    loadUserData();
    return true;
}

// Load user data from localStorage
function loadUserData() {
    const currentUser = sessionStorage.getItem('customerID');
    const users = JSON.parse(localStorage.getItem('users'));
    const userData = users[currentUser];
    
    if (userData) {
        // Update UI with user information
        document.getElementById('accountName').textContent = userData.username;
        document.getElementById('accountNumber').textContent = userData.accountNumber;
        document.getElementById('branchName').textContent = userData.branchName;
        
        // Load transactions and balance
        const storedTransactions = localStorage.getItem(`transactions_${currentUser}`);
        const storedBalance = localStorage.getItem(`balance_${currentUser}`);
        
        // Initialize or load transactions
        transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
        
        // Initialize or load balance
        currentBalance = storedBalance ? parseFloat(storedBalance) : userData.initialBalance;
        
        updateBalance();
    }
}

// Save user data to localStorage
function saveUserData() {
    const currentUser = sessionStorage.getItem('customerID');
    if (currentUser) {
        localStorage.setItem(`transactions_${currentUser}`, JSON.stringify(transactions));
        localStorage.setItem(`balance_${currentUser}`, currentBalance.toString());
    }
}

// Logout function
function logout() {
    saveUserData();
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Initialize variables
let transactions = [];
let currentBalance = 0;

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
    const currentUser = sessionStorage.getItem('customerID');

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }

    if (type === 'withdraw' && amount > currentBalance) {
        alert('Insufficient funds!');
        return;
    }

    const transaction = {
        type: type === 'withdraw' ? 'Withdrawal' : 'Deposit',
        amount: amount,
        date: new Date().toLocaleDateString('en-IN'),
        timestamp: new Date().getTime(),
        userId: currentUser
    };

    if (type === 'withdraw') {
        currentBalance -= amount;
    } else {
        currentBalance += amount;
    }

    transactions.unshift(transaction);
    saveUserData();
    updateBalance();
    closeModal();

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

// Initialize system and load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
    checkAuth();
});