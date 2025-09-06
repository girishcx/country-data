// Web Application - Uses shared.js for unified functionality
// This file is minimal and delegates to the shared implementation

// Web app-specific configuration
const API_ENDPOINT = '/get_country_data';

// List of countries for the web application
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
    'Taiwan',
    'Belgium',
    'Argentina',
    'Ireland',
    'Israel',
    'Norway',
    'United Arab Emirates',
    'Nigeria',
    'South Africa',
    'Bangladesh',
    'Vietnam',
    'Thailand',
    'Egypt',
    'Malaysia',
    'Singapore',
    'Philippines',
    'Chile',
    'Finland',
    'Romania',
    'Czech Republic',
    'New Zealand',
    'Peru',
    'Iraq',
    'Greece',
    'Portugal',
    'Algeria',
    'Kazakhstan',
    'Qatar',
    'Kuwait',
    'Ukraine',
    'Morocco'
];

// DOM elements
let countrySelect, getDetailsBtn, loadingIndicator, errorMessage, dataContainer;
let tableViewBtn, jsonViewBtn, tableView, jsonView, dataTableBody, jsonDisplay, btnText;

// Current view state
let currentView = 'table';
let currentData = null;

// Initialize the application when DOM is loaded
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
    btnText = document.getElementById('btn-text');
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
    
    // Allow Enter key to trigger search
    countrySelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleGetDetails();
        }
    });
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
        showError(`An error occurred while fetching data. Please try again. Error: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
}

async function fetchCountryData(countryName) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            countryName: countryName
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
        row.className = 'table-row';
        
        const keyCell = document.createElement('td');
        keyCell.className = 'py-4 px-6 text-sm font-medium text-gray-900';
        keyCell.textContent = formatKey(key);
        
        const valueCell = document.createElement('td');
        valueCell.className = 'py-4 px-6 text-sm text-gray-700';
        
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
    const formattedJson = JSON.stringify(data, null, 2);
    jsonDisplay.innerHTML = syntaxHighlight(formattedJson);
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function switchView(view) {
    if (view === currentView) return;
    
    currentView = view;
    
    // Update button states
    if (view === 'table') {
        tableViewBtn.className = 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors';
        jsonViewBtn.className = 'px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors';
        tableView.classList.remove('hidden');
        jsonView.classList.add('hidden');
    } else {
        tableViewBtn.className = 'px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors';
        jsonViewBtn.className = 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors';
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
        btnText.textContent = 'Loading...';
        loadingIndicator.classList.remove('hidden');
        getDetailsBtn.classList.add('loading-pulse');
    } else {
        getDetailsBtn.disabled = false;
        btnText.textContent = 'Get Country Details';
        loadingIndicator.classList.add('hidden');
        getDetailsBtn.classList.remove('loading-pulse');
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
    // Add animation
    dataContainer.style.opacity = '0';
    dataContainer.style.transform = 'translateY(20px)';
    setTimeout(() => {
        dataContainer.style.opacity = '1';
        dataContainer.style.transform = 'translateY(0)';
    }, 100);
}

function hideDataContainer() {
    dataContainer.classList.add('hidden');
}
