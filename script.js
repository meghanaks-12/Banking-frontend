const btn = document.getElementById('login');

// Get form elements
const loginForm = document.getElementById('loginForm');
const customerIDInput = document.getElementById('customerID');
const passwordInput = document.getElementById('password');
const loginButton = document.querySelector('.login-button');

// Function to show error   
function showError(inputElement, message) {
    const formGroup = inputElement.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    inputElement.style.borderColor = '#dc3545';
}

// Function to hide error
function hideError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    errorDiv.style.display = 'none';
    inputElement.style.borderColor = '#ddd';
}

// Validate Customer ID
customerIDInput.addEventListener('input', function() {
    if (this.value.length < 6) {
        showError(this, 'Customer ID must be at least 6 characters');
    } else {
        hideError(this);
    }
});

// Validate Password
passwordInput.addEventListener('input', function() {
    if (this.value.length < 8) {
        showError(this, 'Password must be at least 8 characters');
    } else {
        hideError(this);
    }
});

// Handle form submission
btn.addEventListener('click', async function(e) {
    e.preventDefault();
    console.log('Login button clicked');  // Debug: Check if the event fires


    // Basic validation
    let isValid = true;

    if (customerIDInput.value.length < 6) {
        showError(customerIDInput, 'Customer ID must be at least 6 characters');
        isValid = false;
    }

    if (passwordInput.value.length < 8) {
        showError(passwordInput, 'Password must be at least 8 characters');
        isValid = false;
    }

    if (isValid) {
        // Show loading state
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...'; //TO RECHECK
        

        try {
            console.log('Sending request...'); // Debug: Ensure request is sent

            // Send login request to backend
            const response = await fetch('https://banking-system-pcji.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: customerIDInput.value,
                    password: passwordInput.value
                })
            });
            console.log('Response received:', response); // Debug: Log full response


            const result = await response.json(); // FIX: Read JSON only once
            console.log('result', result);

            if (response.ok) {
                console.log('Login successful, token:', result.token);


                // Store login state and token
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('customerID', customerIDInput.value);
                localStorage.setItem('token', result.token);

                // Redirect to dashboard
                console.log("Redirecting to dashboard");
                window.location.assign('dashboard.html');
            } else {
                showError(customerIDInput, result.message || 'Invalid credentials');
                showError(passwordInput, result.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError(customerIDInput, 'Network error. Please try again.');
            showError(passwordInput, 'Network error. Please try again.');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Login Securely';
            console.log('Response Status:', response.status);

        }
    }
});

// Add password visibility toggle
const togglePassword = document.createElement('button');
togglePassword.type = 'button';
togglePassword.innerHTML = 'Show';
togglePassword.style.position = 'absolute';
togglePassword.style.right = '10px';
togglePassword.style.top = '50%';
togglePassword.style.transform = 'translateY(-50%)';
togglePassword.style.border = 'none';
togglePassword.style.background = 'none';
togglePassword.style.cursor = 'pointer';

// Add container for password input
const passwordContainer = document.createElement('div');
passwordContainer.style.position = 'relative';
passwordInput.parentNode.insertBefore(passwordContainer, passwordInput);
passwordContainer.appendChild(passwordInput);
passwordContainer.appendChild(togglePassword);

// Toggle password visibility
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.innerHTML = type === 'password' ? 'Show' : 'Hide';
});
