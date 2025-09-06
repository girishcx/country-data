# Country Data Chrome Extension

A Chrome extension that provides detailed information about countries in JSON format using a Flask backend with sample data.

## Features

- Select from a list of top 10 countries
- Get comprehensive country data including:
  - Country name
  - Continent
  - GDP information
  - Population data
  - Official languages
  - Capital city
- Clean, modern UI with Tailwind CSS
- Dual view modes: Table view and JSON view
- Sample data for immediate testing

## Setup Instructions

### 1. Backend Setup (Flask App)

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the Flask server:
   ```bash
   python app.py
   ```
   The server will start on `http://127.0.0.1:5000` with sample data

### 2. Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select this project folder
4. The extension should now appear in your extensions list

### 3. Usage

1. Click the extension icon in your Chrome toolbar
2. Select a country from the dropdown
3. Click "Get Details" to fetch country information
4. View the data in a clean table format

## Project Structure

```
country-data-extension/
├── app.py              # Flask backend with Gemini AI integration
├── manifest.json       # Chrome extension manifest
├── popup.html          # Extension popup UI
├── popup.js            # Frontend JavaScript logic
├── requirements.txt    # Python dependencies
├── README.md          # This file
└── icons/
    └── icon16.png     # Extension icon
```

## API Endpoints

- `POST /get_country_data` - Fetches country data using Gemini AI
  - Request body: `{"countryName": "Country Name"}`
  - Response: JSON string with country details

## Technologies Used

- **Frontend**: HTML5, CSS3 (Tailwind), JavaScript
- **Backend**: Flask (Python)
- **AI**: Google Gemini 2.5 Flash with Google Search
- **Extension**: Chrome Extension Manifest V3

## Configuration

The extension is configured to communicate with the Flask server running on `http://127.0.0.1:5000`. If you need to change this, update the `FLASK_SERVER_URL` constant in `popup.js`.

## Troubleshooting

1. **Extension not loading**: Make sure the Flask server is running on port 5000
2. **API errors**: Verify your Gemini API key is correctly set in the `.env` file
3. **CORS issues**: The Flask app includes CORS headers for extension communication

## Future Enhancements

- Add more countries to the selection list
- Implement caching for better performance
- Add data export functionality
- Include additional country metrics
- Add dark mode support
