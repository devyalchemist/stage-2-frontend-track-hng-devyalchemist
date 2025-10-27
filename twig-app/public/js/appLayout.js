// public/js/appLayout.js
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('app-sidebar');
    const toggleButton = document.getElementById('sidebar-toggle-button');
    const mainContent = document.getElementById('main-content'); // Get main content area
    const navLinks = document.querySelectorAll('.nav-link');
    const linkTexts = document.querySelectorAll('.link-text');
    const iconOpen = toggleButton?.querySelector('.icon-open');
    const iconClosed = toggleButton?.querySelector('.icon-closed');

    // Header elements (populated after auth check)
    const welcomeMsg = document.getElementById('header-welcome-message');
    const userInitial = document.getElementById('header-user-initial');
    const logoutButton = document.getElementById('logout-button');

    let isSidebarOpen = false; // Initial state

    function updateSidebarState() {
        if (sidebar) {
            sidebar.dataset.open = isSidebarOpen; // Toggle data attribute
        }
        navLinks.forEach(link => link.dataset.open = isSidebarOpen);
        linkTexts.forEach(text => text.dataset.open = isSidebarOpen);

        // Toggle button icons
        if (iconOpen && iconClosed) {
            iconOpen.classList.toggle('hidden', !isSidebarOpen);
            iconClosed.classList.toggle('hidden', isSidebarOpen);
        }

        // --- Mobile Content Hiding Logic (from AppLayout.jsx) ---
        // Add/remove a class or style to hide main content on small screens when open
        if (mainContent) {
            if (isSidebarOpen && window.innerWidth < 640) { // Check screen width (sm breakpoint)
                 mainContent.classList.add('hidden', 'sm:block'); // Hide on mobile, show on sm+
            } else {
                 mainContent.classList.remove('hidden'); // Ensure visible otherwise
                 // We don't need sm:block always, just remove hidden
            }
        }
    }

    // --- Event Listener for Toggle Button ---
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            isSidebarOpen = !isSidebarOpen;
            updateSidebarState();
        });
    }

    // --- Update Header & Add Logout Listener ---
    // This assumes authGuard.js runs first
    const userString = localStorage.getItem('ticketapp_user');
    if (userString) {
        try {
            const user = JSON.parse(userString);
            if (welcomeMsg) {
                welcomeMsg.textContent = `Welcome, ${user.name || 'User'}!`;
            }
            if (userInitial && user.name) {
                userInitial.textContent = user.name[0].toUpperCase();
            }
        } catch (e) { console.error("Error parsing user for header:", e); }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('ticketapp_session');
            localStorage.removeItem('ticketapp_user');
            Toastify({ text: "Logged out.", duration: 2000 }).showToast();
            window.location.replace('/auth/login'); // Use replace
        });
    }

    // --- Responsive Handling ---
     // Update content visibility on resize if sidebar state matters
     window.addEventListener('resize', () => {
         // Re-apply mobile content hiding logic based on current state and new width
         if (mainContent) {
             if (isSidebarOpen && window.innerWidth < 640) {
                 mainContent.classList.add('hidden', 'sm:block');
             } else {
                 mainContent.classList.remove('hidden');
             }
         }
     });

    // --- Initial State Update ---
    // Set initial state based on default (closed)
    updateSidebarState();
}); 