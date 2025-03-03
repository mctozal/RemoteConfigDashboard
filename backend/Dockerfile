FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install -g nodemon
RUN npm i
COPY . .
RUN nodemon src/index.ts
CMD ["node", "dist/index.js"]