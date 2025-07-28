from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
import os

# The MONGO_URL from your settings.py
MONGO_URL = 'mongodb+srv://adittripathi2020:UpxlvHSRpR7BrtDR@bot.wkxwbnq.mongodb.net/seethos_chat?retryWrites=true&w=majority&appName=Bot'

try:
    print(f"Attempting to connect to MongoDB with URL: {MONGO_URL}")
    client = MongoClient(MONGO_URL)
    
    # The ismaster command is cheap and does not require auth. 
    # It will also trigger the connection to be made.
    client.admin.command('ismaster')
    
    print("Successfully connected to MongoDB!")
    print("Databases:")
    for db_name in client.list_database_names():
        print(f"- {db_name}")

except ConnectionFailure as e:
    print(f"MongoDB Connection Failed: {e}")
    print("Please check your network connection and MongoDB Atlas IP Access List.")
except ConfigurationError as e:
    print(f"MongoDB Configuration Error: {e}")
    print("This often indicates a DNS resolution issue or an incorrect connection string.")
    print("Ensure your MongoDB Atlas connection string is correct and your DNS is working.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
    import traceback
    traceback.print_exc()
finally:
    if 'client' in locals() and client:
        client.close()
        print("MongoDB connection closed.")
