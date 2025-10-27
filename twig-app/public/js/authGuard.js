// public/js/authGuard.js
(function() {
    console.log("Auth Guard Running...");
    const sessionToken = localStorage.getItem('ticketapp_session');
    const user = localStorage.getItem('ticketapp_user'); // Also check if user exists

    // If no token OR no user data, redirect to login
    if (!sessionToken || !user) {
        console.log("No session token or user found. Redirecting to login.");
        // Use replace to prevent user from clicking "back" to the protected page
        window.location.replace('/auth/login');

        // Show a toast message if Toastify is available
        if (typeof Toastify === 'function') {
             Toastify({
                text: "Your session has expired — please log in again.",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
            }).showToast();
        } else {
            // Fallback alert if Toastify hasn't loaded yet (less likely but possible)
            alert("Your session has expired — please log in again.");
        }
    } else {
        console.log("Session token found. Access granted.");
        // Optional: You could parse the user here and maybe store it globally if needed
        // window.currentUser = JSON.parse(user);
    }
})(); // Immediately Invoked Function Expression (IIFE) to run immediately