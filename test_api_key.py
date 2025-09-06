#!/usr/bin/env python3
"""
Test the Gemini API key
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_api_key():
    api_key = os.getenv('GEMINI_API_KEY', '') or "AIzaSyBZ0DAeEeFuxSzIRCIfGJpdQKgVOOyUNlM"
    
    print(f"API Key found: {'Yes' if api_key else 'No'}")
    print(f"API Key: {api_key[:20]}..." if api_key else "No key")
    
    if not api_key:
        print("❌ No API key found")
        return False
    
    try:
        genai.configure(api_key=api_key)
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction="You are a helpful assistant."
        )
        
        response = model.generate_content("What is the capital of France? Answer in one word.")
        print("✅ API key is working!")
        print(f"Response: {response.text}")
        return True
        
    except Exception as e:
        print(f"❌ API Error: {e}")
        return False

if __name__ == "__main__":
    test_api_key()
