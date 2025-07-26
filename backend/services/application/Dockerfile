# Use a Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Create directory for uploads and ensure Node.js user has permissions
RUN mkdir -p uploads/resumes && chmod -R 777 uploads

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the service runs on
EXPOSE 3003

# Command to run the application
CMD ["node", "server.js"]