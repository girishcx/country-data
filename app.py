import os
import json
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app) 

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Validate API key and test connection
USE_AI = False
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Test the API key by making a simple request
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        test_response = model.generate_content("Hello")
        USE_AI = True
        print("✅ Gemini API configured successfully!")
        print("🤖 Using AI-generated real-time data")
    except Exception as e:
        USE_AI = False
        print(f"⚠️  Gemini API configuration failed: {e}")
        print("📊 Using sample data for demo purposes")
else:
    print("⚠️  No Gemini API key found in environment variables")
    print("📊 Using sample data for demo purposes")
    print("💡 Run 'python setup_api_key.py' to configure your API key")

print("🚀 Starting Country Data Flask Server...")
print("🌐 Server will run on: http://0.0.0.0:5000")
print("📱 Web Interface: http://your-aws-ip:5000")
print("=" * 50)

@app.route('/')
def index():
    """Serve the main web interface"""
    return render_template('index.html')

@app.route('/get_country_data', methods=['POST'])
def get_country_data():
    """
    An endpoint to get country data using Gemini AI or sample data.
    """
    data = request.json
    if not data:
        return jsonify({'error': 'Request body is required'}), 400
        
    country_name = data.get('countryName')

    if not country_name:
        return jsonify({'error': 'Country name is required'}), 400

    try:
        if USE_AI:
            return get_ai_country_data(country_name)
        else:
            return get_sample_country_data(country_name)
    except Exception as e:
        app.logger.error(f"Error fetching data for {country_name}: {e}")
        return jsonify({'error': 'An internal error occurred'}), 500

def get_ai_country_data(country_name):
    """
    Get country data using Gemini AI
    """
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction="You are an expert on world demographics, economics, and corporate information. Provide accurate and up-to-date data for the requested country including the largest/most valuable company and its financial performance for 2024. Use your training data to provide the most current information available."
        )
        
        user_query = f"""Provide the following data for the country {country_name} in a JSON format with the keys: 'country', 'gdp', 'population', 'top_company', 'company_revenue', and 'company_profit'. 
        
        Requirements:
        - also include country selected
        - Use the most current and accurate data available
        - GDP should include the currency and year (e.g., "$25.5 trillion (2023)")
        - Population should include the year (e.g., "331.9 million (2023)")
        - top_company: Name of the largest/most valuable company in the country
        - company_revenue: Annual revenue for 2024 with currency (e.g., "$500 billion (2024)")
        - company_profit: Annual profit for 2024 with currency (e.g., "$50 billion (2024)")
        - Return only valid JSON, no additional text"""
        
        response = model.generate_content(
            contents=[user_query],
            generation_config={
                "response_mime_type": "application/json",
                "response_schema": {
                    "type": "OBJECT",
                    "properties": {
                        "country": { "type": "STRING" },
                        "gdp": { "type": "STRING" },
                        "population": { "type": "STRING" },
                        "top_company": { "type": "STRING" },
                        "company_revenue": { "type": "STRING" },
                        "company_profit": { "type": "STRING" }
                    }
                }
            }
        )
        
        # The content part contains the JSON string
        json_data = response.text
        
        # Validate that we got a proper response
        if not json_data or json_data.strip() == '':
            raise Exception("No data received from Gemini API")
        
        # Parse and validate JSON
        parsed_data = json.loads(json_data)
        
        # Ensure all required fields are present
        required_fields = ['country', 'gdp', 'population', 'top_company', 'company_revenue', 'company_profit']
        for field in required_fields:
            if field not in parsed_data:
                parsed_data[field] = "N/A"
        
        print(parsed_data)
        
        return jsonify(parsed_data), 200

    except json.JSONDecodeError as e:
        app.logger.error(f"JSON decode error for {country_name}: {e}")
        return jsonify({'error': 'Invalid JSON response from AI'}), 500

def get_sample_country_data(country_name):
    """
    Get sample country data when AI is not available
    """
    # Sample data for demonstration
    sample_data = {
        "United States": {
            "country": "United States",
            "gdp": "$25.5 trillion (2023)",
            "population": "331.9 million (2023)",
            "top_company": "Apple Inc.",
            "company_revenue": "$383.3 billion (2024)",
            "company_profit": "$97.0 billion (2024)"
        },
        "China": {
            "country": "China",
            "gdp": "$17.7 trillion (2023)",
            "population": "1.4 billion (2023)",
            "top_company": "Tencent Holdings",
            "company_revenue": "$86.2 billion (2024)",
            "company_profit": "$20.1 billion (2024)"
        },
        "Japan": {
            "country": "Japan",
            "gdp": "$4.2 trillion (2023)",
            "population": "125.1 million (2023)",
            "top_company": "Toyota Motor Corporation",
            "company_revenue": "$279.4 billion (2024)",
            "company_profit": "$18.1 billion (2024)"
        },
        "Germany": {
            "country": "Germany",
            "gdp": "$4.3 trillion (2023)",
            "population": "83.2 million (2023)",
            "top_company": "Volkswagen Group",
            "company_revenue": "$322.3 billion (2024)",
            "company_profit": "$15.8 billion (2024)"
        },
        "India": {
            "country": "India",
            "gdp": "$3.7 trillion (2023)",
            "population": "1.4 billion (2023)",
            "top_company": "Reliance Industries",
            "company_revenue": "$108.8 billion (2024)",
            "company_profit": "$8.1 billion (2024)"
        },
        "United Kingdom": {
            "country": "United Kingdom",
            "gdp": "$3.1 trillion (2023)",
            "population": "67.3 million (2023)",
            "top_company": "Shell plc",
            "company_revenue": "$316.6 billion (2024)",
            "company_profit": "$28.4 billion (2024)"
        },
        "France": {
            "country": "France",
            "gdp": "$2.9 trillion (2023)",
            "population": "68.0 million (2023)",
            "top_company": "LVMH",
            "company_revenue": "$93.1 billion (2024)",
            "company_profit": "$16.5 billion (2024)"
        },
        "Brazil": {
            "country": "Brazil",
            "gdp": "$2.1 trillion (2023)",
            "population": "215.3 million (2023)",
            "top_company": "Petrobras",
            "company_revenue": "$124.3 billion (2024)",
            "company_profit": "$26.9 billion (2024)"
        },
        "Italy": {
            "country": "Italy",
            "gdp": "$2.1 trillion (2023)",
            "population": "59.0 million (2023)",
            "top_company": "Enel",
            "company_revenue": "$95.2 billion (2024)",
            "company_profit": "$3.8 billion (2024)"
        },
        "Canada": {
            "country": "Canada",
            "gdp": "$2.1 trillion (2023)",
            "population": "38.2 million (2023)",
            "top_company": "Shopify",
            "company_revenue": "$5.6 billion (2024)",
            "company_profit": "$0.3 billion (2024)"
        }
    }
    
    # Return sample data if available, otherwise return a generic response
    if country_name in sample_data:
        return jsonify(sample_data[country_name]), 200
    else:
        return jsonify({
            "country": country_name,
            "gdp": "N/A",
            "population": "N/A",
            "top_company": "N/A",
            "company_revenue": "N/A",
            "company_profit": "N/A"
        }), 200


if __name__ == '__main__':
    # For production deployment, set debug=False
    debug_mode = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)

