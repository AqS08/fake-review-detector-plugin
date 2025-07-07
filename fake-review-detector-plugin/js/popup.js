//popup.js for popup.html
const SAMPLE_HOTELS = [
    { name: "Grand Palace Hotel", genuine: 72, fake: 28 },
    { name: "Oceanview Resort", genuine: 85, fake: 15 },
    { name: "City Center Inn", genuine: 45, fake: 55 },
    { name: "Mountain Lodge", genuine: 91, fake: 9 },
    { name: "Beach Paradise", genuine: 38, fake: 62 },
    { name: "Sunset Villa", genuine: 67, fake: 33 },
    { name: "Royal Gardens Hotel", genuine: 89, fake: 11 },
    { name: "Downtown Express", genuine: 42, fake: 58 },
    { name: "Coastal Breeze Resort", genuine: 76, fake: 24 },
    { name: "Alpine Retreat", genuine: 93, fake: 7 }
];

// DOM elements
const landingScreen = document.getElementById('landingScreen');
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const messageToast = document.getElementById('messageToast');

// Landing screen elements
const loginBtnLanding = document.getElementById('loginBtnLanding');
const hotelNameLanding = document.getElementById('hotelNameLanding');
const pieChartLanding = document.getElementById('pieChartLanding');
const percentageTextLanding = document.getElementById('percentageTextLanding');
const genuinePercentageLanding = document.getElementById('genuinePercentageLanding');
const fakePercentageLanding = document.getElementById('fakePercentageLanding');
const displayResultBtnLanding = document.getElementById('displayResultBtnLanding');
const historyTabLanding = document.getElementById('historyTabLanding');
const profileTabLanding = document.getElementById('profileTabLanding');

// Dashboard elements
const welcomeUser = document.getElementById('welcomeUser');
const logoutBtn = document.getElementById('logoutBtn');
const hotelName = document.getElementById('hotelName');
const pieChart = document.getElementById('pieChart');
const percentageText = document.getElementById('percentageText');
const genuinePercentage = document.getElementById('genuinePercentage');
const fakePercentage = document.getElementById('fakePercentage');
const displayResultBtn = document.getElementById('displayResultBtn');

// Login elements
const backBtn = document.getElementById('backBtn');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Navigation
const analysisTab = document.getElementById('analysisTab');
const historyTab = document.getElementById('historyTab');
const profileTab = document.getElementById('profileTab');

// Current hotel data
let currentHotel = SAMPLE_HOTELS[0];

// Initialize the popup
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupEventListeners();
    loadRandomHotelLanding();
});

