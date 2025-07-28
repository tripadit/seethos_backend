## pull official base image
FROM node:18.18.2-alpine

RUN npm install -g serve

# set working directory
WORKDIR /app

COPY --chown=root docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY dist/ ./dist

COPY scripts/ai-assistant-component.prod.js ./dist/bot/ai-assistant-component.js


EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]