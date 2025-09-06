// List of 10 countries for the extension
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
    'Canada'
];

// API configuration
const API_BASE_URL = 'http://127.0.0.1:5000';
const API_ENDPOINT = '/get_country_data';

// DOM elements
let countrySelect, getDetailsBtn, loadingIndicator, errorMessage, dataContainer;
let tableViewBtn, jsonViewBtn, tableView, jsonView, dataTableBody, jsonDisplay;

// Current view state
let currentView = 'table';
let currentData = null;

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    populateCountrySelect();
    setupEventListeners();
});

function initializeElements() {
    countrySelect = document.getElementById('country-select');
    getDetailsBtn = document.getElementById('get-details-btn');
    loadingIndicator = document.getElementById('loading-indicator');
    errorMessage = document.getElementById('error-message');
    dataContainer = document.getElementById('data-container');
    tableViewBtn = document.getElementById('table-view-btn');
    jsonViewBtn = document.getElementById('json-view-btn');
    tableView = document.getElementById('table-view');
    jsonView = document.getElementById('json-view');
    dataTableBody = document.getElementById('data-table-body');
    jsonDisplay = document.getElementById('json-display');
}

function populateCountrySelect() {
    // Clear existing options except the first one
    countrySelect.innerHTML = '<option value="" disabled selected>-- Choose a country --</option>';
    
    // Add country options
    COUNTRIES.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

function setupEventListeners() {
    getDetailsBtn.addEventListener('click', handleGetDetails);
    tableViewBtn.addEventListener('click', () => switchView('table'));
    jsonViewBtn.addEventListener('click', () => switchView('json'));
}

async function handleGetDetails() {
    const selectedCountry = countrySelect.value;
    
    if (!selectedCountry) {
        showError('Please select a country first.');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    hideError();
    hideDataContainer();
    
    try {
        const data = await fetchCountryData(selectedCountry);
        currentData = data;
        displayData(data);
        showDataContainer();
    } catch (error) {
        console.error('Error fetching country data:', error);
        showError(`An error occurred. Make sure the backend server is running and the correct URL is configured. Error: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
}

async function fetchCountryData(countryName) {
    const url = `${API_BASE_URL}${API_ENDPOINT}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            countryName: countryName
        })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
}

function displayData(data) {
    if (currentView === 'table') {
        displayTableView(data);
    } else {
        displayJsonView(data);
    }
}

function displayTableView(data) {
    // Clear existing table rows
    dataTableBody.innerHTML = '';
    
    // Create table rows for each data field
    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const keyCell = document.createElement('td');
        keyCell.className = 'py-3 px-4 text-sm font-medium text-gray-900';
        keyCell.textContent = formatKey(key);
        
        const valueCell = document.createElement('td');
        valueCell.className = 'py-3 px-4 text-sm text-gray-700';
        
        if (Array.isArray(value)) {
            valueCell.textContent = value.join(', ');
        } else {
            valueCell.textContent = value;
        }
        
        row.appendChild(keyCell);
        row.appendChild(valueCell);
        dataTableBody.appendChild(row);
    });
}

function displayJsonView(data) {
    jsonDisplay.textContent = JSON.stringify(data, null, 2);
}

function switchView(view) {
    if (view === currentView) return;
    
    currentView = view;
    
    // Update button states
    if (view === 'table') {
        tableViewBtn.className = 'px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors';
        jsonViewBtn.className = 'px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors';
        tableView.classList.remove('hidden');
        jsonView.classList.add('hidden');
    } else {
        tableViewBtn.className = 'px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors';
        jsonViewBtn.className = 'px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors';
        tableView.classList.add('hidden');
        jsonView.classList.remove('hidden');
    }
    
    // Redisplay data in the new view
    if (currentData) {
        displayData(currentData);
    }
}

function formatKey(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
}

function setLoadingState(loading) {
    if (loading) {
        getDetailsBtn.disabled = true;
        getDetailsBtn.textContent = 'Loading...';
        loadingIndicator.classList.remove('hidden');
    } else {
        getDetailsBtn.disabled = false;
        getDetailsBtn.textContent = 'Get Details';
        loadingIndicator.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showDataContainer() {
    dataContainer.classList.remove('hidden');
}

function hideDataContainer() {
    dataContainer.classList.add('hidden');
}