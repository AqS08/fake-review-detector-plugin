// Profile page JavaScript functionality with password toggle

// DOM elements
const profileScreen = document.getElementById('profileScreen');
const profileUsername = document.getElementById('profileUsername');
const profileEmail = document.getElementById('profileEmail');
const profilePassword = document.getElementById('profilePassword');
const profileLogoutBtn = document.getElementById('profileLogoutBtn');
const messageToast = document.getElementById('messageToast');
const passwordToggle = document.getElementById('passwordToggle');
const passwordToggleIcon = document.getElementById('passwordToggleIcon');

// Navigation elements
const analysisTabProfile = document.getElementById('analysisTabProfile');
const historyTabProfile = document.getElementById('historyTabProfile');
const profileTabProfile = document.getElementById('profileTabProfile');

// Password visibility state
let isPasswordVisible = false;
let actualPassword = 'demo123'; // This will be loaded from storage

document.addEventListener('DOMContentLoaded', function() {
    ensureLoggedIn(function(isLoggedIn, data) {
        if (isLoggedIn) {
            // User is now "logged in", proceed as usual
            loadUserProfile(); // or your logic here
            setupProfileEventListeners();
            addInteractiveEffects();
        } else {
            window.location.href = 'popup.html'; // or your login page
        }
    });
});

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    setupProfileEventListeners();
    addInteractiveEffects();
});

// Setup event listeners
function setupProfileEventListeners() {
    // Logout button
    profileLogoutBtn?.addEventListener('click', handleProfileLogout);
    
    // Password toggle functionality
    passwordToggle?.addEventListener('click', togglePasswordVisibility);
    
    // Add keyboard support for password toggle
    passwordToggle?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePasswordVisibility();
        }
    });
    
    // Make password toggle focusable
    if (passwordToggle) {
        passwordToggle.setAttribute('tabindex', '0');
        passwordToggle.setAttribute('role', 'button');
        passwordToggle.setAttribute('aria-label', 'Toggle password visibility');
    }
    
    // Navigation tabs
    analysisTabProfile?.addEventListener('click', () => navigateToTab('analysis'));
    historyTabProfile?.addEventListener('click', () => navigateToTab('history'));
    profileTabProfile?.addEventListener('click', () => navigateToTab('profile'));
    
    // Add hover effects to input fields
    const profileFields = document.querySelectorAll('.form-field');
    profileFields.forEach(field => {
        field.addEventListener('mouseenter', () => {
            if (!field.classList.contains('password-field')) {
                field.style.transform = 'translateY(-1px)';
            }
        });
        
        field.addEventListener('mouseleave', () => {
            if (!field.classList.contains('password-field')) {
                field.style.transform = 'translateY(0)';
            }
        });
    });
}

// Toggle password visibility
function togglePasswordVisibility() {
    if (!profilePassword || !passwordToggleIcon) return;
    
    // Add animation class
    passwordToggle.classList.add('password-toggle-animate');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        passwordToggle?.classList.remove('password-toggle-animate');
    }, 300);
    
    if (isPasswordVisible) {
        // Hide password
        profilePassword.type = 'password';
        profilePassword.value = '••••••••';
        passwordToggleIcon.className = 'fas fa-eye';
        passwordToggle.setAttribute('aria-label', 'Show password');
        isPasswordVisible = false;
        
        // Show message
        showMessage('Password hidden', 'info');
    } else {
        // Show password
        profilePassword.type = 'text';
        profilePassword.value = actualPassword;
        passwordToggleIcon.className = 'fas fa-eye-slash';
        passwordToggle.setAttribute('aria-label', 'Hide password');
        isPasswordVisible = true;
        
        // Show message
        showMessage('Password revealed', 'info');
    }
}

