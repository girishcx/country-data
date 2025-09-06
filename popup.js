// Chrome Extension - Simplified to work directly with web interface
// Opens the main web application in a new tab instead of making API calls

// Extension configuration
const WEB_APP_URL = 'http://127.0.0.1:5000';

// List of countries for the extension
const COUNTRIES = [
    'United States',
    'China',
    'Japan',
    'Germany',
    'India',
    'United Kingdom',
    'France',
    'Brazil',
    'Italy',
    'Canada',
    'Australia',
    'South Korea',
    'Spain',
    'Mexico',
    'Indonesia',
    'Netherlands',
    'Saudi Arabia',
    'Turkey',
    'Switzerland',
    'Taiwan'
];

// DOM elements
let openWebAppBtn, statusMessage;

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    checkServerStatus();
});

function initializeElements() {
    openWebAppBtn = document.getElementById('open-web-app-btn');
    statusMessage = document.getElementById('status-message');
}

function setupEventListeners() {
    openWebAppBtn.addEventListener('click', openWebApplication);
}

function openWebApplication() {
    // Open the web application in a new tab
    chrome.tabs.create({ url: WEB_APP_URL });
}

async function checkServerStatus() {
    try {
        const response = await fetch(WEB_APP_URL);
        if (response.ok) {
            statusMessage.textContent = '✅ Server is running';
            statusMessage.className = 'text-green-600 text-sm';
            openWebAppBtn.disabled = false;
        } else {
            throw new Error('Server not responding');
        }
    } catch (error) {
        statusMessage.textContent = '❌ Server not running - Start Flask server first';
        statusMessage.className = 'text-red-600 text-sm';
        openWebAppBtn.disabled = true;
    }
}