// Check if user is already logged in
function checkLoginStatus() {
    chrome.storage.local.get(['isLoggedIn', 'userName', 'userEmail'], function(result) {
        if (result.isLoggedIn) {
            showDashboard(result.userName || result.userEmail);
        } else {
            showLandingScreen();
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Landing screen listeners
    loginBtnLanding?.addEventListener('click', showLoginScreen);
    displayResultBtnLanding?.addEventListener('click', displayResultLanding);
    historyTabLanding?.addEventListener('click', () => {
        chrome.storage.local.get(['isLoggedIn'], function(result) {
            if (result.isLoggedIn) {
                // Show history view within popup
                switchTab('history');
            } else {
                showLoginRequiredMessage();
            }
        });
    });
    profileTabLanding?.addEventListener('click', () => {
        chrome.storage.local.get(['isLoggedIn'], function(result) {
            if (result.isLoggedIn) {
                // Navigate within popup, not new tab
                window.location.href = 'profile.html';
            } else {
                showLoginRequiredMessage();
            }
        });
    });

    // Login screen listeners
    backBtn?.addEventListener('click', showLandingScreen);
    loginTab?.addEventListener('click', switchToLogin);
    signupTab?.addEventListener('click', switchToSignup);

    // Dashboard listeners
    logoutBtn?.addEventListener('click', handleLogout);
    displayResultBtn?.addEventListener('click', displayResult); // Opens new tab for results
    analysisTab?.addEventListener('click', () => switchTab('analysis'));
    historyTab?.addEventListener('click', () => switchTab('history'));
    profileTab?.addEventListener('click', () => switchTab('profile')); // Stays in popup
}

// Show landing screen
function showLandingScreen() {
    landingScreen.style.display = 'block';
    loginScreen.style.display = 'none';
    dashboardScreen.style.display = 'none';
    landingScreen.classList.add('fade-in');
    loadRandomHotelLanding();
}

// Show login screen
function showLoginScreen() {
    landingScreen.style.display = 'none';
    loginScreen.style.display = 'block';
    dashboardScreen.style.display = 'none';
    loginScreen.classList.add('fade-in');
    
    // Prefill demo credentials and focus
    setTimeout(() => {
        prefillDemoCredentials();
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.focus();
    }, 100);
}

// Show dashboard
function showDashboard(userName) {
    landingScreen.style.display = 'none';
    loginScreen.style.display = 'none';
    dashboardScreen.style.display = 'block';
    dashboardScreen.classList.add('fade-in');
    if (welcomeUser) {
        welcomeUser.textContent = `Welcome back, ${userName}!`;
    }
    loadRandomHotel();
}

// Switch to login tab
function switchToLogin() {
    loginTab?.classList.add('active');
    signupTab?.classList.remove('active');
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
}

// Switch to signup tab
function switchToSignup() {
    signupTab?.classList.add('active');
    loginTab?.classList.remove('active');
    if (signupForm) signupForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
    const signupNameInput = document.getElementById('signupName');
    if (signupNameInput) signupNameInput.focus();
}

// Load a random hotel for landing
function loadRandomHotelLanding() {
    const randomIndex = Math.floor(Math.random() * SAMPLE_HOTELS.length);
    currentHotel = SAMPLE_HOTELS[randomIndex];
    updateDisplayLanding();
}

// Update landing display
function updateDisplayLanding() {
    if (hotelNameLanding) hotelNameLanding.textContent = currentHotel.name;
    updatePieChartLanding(currentHotel.genuine);
    if (percentageTextLanding) percentageTextLanding.textContent = `${currentHotel.genuine}%`;
    if (genuinePercentageLanding) genuinePercentageLanding.textContent = `${currentHotel.genuine}%`;
    if (fakePercentageLanding) fakePercentageLanding.textContent = `${currentHotel.fake}%`;
}

// Update pie chart on landing
function updatePieChartLanding(genuinePercent) {
    if (!pieChartLanding) return;
    const genuineDegrees = (genuinePercent / 100) * 360;
    const gradient = `conic-gradient(
        #28a745 0deg ${genuineDegrees}deg,
        #e9ecef ${genuineDegrees}deg 360deg
    )`;
    pieChartLanding.style.background = gradient;
    pieChartLanding.style.transform = 'scale(0.95)';
    setTimeout(() => {
        pieChartLanding.style.transform = 'scale(1)';
    }, 150);
}

// Display result button on landing - Opens results page
function displayResultLanding() {
    if (!displayResultBtnLanding) return;
    displayResultBtnLanding.textContent = 'Analyzing...';
    displayResultBtnLanding.disabled = true;

    // Generate sample analysis data
    const analysisData = generateSampleAnalysisData(currentHotel);
    
    // Open results page in new tab with loading
    openResultsPageWithLoading(analysisData);
    
    // Reset button immediately since loading happens in new tab
    displayResultBtnLanding.textContent = 'Display result';
    displayResultBtnLanding.disabled = false;
    
    // Update pie chart animation
    if (pieChartLanding) {
        pieChartLanding.style.transform = 'scale(1.1)';
        setTimeout(() => {
            pieChartLanding.style.transform = 'scale(1)';
        }, 200);
    }
}

// Load random hotel for dashboard
function loadRandomHotel() {
    const randomIndex = Math.floor(Math.random() * SAMPLE_HOTELS.length);
    currentHotel = SAMPLE_HOTELS[randomIndex];
    updateDisplay();
}

// Update dashboard display
function updateDisplay() {
    if (hotelName) hotelName.textContent = currentHotel.name;
    updatePieChart(currentHotel.genuine);
    if (percentageText) percentageText.textContent = `${currentHotel.genuine}%`;
    if (genuinePercentage) genuinePercentage.textContent = `${currentHotel.genuine}%`;
    if (fakePercentage) fakePercentage.textContent = `${currentHotel.fake}%`;
}

// Update pie chart on dashboard
function updatePieChart(genuinePercent) {
    if (!pieChart) return;
    const genuineDegrees = (genuinePercent / 100) * 360;
    const gradient = `conic-gradient(
        #28a745 0deg ${genuineDegrees}deg,
        #e9ecef ${genuineDegrees}deg 360deg
    )`;
    pieChart.style.background = gradient;
    pieChart.style.transform = 'scale(0.95)';
    setTimeout(() => {
        pieChart.style.transform = 'scale(1)';
    }, 150);
}

// Display result on dashboard - Opens results page
function displayResult() {
    if (!displayResultBtn) return;
    displayResultBtn.textContent = 'Analyzing...';
    displayResultBtn.disabled = true;

    // Generate sample analysis data
    const analysisData = generateSampleAnalysisData(currentHotel);
    
    // Save to history for logged-in users
    chrome.storage.local.get(['analysisHistory', 'isLoggedIn'], function(result) {
        if (result.isLoggedIn) {
            const history = result.analysisHistory || [];
            const historyEntry = {
                hotelName: currentHotel.name,
                genuine: currentHotel.genuine,
                fake: currentHotel.fake,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString(),
                analysisId: generateAnalysisId()
            };
            history.unshift(historyEntry);
            if (history.length > 50) {
                history.splice(50);
            }
            chrome.storage.local.set({ analysisHistory: history });
        }
    });

    // Open results page in new tab with loading
    openResultsPageWithLoading(analysisData);
    
    // Reset button immediately since loading happens in new tab
    displayResultBtn.textContent = 'Display result';
    displayResultBtn.disabled = false;
    
    // Update pie chart animation
    if (pieChart) {
        pieChart.style.transform = 'scale(1.1)';
        setTimeout(() => {
            pieChart.style.transform = 'scale(1)';
        }, 200);
    }
    
    showMessage('Analysis complete!', 'success');
}

// Generate sample analysis data for demonstration
function generateSampleAnalysisData(hotel) {
    const sampleWordClouds = [
        [
            { word: "excellent", size: 32 }, { word: "service", size: 28 }, { word: "clean", size: 24 },
            { word: "staff", size: 22 }, { word: "location", size: 20 }, { word: "room", size: 18 },
            { word: "comfortable", size: 16 }, { word: "recommend", size: 14 }, { word: "value", size: 12 }
        ],
        [
            { word: "amazing", size: 30 }, { word: "beautiful", size: 26 }, { word: "perfect", size: 22 },
            { word: "friendly", size: 20 }, { word: "helpful", size: 18 }, { word: "breakfast", size: 16 },
            { word: "pool", size: 14 }, { word: "view", size: 12 }, { word: "relaxing", size: 10 }
        ]
    ];
    
    const sampleReviewers = [
        [
            { name: "TravelGuru", reviewCount: 12 },
            { name: "SarahGoe", reviewCount: 10 },
            { name: "MaySmith", reviewCount: 20 }
        ],
        [
            { name: "HotelExpert", reviewCount: 15 },
            { name: "VacationLover", reviewCount: 8 },
            { name: "BusinessTraveler", reviewCount: 25 }
        ]
    ];
    
    const sampleReviews = [
        [
            { reviewer: "TravelGuru", reviewText: "Nice place! High five!", classification: "genuine", percentage: 85 },
            { reviewer: "SarahGoe", reviewText: "Place too bad", classification: "genuine", percentage: 34 },
            { reviewer: "MaySmith", reviewText: "Nice food", classification: "fake", percentage: 72 }
        ],
        [
            { reviewer: "HotelExpert", reviewText: "Absolutely wonderful experience", classification: "genuine", percentage: 92 },
            { reviewer: "VacationLover", reviewText: "Worst hotel ever", classification: "fake", percentage: 68 },
            { reviewer: "BusinessTraveler", reviewText: "Perfect for business trips", classification: "genuine", percentage: 78 }
        ]
    ];
    
    const randomIndex = Math.floor(Math.random() * 2);
    
    return {
        hotelName: hotel.name,
        genuinePercentage: hotel.genuine,
        fakePercentage: hotel.fake,
        wordCloud: sampleWordClouds[randomIndex],
        frequentReviewers: sampleReviewers[randomIndex],
        individualReviews: sampleReviews[randomIndex],
        analysisId: generateAnalysisId(),
        timestamp: new Date().toISOString()
    };
}

// Generate unique analysis ID
function generateAnalysisId() {
    return 'analysis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Open results page in new tab with proper loading
function openResultsPageWithLoading(analysisData) {
    try {
        // Encode data to pass via URL
        const encodedData = encodeURIComponent(JSON.stringify(analysisData));
        const resultsUrl = chrome.runtime.getURL(`html/results.html?data=${encodedData}&loading=true`);
        
        // Open in new tab
        chrome.tabs.create({
            url: resultsUrl,
            active: true
        });
    } catch (error) {
        console.error('Error opening results page:', error);
        showMessage('Error opening results page', 'error');
    }
}

// Navigate to profile page within popup
function openProfilePage() {
    window.location.href = 'profile.html';
}

// Handle logout
function handleLogout() {
    chrome.storage.local.remove(['isLoggedIn', 'userName', 'userEmail', 'loginTime', 'analysisHistory'], function() {
        showMessage('You have been logged out', 'success');
        setTimeout(() => {
            showLandingScreen();
        }, 500);
    });
}

// Show login required message
function showLoginRequiredMessage() {
    showMessage('Please log in to access this feature', 'error');
}

// Switch tabs - Keep everything within popup except results
function switchTab(tabName) {
    document.querySelectorAll('.nav-item').forEach(tab => tab.classList.remove('active'));
    switch(tabName) {
        case 'analysis':
            if (analysisTab) analysisTab.classList.add('active');
            // Show analysis view
            showAnalysisView();
            break;
        case 'history':
            if (historyTab) historyTab.classList.add('active');
            // Show history view within popup
            showHistoryView();
            break;
        case 'profile':
            if (profileTab) profileTab.classList.add('active');
            // Navigate within popup, not new tab
            window.location.href = 'profile.html';
            break;
    }
}

// Show analysis view (main dashboard)
function showAnalysisView() {
    // Hide all screens
    hideAllScreens();
    
    // Show appropriate screen based on login status
    chrome.storage.local.get(['isLoggedIn', 'userName'], function(result) {
        if (result.isLoggedIn) {
            if (dashboardScreen) dashboardScreen.style.display = 'block';
        } else {
            if (landingScreen) landingScreen.style.display = 'block';
        }
    });
}

// Show history view within popup
function showHistoryView() {
    chrome.storage.local.get(['isLoggedIn', 'analysisHistory'], function(result) {
        if (!result.isLoggedIn) {
            showLoginRequiredMessage();
            return;
        }
        
        const history = result.analysisHistory || [];
        
        // Hide all screens
        hideAllScreens();
        
        // Create and show history screen
        createHistoryScreen(history);
    });
}

// Hide all screens
function hideAllScreens() {
    if (landingScreen) landingScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'none';
    if (dashboardScreen) dashboardScreen.style.display = 'none';
    
    // Remove any existing history screen
    const existingHistoryScreen = document.getElementById('historyScreenPopup');
    if (existingHistoryScreen) {
        existingHistoryScreen.remove();
    }
}

// Create history screen within popup
function createHistoryScreen(history) {
    const historyScreen = document.createElement('div');
    historyScreen.id = 'historyScreenPopup';
    historyScreen.className = 'history-screen-popup';
    
    historyScreen.innerHTML = `
        <div class="history-main-container">
            <div class="history-header-popup">
                <div class="history-title-popup">History</div>
            </div>
            
            <div class="history-content-popup">
                <div class="history-list-popup" id="historyListPopup">
                    ${history.length === 0 ? `
                        <div class="no-history-popup">
                            <p>No analysis history found</p>
                            <span>Start analyzing hotels to see your history!</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="bottom-nav">
                <div class="nav-item" id="analysisTabHistoryPopup">
                    <div class="nav-icon">📊</div>
                    <div class="nav-label">Analysis</div>
                </div>
                <div class="nav-item active" id="historyTabHistoryPopup">
                    <div class="nav-icon">🕒</div>
                    <div class="nav-label">History</div>
                </div>
                <div class="nav-item" id="profileTabHistoryPopup">
                    <div class="nav-icon">👤</div>
                    <div class="nav-label">Profile</div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
   // Replace the style.textContent in your popup.js createHistoryScreen function with this:

style.textContent = `
    .history-screen-popup {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        background-size: 200% 200%;
        animation: gradientShift 8s ease infinite;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        padding: 8px;
        box-sizing: border-box;
        overflow: hidden;
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .history-main-container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        max-height: 100%;
    }
    
    .history-header-popup {
        padding: 20px 20px 16px;
        background: linear-gradient(135deg, rgba(89, 60, 231, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
        border-bottom: 1px solid rgba(240, 240, 240, 0.5);
        margin: 12px 14px 0 14px;
        border-radius: 12px;
        text-align: center;
        flex-shrink: 0;
        box-shadow: 0 4px 16px rgba(89, 60, 231, 0.1);
    }

    .history-title-popup {
        font-size: 1.4rem;
        font-weight: 800;
        color: #593ce7;
        margin: 0 0 4px 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background: linear-gradient(135deg, #593ce7 0%, #667eea 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .history-subtitle-popup {
        font-size: 0.85rem;
        font-weight: 500;
        color: #593ce7;
        margin: 0;
        opacity: 0.8;
    }
    
    .history-content-popup {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
        background: transparent;
        min-height: 0;
    }
    
    .history-list-popup {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }
    
    .history-item-popup {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 18px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        position: relative;
        overflow: hidden;
    }
    
    .history-item-popup::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.6s;
    }
    
    .history-item-popup:hover::before {
        left: 100%;
    }
    
    .history-item-popup:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 242, 247, 0.95) 100%);
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        border-color: rgba(102, 126, 234, 0.3);
    }
    
    .hotel-name-history-popup {
        font-size: 1.1rem;
        font-weight: 700;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .result-text-popup {
        font-size: 0.85rem;
        color: #555;
        text-align: center;
        font-weight: 600;
        margin-bottom: 8px;
        background: rgba(108, 117, 125, 0.1);
        padding: 4px 8px;
        border-radius: 6px;
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
    }
    
    .analysis-date-popup {
        font-size: 0.8rem;
        color: #777;
        text-align: center;
        font-weight: 500;
        background: rgba(119, 119, 119, 0.1);
        padding: 3px 6px;
        border-radius: 4px;
        display: inline-block;
    }
    
    .no-history-popup {
        text-align: center;
        padding: 60px 20px;
        color: #666;
    }
    
    .no-history-popup::before {
        content: '🕒';
        display: block;
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    }
    
    .no-history-popup p {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 12px;
        color: #555;
    }
    
    .no-history-popup span {
        font-size: 0.9rem;
        color: #777;
        font-weight: 500;
        display: block;
        margin-bottom: 24px;
    }
    
    .bottom-nav {
        display: flex;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(224, 224, 224, 0.5);
        height: 70px;
        border-radius: 0 0 12px 12px;
        flex-shrink: 0;
        position: relative;
    }
    
    .bottom-nav::before {
        content: '';
        position: absolute;
        top: 0;
        left: 20px;
        right: 20px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(224,224,224,0.5), transparent);
    }
    
    .nav-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        gap: 4px;
        border-radius: 12px;
        margin: 8px 4px;
        position: relative;
    }
    
    .nav-item:hover {
        background: rgba(102, 126, 234, 0.1);
        transform: translateY(-1px);
    }
    
    .nav-item.active {
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
    
    .nav-item.active::before {
        content: '';
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 2px;
    }
    
    .nav-item.active .nav-icon {
        transform: scale(1.15);
    }
    
    .nav-item.active .nav-label {
        color: #1976d2;
        font-weight: 700;
    }
    
    .nav-icon {
        font-size: 1.3rem;
        margin-bottom: 2px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    
    .nav-label {
        font-size: 0.7rem;
        color: #666;
        font-weight: 600;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }
    
    /* Enhanced scrollbar */
    .history-content-popup::-webkit-scrollbar {
        width: 6px;
    }
    
    .history-content-popup::-webkit-scrollbar-track {
        background: rgba(241, 241, 241, 0.5);
        border-radius: 3px;
    }
    
    .history-content-popup::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #c1c1c1 0%, #a0a0a0 100%);
        border-radius: 3px;
        transition: background 0.3s ease;
    }
    
    .history-content-popup::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #a0a0a0 0%, #808080 100%);
    }
`;
    
    document.head.appendChild(style);
    document.body.appendChild(historyScreen);
    
    // Populate history items if any
    if (history.length > 0) {
        const historyListPopup = document.getElementById('historyListPopup');
        history.forEach((item, index) => {
            const historyItem = createHistoryItemPopup(item, index);
            historyListPopup.appendChild(historyItem);
        });
    }
    
    // Setup navigation
    document.getElementById('analysisTabHistoryPopup')?.addEventListener('click', () => switchTab('analysis'));
    document.getElementById('historyTabHistoryPopup')?.addEventListener('click', () => switchTab('history'));
    document.getElementById('profileTabHistoryPopup')?.addEventListener('click', () => switchTab('profile'));
}

// Create history item for popup
function createHistoryItemPopup(item, index) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item-popup';
    
    // Format date
    const date = new Date(item.timestamp || item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    historyItem.innerHTML = `
        <div class="hotel-name-history-popup">${item.hotelName}</div>
        <div class="result-text-popup">${item.hotelName} result</div>
        <div class="analysis-date-popup">${formattedDate}</div>
    `;

    // Add click handler to open results
    historyItem.addEventListener('click', () => {
        openHistoryResultFromPopup(item);
    });

    return historyItem;
}

// Open result from history in popup
function openHistoryResultFromPopup(historyItem) {
    // Generate analysis data from history item
    const analysisData = generateSampleAnalysisData({
        name: historyItem.hotelName,
        genuine: historyItem.genuine,
        fake: historyItem.fake
    });

    // Open results page in new tab
    openResultsPageWithLoading(analysisData);
    
    showMessage('Opening analysis results...', 'success');
}

// Show history view within popup
function showHistoryView() {
    chrome.storage.local.get(['isLoggedIn', 'analysisHistory'], function(result) {
        if (!result.isLoggedIn) {
            showLoginRequiredMessage();
            return;
        }
        
        const history = result.analysisHistory || [];
        
        // Hide all screens
        hideAllScreens();
        
        // Create and show history screen
        createHistoryScreen(history);
    });
}

// Show profile view
function showProfileView() {
    chrome.storage.local.get(['userName', 'userEmail', 'loginTime', 'analysisHistory'], function(result) {
        const loginDate = result.loginTime ? new Date(result.loginTime).toLocaleDateString() : 'Unknown';
        const count = result.analysisHistory ? result.analysisHistory.length : 0;
        showMessage(`${result.userName} | Member since: ${loginDate} | ${count} analyses`, 'info');
    });
}

// Show messages
function showMessage(text, type) {
    if (!messageToast) return;
    messageToast.textContent = text;
    messageToast.className = `message-toast ${type}`;
    messageToast.classList.add('show');
    setTimeout(() => messageToast.classList.remove('show'), 3000);
}

// Validate email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Set button loading
function setButtonLoading(button, loading) {
    if (!button) return;
    button.disabled = loading;
    const btnText = button.querySelector('.btn-text');
    const btnSpinner = button.querySelector('.btn-spinner');
    if (btnText && btnSpinner) {
        btnText.style.display = loading ? 'none' : 'inline';
        btnSpinner.style.display = loading ? 'inline' : 'none';
    }
}

// Prefill demo credentials for testing
function prefillDemoCredentials() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput) emailInput.value = 'demo@analyzer.com';
    if (passwordInput) passwordInput.value = 'demo123';
}

// Handle content script messaging for review extraction
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'reviewsExtracted') {
        // Handle extracted reviews from content script
        handleExtractedReviews(request.reviews, request.hotelName);
    } else if (request.action === 'extractionError') {
        showMessage('Error extracting reviews from page', 'error');
    }
});

