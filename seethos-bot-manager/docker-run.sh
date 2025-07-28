#!/bin/bash -e 

docker build -f Dockerfile -t seethoschatbotai-bot-manager:latest .

docker container rm -f seethoschatbotai-bot-manager || true
docker image prune -f

docker run -d --network frontend --env-file ./.env --memory="2g" --cpus="1" --name seethoschatbotai-bot-manager seethoschatbotai-bot-manager:latest
