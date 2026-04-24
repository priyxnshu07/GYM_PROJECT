const UI = {
    showLoading: (elementId) => {
        const el = document.getElementById(elementId);
        if (el) el.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 20px;">
                <svg class="svg-bodybuilder" style="max-width: 120px; filter: drop-shadow(0 10px 30px rgba(204, 255, 0, 0.15));" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="glowPulse" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="rgba(204, 255, 0, 0.4)" />
                            <stop offset="100%" stop-color="transparent" />
                        </radialGradient>
                    </defs>
                    <circle cx="150" cy="150" r="100" fill="url(#glowPulse)" />
                    <!-- Torso -->
                    <path d="M100,120 Q150,130 200,120 L170,260 L130,260 Z" fill="#fff" />
                    <circle cx="150" cy="80" r="18" fill="#fff" />
                    <!-- Shoulders -->
                    <path d="M85,135 L215,135" stroke="#fff" stroke-width="32" stroke-linecap="round" />
                    <!-- Massive Upper arms -->
                    <path d="M95,125 Q55,150 75,170" stroke="#fff" stroke-width="26" stroke-linecap="round" fill="none" />
                    <path d="M205,125 Q245,150 225,170" stroke="#fff" stroke-width="26" stroke-linecap="round" fill="none" />
                    <!-- Left Curl -->
                    <g class="curl-left">
                        <path d="M75,170 Q50,200 70,220" stroke="#fff" stroke-width="20" stroke-linecap="round" fill="none"/>
                        <rect x="50" y="215" width="40" height="10" fill="#fff" rx="4" />
                        <rect x="80" y="195" width="15" height="50" fill="#CCFF00" rx="4" />
                        <rect x="45" y="195" width="15" height="50" fill="#CCFF00" rx="4" />
                        <rect x="35" y="205" width="10" height="30" fill="#9acd32" rx="2" />
                    </g>
                    <!-- Right Curl -->
                    <g class="curl-right">
                        <path d="M225,170 Q250,200 230,220" stroke="#fff" stroke-width="20" stroke-linecap="round" fill="none"/>
                        <rect x="210" y="215" width="40" height="10" fill="#fff" rx="4" />
                        <rect x="205" y="195" width="15" height="50" fill="#CCFF00" rx="4" />
                        <rect x="240" y="195" width="15" height="50" fill="#CCFF00" rx="4" />
                        <rect x="255" y="205" width="10" height="30" fill="#9acd32" rx="2" />
                    </g>
                </svg>
                <div class="loading-spinner" style="margin-top: 15px;">Loading...</div>
            </div>`;
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
