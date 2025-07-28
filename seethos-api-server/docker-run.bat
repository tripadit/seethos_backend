@echo off
docker build -f Dockerfile -t duality-api-server:latest .
docker container rm -f duality-api-server || echo "Container not found"
docker image prune -f
docker run -d --network frontend -e VIRTUAL_HOST="https://duality-api.seethos.com; client_max_body_size 100M;" duality-api-server:latest