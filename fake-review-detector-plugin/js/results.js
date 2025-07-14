// Results page JavaScript functionality

// DOM Elements
const hotelNameElement = document.getElementById('hotelName');
const pieChart = document.getElementById('pieChart');
const fakePercentage = document.getElementById('fakePercentage');
const genuinePercentage = document.getElementById('genuinePercentage');
const fakePercent = document.getElementById('fakePercent');
const genuinePercent = document.getElementById('genuinePercent');
const wordCloudContainer = document.getElementById('wordCloudContainer');
const frequentReviewersList = document.getElementById('frequentReviewersList');
const individualReviewsList = document.getElementById('individualReviewsList');
const downloadBtn = document.getElementById('downloadBtn');
const backBtn = document.getElementById('backBtn');
const loadingOverlay = document.getElementById('loadingOverlay');

// Sample data (replace with actual API data)
let analysisData = {
    hotelName: "Grand Palace Hotel",
    genuinePercentage: 65,
    fakePercentage: 35,
    wordCloud: [
        { word: "excellent", size: 32 },
        { word: "service", size: 28 },
        { word: "clean", size: 24 },
        { word: "staff", size: 22 },
        { word: "location", size: 20 },
        { word: "room", size: 18 },
        { word: "comfortable", size: 16 },
        { word: "recommend", size: 14 },
        { word: "value", size: 12 },
        { word: "breakfast", size: 10 }
    ],
    frequentReviewers: [
        { name: "TravelGuru", reviewCount: 12 },
        { name: "SarahGoe", reviewCount: 10 },
        { name: "MaySmith", reviewCount: 20 }
    ],
    individualReviews: [
        {
            reviewer: "TravelGuru",
            reviewText: "Nice place ! high five !",
            classification: "genuine",
            percentage: 60
        },
        {
            reviewer: "SarahGoe",
            reviewText: "Place too bad",
            classification: "genuine",
            percentage: 34
        },
        {
            reviewer: "MaySmith",
            reviewText: "nice food",
            classification: "fake",
            percentage: 50
        }
    ]
};

// Initialize the results page
document.addEventListener('DOMContentLoaded', function() {
    initializeResultsPage();
    setupEventListeners();
});

// Initialize the results page
function initializeResultsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataFromUrl = urlParams.get('data');

    if (dataFromUrl) {
        try {
            analysisData = JSON.parse(decodeURIComponent(dataFromUrl));
        } catch (e) {
            console.error('Error parsing URL data:', e);
        }
    }

    // Remove animation delay
    loadAnalysisData();
    hideLoading(); // Optional: just to make sure the overlay is hidden if it's there
}

// Setup event listeners
function setupEventListeners() {
    // Download button
    downloadBtn?.addEventListener('click', handleDownload);
    
    // Back button
    backBtn?.addEventListener('click', handleBack);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            handleBack();
        }
    });
}

// Load and display analysis data
function loadAnalysisData() {
    try {
        // Update hotel name
        updateHotelName();
        
        // Update pie chart
        updatePieChart();
        
        // Update word cloud
        updateWordCloud();
        
        // Update frequent reviewers
        updateFrequentReviewers();
        
        // Update individual reviews
        updateIndividualReviews();
        
    } catch (error) {
        console.error('Error loading analysis data:', error);
        showError('Failed to load analysis data');
    }
}

// Update hotel name
function updateHotelName() {
    if (hotelNameElement && analysisData.hotelName) {
        hotelNameElement.textContent = analysisData.hotelName;
        // Update page title
        document.title = `${analysisData.hotelName} - Review Analysis Results`;
    }
}

// Update pie chart
function updatePieChart() {
    const genuine = analysisData.genuinePercentage || 65;
    const fake = analysisData.fakePercentage || 35;
    
    // Update percentage displays
    if (fakePercentage) fakePercentage.textContent = `${fake}%`;
    if (genuinePercentage) genuinePercentage.textContent = `${genuine}%`;
    if (fakePercent) fakePercent.textContent = `${fake}%`;
    if (genuinePercent) genuinePercent.textContent = `${genuine}%`;
    
    // Update pie chart visual
    if (pieChart) {
        const genuineDegrees = (genuine / 100) * 360;
        const gradient = `conic-gradient(
            #28a745 0deg ${genuineDegrees}deg,
            #e9ecef ${genuineDegrees}deg 360deg
        )`;
        pieChart.style.background = gradient;
        
        // Add animation
        pieChart.style.transform = 'scale(0)';
        setTimeout(() => {
            pieChart.style.transition = 'transform 0.6s ease-out';
            pieChart.style.transform = 'scale(1)';
        }, 100);
    }
}