function loadUserProfile() {
    $.ajax({
        url: 'http://127.0.0.1:8888/fake-review-detector-plugin/fake-review-detector-plugin/php/get_profile.php',
        method: 'GET',
        xhrFields: { withCredentials: true },
        success: function(data) {
            if (data.success) {
                if (profileUsername) profileUsername.value = data.username || '';
                if (profileEmail) profileEmail.value = data.email || '';
                if (profilePassword) {
                    actualPassword = data.password;
                    profilePassword.value = '••••••••';
                    profilePassword.type = 'password';
                }
                const profileUserName = document.getElementById('profileUserName');
                if (profileUserName) profileUserName.textContent = data.username || '';
                isPasswordVisible = false;
                if (passwordToggleIcon) passwordToggleIcon.className = 'fas fa-eye';
            } else {
                showMessage('Please log in to view profile', 'error');
                setTimeout(() => { window.location.href = 'popup.html'; }, 1500);
            }
        },
        error: function() {
            showMessage('Server error', 'error');
        }
    });
}

// Handle logout
function handleProfileLogout() {
    if (profileLogoutBtn) {
        profileLogoutBtn.disabled = true;
        profileLogoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    }

    // Call logout.php to destroy the session
    $.ajax({
        url: 'http://127.0.0.1:8888/fake-review-detector-plugin/fake-review-detector-plugin/php/logout.php',
        method: 'POST',
        xhrFields: { withCredentials: true },
        complete: function() {
            // Clear local storage too, then redirect
            chrome.storage.local.clear(function() {
                showMessage('You have been logged out successfully', 'success');
                setTimeout(() => {
                    window.location.href = 'popup.html';
                }, 1000);
            });
        }
    });

    chrome.storage.local.clear(); // on logout
}

// Navigate to different tabs/pages
function navigateToTab(tabName) {
    switch(tabName) {
        case 'analysis':
            // Navigate back to main popup (analysis tab)
            window.location.href = 'popup.html';
            break;
        case 'history':
            // Navigate to history (you can create history.html later)
            //showMessage('History feature coming soon!', 'info');
            window.location.href = 'history.html';
            break;
        case 'profile':
            // Already on profile page
            showMessage('You are already on the profile page', 'info');
            break;
        case 'login':
            // Navigate to login
            window.location.href = 'popup.html';
            break;
        default:
            showMessage('Navigation not available', 'error');
    }
}

// Show messages
function showMessage(text, type) {
    if (!messageToast) return;
    
    messageToast.textContent = text;
    messageToast.className = `message-toast ${type}`;
    messageToast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        messageToast.classList.remove('show');
    }, 3000);
}

// Add interactive effects
function addInteractiveEffects() {
    // Add ripple effect to logout button
    profileLogoutBtn?.addEventListener('click', function(e) {
        if (this.disabled) return; // Don't add ripple if button is disabled
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    // Add hover effect to password toggle
    passwordToggle?.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-50%) scale(1.1)';
    });
    
    passwordToggle?.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(-50%) scale(1)';
    });
}

// Add CSS for ripple effect and enhanced styling
const style = document.createElement('style');
style.textContent = `
    .logout-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple-animation 0.6s ease-out;
    }
    
    @keyframes ripple-animation {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(1);
            opacity: 0;
        }
    }
    
    /* Enhanced password toggle styling */
    .password-field {
        position: relative;
    }

    .password-toggle {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #666;
        transition: all 0.3s ease;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        z-index: 10;
    }

    .password-toggle:hover {
        color: #333;
        background-color: rgba(0, 0, 0, 0.05);
        transform: translateY(-50%) scale(1.05);
    }

    .password-toggle:active {
        transform: translateY(-50%) scale(0.95);
    }

    .password-toggle i {
        font-size: 14px;
        transition: all 0.2s ease;
    }

    .password-field input {
        padding-right: 50px !important;
    }

    .password-toggle-animate {
        animation: toggleBounce 0.3s ease;
    }

    @keyframes toggleBounce {
        0% { transform: translateY(-50%) scale(1); }
        50% { transform: translateY(-50%) scale(1.2); }
        100% { transform: translateY(-50%) scale(1); }
    }

    .password-toggle:focus {
        outline: 2px solid #667eea;
        outline-offset: 2px;
        border-radius: 4px;
    }
    
    /* Security indicator when password is visible */
    .password-field.password-visible::after {
        content: "⚠️";
        position: absolute;
        right: 50px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        color: #ffc107;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

/* 
    "host_permissions": [
        "http://localhost/*",
        "http://127.0.0.1/*",
        "https://l27.0.0.1:8888/*",
        "http://localhost:8888/*"
    ],

*/