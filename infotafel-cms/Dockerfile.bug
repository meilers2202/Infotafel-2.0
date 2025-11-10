FROM node:20

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install dependencies BEFORE copying the rest of the code
RUN npm install 

# Now copy the rest of the application code
COPY . .

EXPOSE 1337

CMD ["npm", "start"] 