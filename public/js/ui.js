const UI = {
    showLoading: (elementId) => {
        const el = document.getElementById(elementId);
        if (el) el.innerHTML = '<div class="loading-spinner">Loading...</div>';
    },

    showError: (elementId, message) => {
        const el = document.getElementById(elementId);
        if (el) el.innerHTML = `<div class="error-state">⚠️ ${message}</div>`;
    },

    showEmpty: (elementId, message) => {
        const el = document.getElementById(elementId);
        if (el) el.innerHTML = `<div class="empty-state">Unable to find any results. ${message}</div>`;
    },

    updateNav: () => {
        const nav = document.getElementById('nav-links');
        if (!nav) return;

        if (api.isAuthenticated()) {
            const user = api.getCurrentUser();
            let dashboardLink = '#';
            // Correct path resolution depending on where we are
            // Assuming we prefer absolute paths from root or consistent relative
            // For now, simple logic assuming /pages structure or similar
            // Ideally we use root-relative paths like '/pages/...'

            if (user.role === 'user') dashboardLink = '/pages/user/dashboard.html';
            else if (user.role === 'trainer') dashboardLink = '/pages/trainer/dashboard.html';
            else if (user.role === 'gymOwner') dashboardLink = '/pages/owner/dashboard.html';

            nav.innerHTML = `
                <li><a href="${dashboardLink}">Dashboard</a></li>
                <li><a href="#" onclick="api.logout()">Logout</a></li>
            `;
        } else {
            nav.innerHTML = `
                <li><a href="/pages/auth/login.html">Login</a></li>
                <li><a href="/pages/auth/register.html">Register</a></li>
            `;
        }
    }
};

// Auto-run nav update on load if nav exists
document.addEventListener('DOMContentLoaded', UI.updateNav);
