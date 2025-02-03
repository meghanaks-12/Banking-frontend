document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get input values
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const userId = document.getElementById("userId").value.trim();
    const accountNumber = document.getElementById("accountNumber").value.trim();
    const branch = document.getElementById("branch").value;
    const balance = document.getElementById("balance").value.trim();

    // Basic validation
    if (!fullname || !email || !password || !userId) {
        document.getElementById("message").innerText = "Please fill all required fields.";
        return;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = existingUsers.some(user => user.userId === userId || user.email === email);

    if (userExists) {
        document.getElementById("message").innerText = "User ID or Email already exists!";
        return;
    }

    // Create user data object
    const userData = {
        fullname,
        email,
        password,
        phoneNumber,
        userId,
        accountNumber,
        branch,
        balance: balance ? Number(balance) : 0
    };

    // Add new user to registered users
    existingUsers.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    // Show success message and redirect to login
    document.getElementById("message").style.color = "green";
    document.getElementById("message").innerText = "Registration Successful! Redirecting to login...";

    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
});