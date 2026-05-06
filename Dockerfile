# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build

# Stage 2: Serve the application using sirv-cli (robust and non-root compatible)
FROM node:20-alpine
WORKDIR /app

# Install sirv-cli for lightweight and robust static file serving
RUN npm install -g sirv-cli

# Copy built files from the build stage
COPY --from=build /app/dist/JoinEvents/browser /app/public

EXPOSE 8080

# sirv-cli respects the PORT env variable and handles SPA routing perfectly with --single
CMD ["sh", "-c", "sirv /app/public --single --port ${PORT:-8080} --host 0.0.0.0"]
