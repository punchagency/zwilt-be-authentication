
FROM node:24.11.0

WORKDIR /app
 
COPY package*.json ./

COPY . .

RUN npm install

ENV Port = 3000

EXPOSE 3000

CMD ["npm" , "start"]