// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const customerIDInput = document.getElementById('customerID');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login-button');

     // Sample user credentials (in real application, this would be handled by a backend)
     const validCredentials = {
        'customer123': 'password123',
        'user456': 'password456'
    };
    
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

        // Function to authenticate user
        function authenticateUser(customerID, password) {
            // In a real application, this would make an API call to your backend
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (validCredentials[customerID] === password) {
                        resolve(true);
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                }, 1000); // Simulate network delay
            });
        }

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

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
            loginButton.textContent = 'Logging in...';

            try {
                // Attempt to authenticate
                await authenticateUser(customerIDInput.value, passwordInput.value);
                
                // Store login state
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('customerID', customerIDInput.value);

                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } catch (error) {
                showError(customerIDInput, 'Invalid credentials');
                showError(passwordInput, 'Invalid credentials');
                loginButton.disabled = false;
                loginButton.textContent = 'Login Securely';
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
});

