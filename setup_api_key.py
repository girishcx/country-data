#!/usr/bin/env python3
"""
Setup script to configure Gemini API key
"""

import os

def setup_api_key():
    print("=" * 60)
    print("🔑 GEMINI API KEY SETUP")
    print("=" * 60)
    print()
    print("To use real-time AI-generated country data, you need a Gemini API key.")
    print()
    print("Steps to get your API key:")
    print("1. Go to: https://makersuite.google.com/app/apikey")
    print("2. Sign in with your Google account")
    print("3. Click 'Create API Key'")
    print("4. Copy the API key (starts with 'AIza...')")
    print()
    
    api_key = input("Enter your Gemini API key (or press Enter to skip): ").strip()
    
    if api_key:
        # Create .env file
        with open('.env', 'w') as f:
            f.write(f"GEMINI_API_KEY={api_key}\n")
        
        print()
        print("✅ API key saved to .env file")
        print("🤖 Your extension will now use AI-generated data!")
        print()
        print("Next steps:")
        print("1. Restart the Flask server: python app.py")
        print("2. Test your Chrome extension")
    else:
        print()
        print("⏭️  Skipped API key setup")
        print("📊 Your extension will use sample data")
        print("💡 You can set up the API key later by running this script again")
    
    print("=" * 60)

if __name__ == "__main__":
    setup_api_key()
