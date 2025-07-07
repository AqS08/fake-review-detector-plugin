// JS for login & signup AJAX (put in js/auth.js)

function showMessage(msg, type) {
    var toast = document.getElementById('messageToast');
    toast.textContent = msg;
    toast.className = "message-toast " + type;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2500);
}

function setButtonLoading(btn, loading) {
    if (!btn) return;
    var btnText = btn.querySelector('.btn-text');
    var btnSpinner = btn.querySelector('.btn-spinner');
    btn.disabled = loading;
    if (btnText && btnSpinner) {
        btnText.style.display = loading ? 'none' : 'inline';
        btnSpinner.style.display = loading ? 'inline' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // LOGIN
    var loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var email = document.getElementById('email').value.trim();
            var password = document.getElementById('password').value.trim();

            if (!email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            setButtonLoading(loginBtn, true);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8888/fake-review-detector-plugin/fake-review-detector-plugin/php/login.php", true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    setButtonLoading(loginBtn, false);
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (data.success) {
                            chrome.storage.local.set({
                                isLoggedIn: true,
                                userEmail: data.email,
                                userName: data.username,
                                userId: data.userId,
                                loginTime: new Date().toISOString(),
                                userPassword: password // <-- SAVE the real password here!
                            }, function() {
                                showMessage('Login successful!', 'success');
                                setTimeout(function() {
                                    window.location.href = 'profile.html';
                                }, 800);
                            });
                        } else {
                            showMessage(data.message || "Login failed", "error");
                        }
                    } catch(e) {
                        showMessage("Server error", "error");
                    }
                }
            };
            var formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            xhr.send(formData);
        });
    }

    // SIGNUP
    var signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var username = document.getElementById('signupName').value.trim();
            var email = document.getElementById('signupEmail').value.trim();
            var password = document.getElementById('signupPassword').value.trim();
            var confirmPassword = document.getElementById('confirmPassword').value.trim();

            if (!username || !email || !password || !confirmPassword) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            setButtonLoading(signupBtn, true);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8888/fake-review-detector-plugin/fake-review-detector-plugin/php/signup.php", true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    setButtonLoading(signupBtn, false);
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (data.success) {
                            chrome.storage.local.set({
                                isLoggedIn: true,
                                userEmail: email,
                                userName: username,
                                loginTime: new Date().toISOString(),
                                userPassword: password // <-- SAVE the real password here!
                            }, function() {
                                showMessage('Signup successful!', 'success');
                                setTimeout(function() {
                                    window.location.href = 'profile.html';
                                }, 800);
                            });
                        } else {
                            showMessage(data.message || "Signup failed", "error");
                        }
                    } catch(e) {
                        showMessage("Server error", "error");
                    }
                }
            };
            var formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            xhr.send(formData);
        });
    }
});