// Update word cloud using D3.js word cloud library
function updateWordCloud() {
    if (!analysisData.wordCloud) return;
    
    const container = document.getElementById('wordCloudContainer');
    const svg = document.getElementById('wordCloudSvg');
    
    if (!container || !svg) return;
    
    // Clear existing content
    d3.select(svg).selectAll("*").remove();
    
    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const width = Math.min(containerRect.width - 40, 800);
    const height = 400;
    
    // Set SVG dimensions
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    
    // Prepare word data
    const words = analysisData.wordCloud.map(d => ({
        text: d.word,
        size: Math.max(12, Math.min(60, d.size * 1.5)) // Scale font sizes appropriately
    }));
    
    // Color scale for words
    const colors = ['#2c3e50', '#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#1abc9c', '#34495e'];
    const colorScale = d3.scaleOrdinal(colors);
    
    // Create word cloud layout
    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(8)
        .rotate(() => (Math.random() - 0.5) * 60) // Random rotation between -30 and 30 degrees
        .font("Arial, sans-serif")
        .fontSize(d => d.size)
        .spiral("archimedean")
        .on("end", draw);
    
    layout.start();
    
    function draw(words) {
        const svgElement = d3.select(svg);
        
        const g = svgElement.append("g")
            .attr("transform", `translate(${width/2},${height/2})`);
        
        const text = g.selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => `${d.size}px`)
            .style("font-family", "Arial, sans-serif")
            .style("font-weight", "600")
            .style("fill", (d, i) => colorScale(i))
            .attr("text-anchor", "middle")
            .attr("class", "word-cloud-word")
            .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
        
        // Add hover effects
        text.on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", "#007bff")
                    .style("font-size", `${d.size * 1.1}px`);
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("fill", colorScale(words.indexOf(d)))
                    .style("font-size", `${d.size}px`);
            });
        
        // Add entrance animation
        text.style("opacity", 0)
            .transition()
            .duration(1000)
            .delay((d, i) => i * 100)
            .style("opacity", 1);
    }
}

// Update frequent reviewers
function updateFrequentReviewers() {
    if (!frequentReviewersList || !analysisData.frequentReviewers) return;
    
    // Clear existing content
    frequentReviewersList.innerHTML = '';
    
    analysisData.frequentReviewers.forEach((reviewer, index) => {
        const reviewerElement = document.createElement('div');
        reviewerElement.className = 'reviewer-item';
        
        reviewerElement.innerHTML = `
            <span class="reviewer-name">${reviewer.name}</span>
            <span class="review-count">[${reviewer.reviewCount} reviews]</span>
        `;
        
        // Add staggered animation
        reviewerElement.style.opacity = '0';
        reviewerElement.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            reviewerElement.style.transition = 'all 0.5s ease-out';
            reviewerElement.style.opacity = '1';
            reviewerElement.style.transform = 'translateX(0)';
        }, index * 150);
        
        frequentReviewersList.appendChild(reviewerElement);
    });
}

// Update individual reviews
function updateIndividualReviews() {
    if (!individualReviewsList || !analysisData.individualReviews) return;
    
    // Clear existing content
    individualReviewsList.innerHTML = '';
    
    analysisData.individualReviews.forEach((review, index) => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        
        const isGenuine = review.classification === 'genuine';
        const classificationClass = isGenuine ? 'genuine' : 'fake';
        const icon = isGenuine ? '+' : '-';
        const label = isGenuine ? 'Genuine' : 'Fake';
        
        reviewElement.innerHTML = `
            <div class="reviewer-name-review">${review.reviewer}</div>
            <div class="review-content">
                <span class="review-text">• ${review.reviewText}</span>
                <div class="review-classification ${classificationClass}">
                    <div class="classification-icon">${icon}</div>
                    <span>${label} ${review.percentage}%</span>
                </div>
            </div>
        `;
        
        // Add staggered animation
        reviewElement.style.opacity = '0';
        reviewElement.style.transform = 'translateY(20px)';
        setTimeout(() => {
            reviewElement.style.transition = 'all 0.5s ease-out';
            reviewElement.style.opacity = '1';
            reviewElement.style.transform = 'translateY(0)';
        }, index * 200);
        
        individualReviewsList.appendChild(reviewElement);
    });
}

