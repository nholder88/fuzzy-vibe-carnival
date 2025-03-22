FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3003

# Create an entry point script
RUN echo "#!/bin/sh" > /app/start.sh && \
    echo "npm run seed" >> /app/start.sh && \
    echo "npm run start:prod" >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/bin/sh", "/app/start.sh"] 