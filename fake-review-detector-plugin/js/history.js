// History page JavaScript functionality

// DOM elements
const historyScreen = document.getElementById('historyScreen');
const historyList = document.getElementById('historyList');
const noHistory = document.getElementById('noHistory');
const messageToast = document.getElementById('messageToast');

// Navigation elements
const analysisTabHistory = document.getElementById('analysisTabHistory');
const historyTabHistory = document.getElementById('historyTabHistory');
const profileTabHistory = document.getElementById('profileTabHistory');

// Initialize history page
document.addEventListener('DOMContentLoaded', function() {
    checkLoginAndLoadHistory();
    setupHistoryEventListeners();
    addInteractiveEffects();
});

// Check login status via PHP session and then load history
function checkLoginAndLoadHistory() {
    $.ajax({
        url: 'http://localhost:8888/fake-review-detector-plugin/fake-review-detector-plugin/php/get_profile.php', // update path as needed
        method: 'GET',
        xhrFields: { withCredentials: true },
        success: function(data) {
            if (data.success) {
                // User is logged in (session active)
                const history = []; // placeholder: replace with real data later
                loadHistoryData(history);
            } else {
                showMessage('Please log in to view history', 'error');
                setTimeout(function() {
                    window.location.href = 'popup.html';
                }, 2000);
            }
        },
        error: function() {
            showMessage('Server error', 'error');
            setTimeout(function() {
                window.location.href = 'popup.html';
            }, 2000);
        }
    });
}

// Setup event listeners
function setupHistoryEventListeners() {
    // Navigation tabs
    if (analysisTabHistory) {
        analysisTabHistory.addEventListener('click', function() {
            navigateToTab('analysis');
        });
    }
    if (historyTabHistory) {
        historyTabHistory.addEventListener('click', function() {
            navigateToTab('history');
        });
    }
    if (profileTabHistory) {
        profileTabHistory.addEventListener('click', function() {
            navigateToTab('profile');
        });
    }
}

// Load history data
function loadHistoryData(history) {
    if (!historyList) return;
    
    // Clear existing content
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        // Show no history message
        const noHistoryElement = createNoHistoryElement();
        historyList.appendChild(noHistoryElement);
    } else {
        // Create history items
        history.forEach(function(item, index) {
            const historyItem = createHistoryItem(item, index);
            historyList.appendChild(historyItem);
        });
        
        // Add staggered animation
        const items = historyList.querySelectorAll('.history-item');
        items.forEach(function(item, index) {
            item.style.animationDelay = (index * 0.1) + 's';
            item.classList.add('fade-in-item');
        });
    }
}

// Create no history element
function createNoHistoryElement() {
    const noHistoryDiv = document.createElement('div');
    noHistoryDiv.className = 'no-history';
    noHistoryDiv.innerHTML = `
        <div class="no-history-icon">📊</div>
        <p>No analysis history found</p>
        <span>Start analyzing hotels to see your history!</span>
        <button class="start-analyzing-btn" onclick="navigateToTab('analysis')">
            <i class="fas fa-chart-line"></i>
            Start Analyzing
        </button>
    `;
    return noHistoryDiv;
}

// Create history item
function createHistoryItem(item, index) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    // Format date
    const date = new Date(item.timestamp || item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Determine result color based on genuine percentage
    let resultClass = 'genuine-medium';
    if (item.genuine >= 70) {
        resultClass = 'genuine-high';
    } else if (item.genuine < 50) {
        resultClass = 'genuine-low';
    }
    
    historyItem.innerHTML = `
        <div class="history-item-header">
            <div class="hotel-name-history">${item.hotelName}</div>
            <div class="history-date">${formattedDate}</div>
        </div>
        <div class="history-item-content">
            <div class="result-summary ${resultClass}">
                <div class="result-circle">
                    <span class="result-percentage">${item.genuine}%</span>
                </div>
                <div class="result-details">
                    <div class="genuine-text">${item.genuine}% Genuine</div>
                    <div class="fake-text">${item.fake}% Fake</div>
                </div>
            </div>
            <div class="history-actions">
                <button class="view-details-btn" onclick="openHistoryResult('${item.analysisId || index}')">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
            </div>
        </div>
    `;
    
    // Add click handler for the entire item
    historyItem.addEventListener('click', function(e) {
        // Don't trigger if clicking on button
        if (!e.target.closest('.view-details-btn')) {
            openHistoryResult(item.analysisId || index);
        }
    });
    
    return historyItem;
}

// Open history result
function openHistoryResult(analysisId) {
    chrome.storage.local.get(['analysisHistory'], function(result) {
        const history = result.analysisHistory || [];
        let item = null;
        
        // Find the item by analysisId or by index
        if (typeof analysisId === 'string' && analysisId.startsWith('analysis_')) {
            item = history.find(function(h) {
                return h.analysisId === analysisId;
            });
        } else {
            item = history[parseInt(analysisId)];
        }
        
        if (item) {
            // Generate analysis data from history item
            const analysisData = generateAnalysisDataFromHistory(item);
            
            // Open results page in new tab
            openResultsPageWithLoading(analysisData);
            
            showMessage('Opening analysis results...', 'success');
        } else {
            showMessage('Analysis not found', 'error');
        }
    });
}

// Generate analysis data from history item
function generateAnalysisDataFromHistory(historyItem) {
    // Sample data generation (similar to popup.js)
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
        hotelName: historyItem.hotelName,
        genuinePercentage: historyItem.genuine,
        fakePercentage: historyItem.fake,
        wordCloud: sampleWordClouds[randomIndex],
        frequentReviewers: sampleReviewers[randomIndex],
        individualReviews: sampleReviews[randomIndex],
        analysisId: historyItem.analysisId || generateAnalysisId(),
        timestamp: historyItem.timestamp || new Date().toISOString()
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
        const resultsUrl = chrome.runtime.getURL('html/results.html?data=' + encodedData + '&loading=true');
        
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

// Navigate to different tabs/pages
function navigateToTab(tabName) {
    switch(tabName) {
        case 'analysis':
            // Navigate back to main popup (analysis tab)
            window.location.href = 'popup.html';
            break;
        case 'history':
            // Already on history page
            showMessage('You are already on the history page', 'info');
            break;
        case 'profile':
            // Navigate to profile page
            window.location.href = 'profile.html';
            break;
        default:
            showMessage('Navigation not available', 'error');
    }
}

// Show messages
function showMessage(text, type) {
    if (!messageToast) return;
    
    messageToast.textContent = text;
    messageToast.className = 'message-toast ' + type;
    messageToast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(function() {
        messageToast.classList.remove('show');
    }, 3000);
}

// Add interactive effects
function addInteractiveEffects() {
    // Add hover effects for history items (will be applied when items are created)
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.history-item')) {
            const item = e.target.closest('.history-item');
            item.style.transform = 'translateY(-2px) scale(1.02)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.history-item')) {
            const item = e.target.closest('.history-item');
            item.style.transform = 'translateY(0) scale(1)';
        }
    });
    
    // Add ripple effect to buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-details-btn') || e.target.closest('.start-analyzing-btn')) {
            const button = e.target.closest('button');
            addRippleEffect(button, e);
        }
    });
}

// Add ripple effect to buttons
function addRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(function() {
        ripple.remove();
    }, 600);
}