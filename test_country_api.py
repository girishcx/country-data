#!/usr/bin/env python3
"""
Test the country data API with Gemini integration
"""

import requests
import json

def test_country_api():
    url = "http://127.0.0.1:5000/get_country_data"
    data = {"countryName": "United States"}
    
    try:
        print("Testing Country Data API with Gemini...")
        print(f"Requesting data for: {data['countryName']}")
        
        response = requests.post(url, json=data)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            country_data = response.json()
            print("✅ API is working!")
            print("Country Data:")
            for key, value in country_data.items():
                print(f"  {key}: {value}")
        else:
            print(f"❌ API Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Flask server is not running")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_country_api()
