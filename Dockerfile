FROM node:17

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 80
EXPOSE 8443
CMD [ "npm", "run", "dev" ]