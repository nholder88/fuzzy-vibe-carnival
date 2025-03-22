FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3003

# Create a startup script that seeds the database then starts the service
RUN echo '#!/bin/sh\nnpm run seed && npm run start:prod' > /app/startup.sh && \
    chmod +x /app/startup.sh

CMD ["/app/startup.sh"] 