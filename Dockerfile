FROM node:20-alpine

# Install curl, bash, and git for network benchmarking and runtime utilities
RUN apk add --no-cache curl bash git

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build standalone runner bundle and Inngest server
RUN npm run build

# Expose HTTP port for Railway health checks and Inngest endpoints
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

# Start Inngest worker server
CMD ["node", "dist/server.js"]
