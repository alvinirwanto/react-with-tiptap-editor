# Stage 1: Build the React app using Node.js
FROM node:18.7.0-buster-slim as build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the app using a lightweight web server (nginx)
# FROM nginx:stable-alpine

RUN apt-get update 
RUN apt-get install -y nginx nginx-common nginx-extras

RUN cp -r /app/dist/* /usr/share/nginx/html
# Remove the default Nginx static assets
RUN rm -rf /etc/nginx/sites-available/* \
    && rm -rf /etc/nginx/sites-enabled/*

# Copy the build output from the previous stage to the Nginx HTML directory
# COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
# Expose port 80 to serve the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