// Handle extracted reviews from webpage
function handleExtractedReviews(reviews, hotelName) {
    if (!reviews || reviews.length === 0) {
        showMessage('No reviews found on this page', 'error');
        return;
    }
    
    showMessage(`Found ${reviews.length} reviews. Analyzing...`, 'info');
    
    // In real implementation, send to FastAPI backend
    // For now, generate sample data
    const analysisData = {
        hotelName: hotelName || 'Unknown Hotel',
        genuinePercentage: Math.floor(Math.random() * 40) + 50, // 50-90%
        fakePercentage: 0,
        extractedReviews: reviews,
        wordCloud: generateWordCloud(reviews),
        frequentReviewers: findFrequentReviewers(reviews),
        individualReviews: analyzeIndividualReviews(reviews)
    };
    
    analysisData.fakePercentage = 100 - analysisData.genuinePercentage;
    
    // Open results page
    openResultsPage(analysisData);
}

// Generate word cloud from reviews
function generateWordCloud(reviews) {
    const words = {};
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
    
    reviews.forEach(review => {
        const text = review.text || review.content || '';
        const wordsArray = text.toLowerCase().split(/\W+/);
        wordsArray.forEach(word => {
            if (word.length > 3 && !commonWords.includes(word)) {
                words[word] = (words[word] || 0) + 1;
            }
        });
    });
    
    return Object.entries(words)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([word, count]) => ({
            word: word,
            size: Math.min(32, Math.max(12, count * 3 + 10))
        }));
}

