# Use Node.js LTS
FROM node:lts

# Set working directory
WORKDIR /app

# Install yarn
RUN corepack enable

# Copy package files and yarn configuration
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY packages/site/package.json ./packages/site/
COPY packages/snap/package.json ./packages/snap/

# Enable scripts (required for sharp package)
#RUN yarn plugin import @yarnpkg/plugin-allow-scripts
#RUN yarn config set enableScripts true

# Install dependencies
RUN yarn install

# Copy source files
COPY . .

# RUN yarn mm-snap manifest --fix

# Build the project
RUN yarn build


# Start the development server - listen on all interfaces
# CMD ["yarn", "start", "--host", "0.0.0.0"]

# # Create a script to run both services
# TODO: this is weird, it properly starts the site server but it tells to get the snap from http://localhost:8080
# Easy way to bypass it is socat TCP4-LISTEN:8080,fork TCP4-CONNECT:IP:8080
RUN echo '#!/bin/sh\ncd packages/site && yarn start --host 0.0.0.0 & cd packages/snap && yarn start & wait' > /app/start.sh
RUN chmod +x /app/start.sh

# Start both services
CMD ["/app/start.sh"]
