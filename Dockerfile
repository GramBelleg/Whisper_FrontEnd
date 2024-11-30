FROM node:18 AS buildingstage  

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=buildingstage /app/dist /usr/share/nginx/html
 
WORKDIR /etc/nginx/dhparam 

RUN openssl dhparam -out dhparam-2048.pem 2048

EXPOSE 80
EXPOSE 443
