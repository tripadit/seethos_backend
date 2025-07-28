import os
import boto3
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv("/Users/adittripathi/Desktop/seethos_backend/seethos-bot-manager/.env")

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

print(f"AWS_ACCESS_KEY_ID: {AWS_ACCESS_KEY_ID}")
print(f"BUCKET_NAME: {BUCKET_NAME}")
print(f"AWS_REGION: {AWS_REGION}")

if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET_NAME, AWS_REGION]):
    print("Error: Missing one or more AWS environment variables.")
    exit(1)

try:
    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )

    file_name = "test_upload_gemini.txt"
    file_content = "This is a test file uploaded by Gemini."

    s3_client.put_object(Bucket=BUCKET_NAME, Key=file_name, Body=file_content)
    print(f"Successfully uploaded {file_name} to s3://{BUCKET_NAME}/{file_name}")

except Exception as e:
    print(f"S3 Upload Test Failed: {e}")
    import traceback
    traceback.print_exc()
