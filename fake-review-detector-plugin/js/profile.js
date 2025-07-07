// Profile page JavaScript functionality

// DOM elements
const profileScreen = document.getElementById('profileScreen');
const profileUsername = document.getElementById('profileUsername');
const profileEmail = document.getElementById('profileEmail');
const profilePassword = document.getElementById('profilePassword');
const profileLogoutBtn = document.getElementById('profileLogoutBtn');
const messageToast = document.getElementById('messageToast');

// Navigation elements
const analysisTabProfile = document.getElementById('analysisTabProfile');
const historyTabProfile = document.getElementById('historyTabProfile');
const profileTabProfile = document.getElementById('profileTabProfile');

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    setupProfileEventListeners();
});

// Setup event listeners
function setupProfileEventListeners() {
    // Logout button
    profileLogoutBtn?.addEventListener('click', handleProfileLogout);
    
    // Navigation tabs
    analysisTabProfile?.addEventListener('click', () => navigateToTab('analysis'));
    historyTabProfile?.addEventListener('click', () => navigateToTab('history'));
    profileTabProfile?.addEventListener('click', () => navigateToTab('profile'));
    
    // Add hover effects to input fields
    const profileFields = document.querySelectorAll('.profile-field');
    profileFields.forEach(field => {
        field.addEventListener('mouseenter', () => {
            field.style.transform = 'translateY(-2px)';
        });
        
        field.addEventListener('mouseleave', () => {
            field.style.transform = 'translateY(0)';
        });
    });
}

// Load user profile data
function loadUserProfile() {
    chrome.storage.local.get(['userName', 'userEmail', 'isLoggedIn'], function(result) {
        if (result.isLoggedIn) {
            // Populate profile fields with user data
            if (profileUsername) {
                profileUsername.value = result.userName || 'User';
            }
            if (profileEmail) {
                profileEmail.value = result.userEmail || 'user@example.com';
            }
            if (profilePassword) {
                profilePassword.value = '••••••••'; // Masked password
            }
            
            // Update greeting
            const greeting = document.querySelector('.profile-greeting');
            if (greeting) {
                greeting.textContent = `Hello, ${result.userName || 'User'}!`;
            }
        } else {
            // If not logged in, redirect to login
            showMessage('Please log in to view profile', 'error');
            setTimeout(() => {
                navigateToTab('login');
            }, 1500);
        }
    });
}

// Handle logout
function handleProfileLogout() {
    // Add loading state to button
    profileLogoutBtn.disabled = true;
    profileLogoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    
    // Simulate logout process
    setTimeout(() => {
        chrome.storage.local.remove(['isLoggedIn', 'userName', 'userEmail', 'loginTime', 'analysisHistory'], function() {
            showMessage('You have been logged out successfully', 'success');
            setTimeout(() => {
                // Navigate back to main popup
                window.close(); // Close current popup
                chrome.action.openPopup(); // Open main popup
            }, 1000);
        });
    }, 1200);
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
            showMessage('History feature coming soon!', 'info');
            break;
        case 'profile':
            // Already on profile page
            showMessage('You are already on the profile page', 'info');
            break;
        case 'login':
            // Navigate to login
            window.location.href = 'forms.html';
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

// Add some interactive effects
function addInteractiveEffects() {
    // Add ripple effect to logout button
    profileLogoutBtn?.addEventListener('click', function(e) {
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
}

// Initialize interactive effects
document.addEventListener('DOMContentLoaded', addInteractiveEffects);

// Add some CSS for ripple effect
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
`;
document.head.appendChild(style);