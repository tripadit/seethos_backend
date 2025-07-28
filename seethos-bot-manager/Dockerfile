# pull official base image
FROM python:3.11.5-slim

# set working directory
WORKDIR /code

# copy and install requirements
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# copy project
COPY . /code


EXPOSE 5000

# run server
CMD ["python", "main.py"]
