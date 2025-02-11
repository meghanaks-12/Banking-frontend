document.getElementById("registrationForm").addEventListener("submit", async function(event) {
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

    try {
        // Send registration request to backend
        const response = await fetch('https://banking-system-pcji.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) { 
            // Show success message and redirect to login
            document.getElementById("message").style.color = "green";
            document.getElementById("message").innerText = "Registration Successful! Redirecting to login...";

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            // Handle registration error
            document.getElementById("message").style.color = "red";
            document.getElementById("message").innerText = result.message || "Registration failed";
        }
    } catch (error) {
        console.error('Registration error:', error);
        document.getElementById("message").style.color = "red";
        document.getElementById("message").innerText = "Network error. Please try again.";
    }
});