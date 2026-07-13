"""Test MongoDB connection with updated credentials"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables from parent directory
load_dotenv('../.env')

try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure
    
    MONGO_URI = os.getenv('MONGO_URI')
    DATABASE_NAME = os.getenv('DATABASE_NAME')
    
    print(f"Testing connection to MongoDB...")
    print(f"Database: {DATABASE_NAME}")
    print(f"Cluster: lumina-beauty.uui8gg2.mongodb.net")
    print("-" * 50)
    
    # Attempt connection
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    
    print("[SUCCESS] ✓ MongoDB connection successful!")
    
    # Test database access
    db = client[DATABASE_NAME]
    collection = db['analysis_requests']
    
    # Check if we can access the collection
    count = collection.count_documents({})
    print(f"[SUCCESS] ✓ Database '{DATABASE_NAME}' accessible")
    print(f"[INFO] Current analysis_requests count: {count}")
    
    # Test write permission
    test_doc = {"test": "connection_check", "timestamp": "test"}
    result = collection.insert_one(test_doc)
    collection.delete_one({"_id": result.inserted_id})
    print("[SUCCESS] ✓ Write permissions confirmed")
    
    print("-" * 50)
    print("All database checks passed! ✓")
    
    client.close()
    sys.exit(0)
    
except ConnectionFailure as e:
    print(f"[ERROR] ✗ MongoDB connection failed: {e}")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] ✗ Unexpected error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
