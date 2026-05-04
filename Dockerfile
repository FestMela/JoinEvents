# Stage 1: Build the Angular application
FROM node:18-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app in production mode
# Note: Ensure the output path in angular.json matches /app/dist/join-events
RUN npm run build -- --configuration production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's default public directory
# REPLACE 'join-events' with the actual project name defined in your angular.json
COPY --from=build /app/dist/join-events /usr/share/nginx/html

# Copy a custom Nginx configuration to handle Angular routing (optional but recommended)
# If you don't have a custom config, Nginx will serve index.html by default
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Inform Cloud Run that the container listens on port 8082
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
