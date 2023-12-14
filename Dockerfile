FROM node:14

WORKDIR /app

# Install any dependencies
COPY package*.json ./
RUN npm install
RUN npx playwright install 
# Copy the current directory contents into the container at /app
COPY . /app

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run app.js when the container launches
CMD ["npm", "test"]
RUN npx playwright show-report