// Handle download functionality
async function handleDownload() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    try {
        const now = new Date();
        const timestamp = now.toLocaleString();

        doc.setFontSize(16);
        doc.text("Hotel Review Analysis Report", 10, 20);

        doc.setFontSize(12);
        doc.text(`Hotel name: ${analysisData.hotelName}`, 10, 30);
        doc.text(`Date: ${timestamp}`, 10, 38);
        doc.text(`Overall percentage reviews are genuine: ${analysisData.genuinePercentage}%`, 10, 46);
        doc.text(`Overall percentage reviews are fake: ${analysisData.fakePercentage}%`, 10, 54);

        // Top Words
        doc.setFont(undefined, 'bold');
        doc.text("Word cloud (frequent words):", 10, 68);
        doc.setFont(undefined, 'normal');
        let y = 76;
        analysisData.wordCloud.forEach(word => {
        doc.text(`- ${word.word}`, 10, y);
        y += 8;
        });

        // Frequent Reviewers
        doc.setFont(undefined, 'bold');
        doc.text("Frequent Reviewers:", 10, y + 6);
        doc.setFont(undefined, 'normal');
        y += 14;
        analysisData.frequentReviewers.forEach(reviewer => {
        doc.text(`- ${reviewer.name}: ${reviewer.reviewCount} reviews`, 10, y);
        y += 8;
        });

        // Individual Reviews
        doc.setFont(undefined, 'bold');
        doc.text("Reviews Result:", 10, y + 6);
        doc.setFont(undefined, 'normal');
        y += 14;
        analysisData.individualReviews.forEach((review, index) => {
        doc.text(
            `${index + 1}. ${review.reviewer}: [${review.classification.toUpperCase()} - ${review.percentage}%] ${review.reviewText}`,
            10,
            y
        );
        y += 8;
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        });

        const safeHotelName = analysisData.hotelName.replace(/\s+/g, '_');  // Remove spaces
        doc.save(`${safeHotelName}_Analysis Result.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate styled PDF.");
    }
}

// Handle back navigation
function handleBack() {
    // Check if we can go back in history
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Close the tab if no history
        window.close();
        
        // If close doesn't work (popup blocker), show message
        setTimeout(() => {
            showMessage('Please close this tab manually', 'info');
        }, 500);
    }
}

// Show loading overlay with custom animation
function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
        // Don't start animation here - it's called from initializeResultsPage
    }
}

// Start progress animation
function startProgressAnimation() {
    const progressCircle = document.getElementById('progressCircle');
    const progressText = document.getElementById('progressText');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 5 + 2; // Slower increment between 2-7
        if (progress > 100) progress = 100;
        
        // Update progress circle
        const degrees = (progress / 100) * 360;
        progressCircle.style.setProperty('--progress-deg', degrees + 'deg');
        
        // Update progress text
        if (progressText) {
            progressText.textContent = Math.floor(progress) + '%';
        }
        
        // Stop at 100%
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                hideLoading();
            }, 800);
        }
    }, 400); // Slower interval - was 200ms, now 400ms
}

// Hide loading overlay
function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Show success message
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-${type}`;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// API Integration Functions (to be connected with your FastAPI backend)

// Function to fetch analysis data from backend
async function fetchAnalysisData(hotelId, reviews) {
    try {
        const response = await fetch('/api/analyze-reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hotel_id: hotelId,
                reviews: reviews
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching analysis data:', error);
        throw error;
    }
}

// Function to save analysis results to backend
async function saveAnalysisResults(analysisData) {
    try {
        const response = await fetch('/api/save-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(analysisData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving analysis results:', error);
        throw error;
    }
}

// Function to generate and download PDF report
async function generatePDFReport(analysisData) {
    try {
        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(analysisData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get the PDF blob
        const pdfBlob = await response.blob();
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `${analysisData.hotelName.replace(/\s+/g, '_')}_analysis_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

// Utility function to format data for display
function formatAnalysisData(rawData) {
    return {
        hotelName: rawData.hotel_name || "Unknown Hotel",
        genuinePercentage: Math.round(rawData.genuine_percentage || 0),
        fakePercentage: Math.round(rawData.fake_percentage || 0),
        wordCloud: rawData.word_frequency?.map(item => ({
            word: item.word,
            size: Math.max(12, Math.min(32, item.frequency * 2))
        })) || [],
        frequentReviewers: rawData.frequent_reviewers?.map(reviewer => ({
            name: reviewer.reviewer_name,
            reviewCount: reviewer.review_count
        })) || [],
        individualReviews: rawData.individual_reviews?.map(review => ({
            reviewer: review.reviewer_name,
            reviewText: review.review_text,
            classification: review.is_genuine ? 'genuine' : 'fake',
            percentage: Math.round(review.confidence_score * 100)
        })) || []
    };
}

// Function to handle real-time data loading (when connected to backend)
async function loadRealAnalysisData() {
    try {
        showLoading();
        
        // Get data from URL parameters or extension storage
        const urlParams = new URLSearchParams(window.location.search);
        const analysisId = urlParams.get('analysis_id');
        
        if (analysisId) {
            // Fetch from backend using analysis ID
            const rawData = await fetchAnalysisData(analysisId);
            analysisData = formatAnalysisData(rawData);
        }
        
        // Load and display the data
        loadAnalysisData();
        
        // Save to user's analysis history if logged in
        chrome.storage.local.get(['isLoggedIn', 'userEmail'], async (result) => {
            if (result.isLoggedIn) {
                try {
                    await saveAnalysisResults({
                        ...analysisData,
                        userEmail: result.userEmail,
                        timestamp: new Date().toISOString()
                    });
                } catch (error) {
                    console.warn('Failed to save analysis to history:', error);
                }
            }
        });
        
    } catch (error) {
        showError('Failed to load analysis data. Please try again.');
        console.error('Error loading real analysis data:', error);
        
        // Fallback to demo data
        loadAnalysisData();
    } finally {
        hideLoading();
    }
}

// Enhanced download function for real PDF generation
async function handleDownloadReal() {
    try {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        
        // Generate PDF using backend API
        await generatePDFReport(analysisData);
        
        showMessage('PDF report downloaded successfully!', 'success');
        
    } catch (error) {
        showError('Failed to generate PDF report. Please try again.');
        console.error('Error generating PDF:', error);
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download result';
    }
}

// Function to update download handler based on environment
function initializeDownloadHandler() {
    // Check if we're in development or production
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.protocol === 'chrome-extension:';
    
    if (isDevelopment) {
        // Use mock download for development
        downloadBtn?.addEventListener('click', handleDownload);
    } else {
        // Use real PDF generation for production
        downloadBtn?.addEventListener('click', handleDownloadReal);
    }
}

// Error handling and validation functions
function validateAnalysisData(data) {
    if (!data) {
        throw new Error('No analysis data provided');
    }
    
    if (!data.hotelName) {
        throw new Error('Hotel name is required');
    }
    
    if (typeof data.genuinePercentage !== 'number' || typeof data.fakePercentage !== 'number') {
        throw new Error('Invalid percentage data');
    }
    
    return true;
}

// Handle network errors
function handleNetworkError(error) {
    console.error('Network error:', error);
    
    let message = 'Network error occurred';
    if (error.message.includes('Failed to fetch')) {
        message = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.message.includes('timeout')) {
        message = 'Request timeout. Please try again.';
    } else if (error.message.includes('500')) {
        message = 'Server error. Please try again later.';
    }
    
    showError(message);
}

// Retry mechanism for API calls
async function retryApiCall(apiFunction, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiFunction();
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;
            }
            
            console.warn(`API call failed, retrying in ${delay}ms...`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
}

// Safe data access with fallbacks
function safeGet(obj, path, defaultValue = null) {
    try {
        return path.split('.').reduce((current, key) => current && current[key], obj) || defaultValue;
    } catch (error) {
        console.warn('Safe get failed:', error);
        return defaultValue;
    }
}

// Initialize error boundary
function initializeErrorBoundary() {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        showError('An unexpected error occurred. Please refresh the page.');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        showError('An error occurred while processing your request.');
    });
}

// Call error boundary initialization
document.addEventListener('DOMContentLoaded', initializeErrorBoundary);