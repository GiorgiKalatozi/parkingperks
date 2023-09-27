FROM node:16

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Copy source code into container
COPY . .

# Build the NestJS app
RUN yarn run build


# the port  Nest.js application will run on
EXPOSE 3000

# Start your Nest.js application
CMD ["yarn", "start:prod"]