# Country Data Dashboard - Setup Instructions

This application works both as a Chrome extension and as a web application accessible via AWS instance.

## Quick Setup

### 1. Configuration

**For Chrome Extension:**
- No configuration needed - uses localhost (127.0.0.1:5000)
- Make sure Flask server is running locally

**For Web Application:**
- No configuration needed - uses relative URLs
- Deploy to AWS instance for remote access

### 2. Deploy to AWS

1. Upload all files to your AWS instance
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables: `cp env.example .env`
4. Add your Gemini API key to `.env` file
5. Run the application: `python app.py`

### 3. Install Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this folder
4. The extension will now appear in your Chrome toolbar

## Usage

### Chrome Extension
- Click the extension icon in Chrome toolbar
- Select a country from the dropdown
- Click "Get Details" to fetch country data
- View data in table or JSON format

### Web Application
- Navigate to `http://your-aws-ip:5000`
- Select a country from the dropdown
- Click "Get Country Details" to fetch data
- View data in table or JSON format with syntax highlighting

## Features

- **Dual Context Support**: Works as both Chrome extension and web app
- **Country Selection**: Choose from 50+ countries
- **Data Display**: View data in table or JSON format
- **AI Integration**: Uses Gemini AI for real-time data (with fallback to sample data)
- **Responsive Design**: Works on desktop and mobile devices

## File Structure

```
country-data/
├── app.py                 # Flask backend server
├── popup.html            # Chrome extension popup
├── popup.js              # Chrome extension JavaScript
├── manifest.json         # Chrome extension manifest
├── templates/
│   └── index.html        # Web application template
├── static/
│   ├── script.js         # Web application JavaScript
│   └── style.css         # Web application styles
├── config.js             # Configuration file
├── requirements.txt      # Python dependencies
└── SETUP_INSTRUCTIONS.md # This file
```

## Troubleshooting

### Chrome Extension Issues
- Make sure the Flask server is running locally on port 5000
- Check that localhost:5000 is accessible
- Verify manifest.json permissions include localhost

### Web Application Issues
- Ensure Flask server is running on port 5000
- Check that all dependencies are installed
- Verify Gemini API key is set in `.env` file

### API Issues
- Test API directly: `python test_country_api.py`
- Check API key: `python test_api_key.py`
- Verify server logs for error messages
