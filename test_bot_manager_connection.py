import requests
import os
from dotenv import load_dotenv

load_dotenv("/Users/adittripathi/Desktop/seethos_backend/seethos-api-server/.env")

INTG_BASE_URL = os.getenv("INTG_BASE_URL")

if not INTG_BASE_URL:
    print("Error: INTG_BASE_URL not found in .env")
    exit(1)

print(f"Attempting to connect to seethos-bot-manager at: {INTG_BASE_URL}")

try:
    # Assuming seethos-bot-manager has a root endpoint that returns something
    response = requests.get(INTG_BASE_URL)
    response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
    print(f"Successfully connected to seethos-bot-manager. Status Code: {response.status_code}")
    print(f"Response content: {response.text}")
except requests.exceptions.ConnectionError as e:
    print(f"Connection Error: Could not connect to seethos-bot-manager at {INTG_BASE_URL}. Is it running?")
    print(f"Error details: {e}")
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: Received {e.response.status_code} from seethos-bot-manager at {INTG_BASE_URL}")
    print(f"Response content: {e.response.text}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
    import traceback
    traceback.print_exc()