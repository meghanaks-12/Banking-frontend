// Initialize variables
let transactions = [];
let currentBalance = 0;

// Check if user is logged in
async function checkAuth() {
    console.log("Checking Authentication...");
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    const customerID = localStorage.getItem('customerID');
    
    if (!isLoggedIn || !token || !customerID) {
        console.log('Missing auth credentials');
        window.location.href = 'index.html';
        return false;
    }

    try {
        // Verify token and load user data
        const response = await fetch('https://banking-system-pcji.onrender.com/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        console.log('Profile response status: ',response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Profile response error: ',errorData);
            throw new Error(errorData.message || 'Authentication failed');
        }

        const userData = await response.json();
        console.log('User data loaded: ',userData);

        if(!userData.fullname || !userData.accountNumber){
            throw new Error('Invalid user data received ');
        }

        await loadUserData(userData);
        await fetchTransactionHistory();
        return true;

    } catch (error) {
        console.error('Authentication error:', error);

        if(error.message === 'authentication failed' || error.message === 'Invalid use data received'){
            localStorage.clear();
            window.location.href = 'index.html';
        }
        return false;
    }
}

// Load user data
async function loadUserData(userData) {

    console.log("Loading user data: ",userData);
    try{
        // Update UI with user information
        document.getElementById('accountName').textContent = userData.fullname;
        document.getElementById('accountNumber').textContent = userData.accountNumber;
        document.getElementById('branchName').textContent = userData.branch;
    
        // Set current balance
        currentBalance = userData.balance;
        updateBalance();

    }catch(error){
        console.error('Error loading user data: ',error);
        throw error;
    }

    // Fetch transaction history
    // fetchTransactionHistory();
}

// Fetch transaction history
async function fetchTransactionHistory() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('https://banking-system-pcji.onrender.com/transactions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        transactions = await response.json();
        viewTransactionHistory();

    } catch (error) {
        console.error('Transaction history error:', error);
        const transactionList = document.querySelector('.transaction-list');
        if (transactionList) {
            transactionList.innerHTML = '<p class="transaction-item">Failed to load transactions. Please try again later.</p>';
        }
    }
}

// Handle deposit
async function handleDeposit(e) {
    e.preventDefault();
    const type = document.getElementById('transactionModal').dataset.type;
    const amount = parseFloat(document.getElementById('amount').value);
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('customerID');

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }

    try { 
        const response = await fetch('https://banking-system-pcji.onrender.com/deposit', { //deposit
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                amount: amount
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Deposit failed');
        }

        const result = await response.json();

        const transaction = {
            type: type === 'withdraw' ? 'Withdrawal' : 'Deposit',
            amount: amount,
            date: new Date().toLocaleDateString('en-IN'),
            timestamp: new Date().getTime(),
            userId: currentUser
        };
        
         currentBalance = result.balance; // Use balance from server response
         updateBalance();
         
         // Save updated user data
         saveUserData();
         
         closeModal();
         alert('Deposit successful! ');

         // Update transaction list if visible
        const transactionList = document.querySelector('.transaction-list');
        if (transactionList && transactionList.style.display === 'block') {
            viewTransactionHistory();
        }

        // Refresh transaction history
        await fetchTransactionHistory();

    } catch (error) {
        console.error('Deposit error:', error);
        alert(error.message || 'Deposit failed. Please try again.');

        // Revert any local changes on error
        await fetchTransactionHistory(); // Refresh from server to ensure accuracy
    }
}


//handle withdraw
async function handleWithdraw(e) {
    e.preventDefault();
    const type = document.getElementById('transactionModal').dataset.type;
    const amount = parseFloat(document.getElementById('amount').value);
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('customerID');

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount!');
        return;
    }

    if (amount > currentBalance) {
        alert('Insufficient funds!');
        return;
    }

    try {  
        const response = await fetch('https://banking-system-pcji.onrender.com/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                amount: amount
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Withdrawal failed');
        }

        const result = await response.json();

        const transaction = {
            type: type === 'withdraw' ? 'Withdrawal' : 'Deposit',
            amount: amount,
            date: new Date().toLocaleDateString('en-IN'),
            timestamp: new Date().getTime(),
            userId: currentUser
        };

         currentBalance = result.balance; // Use balance from server response
         updateBalance();
         
         // Save updated user data
         saveUserData();

        //  openModal();
         closeModal();
         alert('Withdrawal successful! ');

         // Update transaction list if visible
        const transactionList = document.querySelector('.transaction-list');
        if (transactionList && transactionList.style.display === 'block') {
            viewTransactionHistory();
        }

        // Refresh transaction history
        await fetchTransactionHistory();

    } catch (error) {
        console.error('Transaction error:', error);
        alert(error.message || 'Withdrawal failed. Please try again.');

        // Revert any local changes on error
        await fetchTransactionHistory(); // Refresh from server to ensure accuracy
    }
}

// Logout function
// function logout() {
//     localStorage.clear();
//     window.location.href = 'index.html';
// }

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

    if(type === 'deposit'){
        form.onsubmit = handleDeposit;
    }else if (type === 'withdraw'){
        form.onsubmit = handleWithdraw;
    }

}

function closeModal() {
    document.getElementById('transactionModal').style.display = 'none';
    document.getElementById('amount').value = '';
}

function checkBalance() {
    alert(`Your current balance is: ${formatIndianCurrency(currentBalance)}`);
}

function updateBalance() {
    document.getElementById('currentBalance').textContent = formatIndianCurrency(currentBalance);
}

function saveUserData() {
    try {
        // Save current balance and transactions to localStorage
        localStorage.setItem('currentBalance', currentBalance);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
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

// Initialize system when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Dashboard initializing...');
    console.log('Local storage contents:', {
        isLoggedIn: localStorage.getItem('isLoggedIn'),
        token: localStorage.getItem('token'),
        customerID: localStorage.getItem('customerID')
    });
    
    try {
        const authSuccess = await checkAuth();
        if (!authSuccess) {
            console.error('Authentication failed during initialization');
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

