# Use a Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching
# and install dependencies before copying app code
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the service runs on
EXPOSE 5001

# Command to run the application
CMD ["node", "server.js"]