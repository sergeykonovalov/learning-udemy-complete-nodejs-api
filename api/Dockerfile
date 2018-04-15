# Use Alpine version of Node
FROM node:slim

# Create application directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package file and install dependecies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . /usr/src/app

# Expose port 8080
EXPOSE 8080

# Set default command to execute container
CMD ["npm", "start"]