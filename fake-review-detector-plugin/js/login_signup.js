// Demo user accounts for testing
const DEMO_USERS = {
    'demo@analyzer.com': { password: 'demo123', name: 'Demo User' },
    'admin@hotel.com': { password: 'admin123', name: 'Hotel Admin' },
    'user@test.com': { password: 'user123', name: 'Test User' }
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    setupLoginEventListeners();
});

// Setup event listeners for login/signup forms
function setupLoginEventListeners() {
    // Get form elements
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Add form submit listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    if (signupBtn) {
        signupBtn.addEventListener('click', handleSignup);
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');

    if (!emailInput || !passwordInput) {
        showMessage('Login form elements not found', 'error');
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email', 'error');
        return;
    }

    setButtonLoading(loginBtn, true);

    setTimeout(() => {
        if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
            chrome.storage.local.set({
                isLoggedIn: true,
                userEmail: email,
                userName: DEMO_USERS[email].name,
                loginTime: new Date().toISOString()
            }, () => {
                showMessage('Login successful!', 'success');
                setTimeout(() => {
                    if (typeof showDashboard === 'function') {
                        showDashboard(DEMO_USERS[email].name);
                    }
                }, 800);
            });
        } else {
            showMessage('Invalid credentials', 'error');
            setButtonLoading(loginBtn, false);
        }
    }, 1200);
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const signupBtn = document.getElementById('signupBtn');

    if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        showMessage('Signup form elements not found', 'error');
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!name || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    if (!isValidEmail(email)) {
        showMessage('Invalid email', 'error');
        return;
    }
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    if (DEMO_USERS[email]) {
        showMessage('Account with this email already exists', 'error');
        return;
    }

    setButtonLoading(signupBtn, true);

    setTimeout(() => {
        DEMO_USERS[email] = { password: password, name: name };
        chrome.storage.local.set({
            isLoggedIn: true,
            userEmail: email,
            userName: name,
            loginTime: new Date().toISOString()
        }, () => {
            showMessage('Account created!', 'success');
            setTimeout(() => {
                if (typeof showDashboard === 'function') {
                    showDashboard(name);
                }
            }, 800);
        });
    }, 1500);
}