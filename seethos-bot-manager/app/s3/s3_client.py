import boto3
from botocore.exceptions import NoCredentialsError

from app.config import settings


class S3Client:

    def __init__(self):
        # Create an S3 client with the provided credentials
        self.s3_client = boto3.client('s3',
                                      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

    # upload file to s3 bucket
    def upload_file_to_s3(self, file_name, json_file):
        try:
            print(f"Uploading {file_name} to bucket {settings.BUCKET_NAME}")
            content_type = 'application/octet-stream' if file_name.endswith('.pkl') else 'application/json'
            self.s3_client.put_object(Bucket=settings.BUCKET_NAME, Key=file_name, Body=json_file,
                                      ContentType=content_type)
            file_url = f"https://s3.{settings.AWS_REGION}.amazonaws.com/{settings.BUCKET_NAME}/{file_name}"
            return file_url
        except NoCredentialsError:
            print("Credentials not available")
            raise  # Re-raise the exception
        except Exception as e:
            print(f"S3 Upload Error: {e}")
            import traceback
            traceback.print_exc()
            raise


s3client = S3Client()
