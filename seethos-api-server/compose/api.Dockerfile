FROM python:3.11-slim

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_DISABLE_PIP_VERSION_CHECK 1

# Required for pipenv to build properly
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV TZ="Asia/Kathmandu"


# install required packages
RUN apt-get -y update
RUN apt-get --yes --force-yes install poppler-utils postgresql-client cron


# start cronjob service as root
RUN service cron start

# define working directory
WORKDIR /opt
COPY requirements.txt ./

# upgrade pip and install requirements
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# copy necessary files
COPY . .

# expose used port
EXPOSE 8008


# entrypoint
ENTRYPOINT [ "/bin/bash", "-e", "docker-entrypoint.sh" ]