# Use Node LTS
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 8080

# Start the app
CMD [ "npm", "run", "start:dev" ]
