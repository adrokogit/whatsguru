# Version for ARM
FROM node:18-bullseye-slim

# Install chromium and puppeterr dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Environment variables for Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Command to run the application
CMD [ "npm", "run", "start" ]