// Find frequent reviewers
function findFrequentReviewers(reviews) {
    const reviewers = {};
    reviews.forEach(review => {
        const reviewer = review.reviewer || review.author || 'Anonymous';
        reviewers[reviewer] = (reviewers[reviewer] || 0) + 1;
    });
    
    return Object.entries(reviewers)
        .filter(([name, count]) => count > 1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({
            name: name,
            reviewCount: count
        }));
}

// Analyze individual reviews
function analyzeIndividualReviews(reviews) {
    return reviews.slice(0, 20).map(review => {
        const isGenuine = Math.random() > 0.3; // 70% chance of being genuine
        const percentage = Math.floor(Math.random() * 30) + (isGenuine ? 60 : 45);
        
        return {
            reviewer: review.reviewer || review.author || 'Anonymous',
            reviewText: (review.text || review.content || '').substring(0, 100),
            classification: isGenuine ? 'genuine' : 'fake',
            percentage: percentage
        };
    });
}

// Extract reviews from current tab
function extractReviewsFromCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'extractReviews' }, (response) => {
                if (chrome.runtime.lastError) {
                    showMessage('Cannot extract reviews from this page', 'error');
                    return;
                }
                
                if (response && response.success) {
                    handleExtractedReviews(response.reviews, response.hotelName);
                } else {
                    showMessage('No reviews found on this page', 'error');
                }
            });
        }
    });
}