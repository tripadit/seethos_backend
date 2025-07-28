# Use official Node image
FROM node:18.18.2-alpine

# Set working directory
WORKDIR /app

# Copy package.json + lock files first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Build the Vite app
ENV NODE_OPTIONS=--max-old-space-size=5120
RUN npm run build

# Overwrite the ai-assistant-component if needed
COPY scripts/ai-assistant-component.dev.js ./dist/bot/ai-assistant-component.js

# Install serve globally
RUN npm install -g serve

# Expose port 3005
EXPOSE 3005

# Serve dist on port 3005
CMD ["serve", "-s", "dist", "-l", "3005"]