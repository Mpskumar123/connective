# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and env file
COPY . .
COPY .env.production .env

# Build the React app
RUN npm run build

# Stage 2: Serve the build with a lightweight server
FROM node:18-alpine

# Install 'serve' to serve the static site
RUN npm install -g serve

# Copy the build output
COPY --from=builder /app/build /app/build

WORKDIR /app

EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "build", "-l", "3000"]
