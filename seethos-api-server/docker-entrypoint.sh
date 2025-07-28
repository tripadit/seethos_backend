#!/bin/bash -e
# enter inside the directory
cd dualityAI/

# run migration first
python manage.py makemigrations
python manage.py migrate 

# run celery first
celery -A dualityAI worker --loglevel=info --concurrency=2 &

# wait for celery to be ready
sleep 10

# celery flower --broker=redis://redis:6379/0 --basic_auth=admin:admin &

# start the server 
exec python manage.py runserver 0.0.0.0:8008