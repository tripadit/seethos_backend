# pull official base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set working directory
WORKDIR /code

# copy and install requirements
COPY /requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir -r /code/requirements.txt

# copy app in code folder
COPY /app /code/app
COPY /main.py /code/

EXPOSE 80

# run flower for tasks evaluation
CMD ["celery", "-A", "main.celery", "flower", "--port=80"]