FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma migrate dev
EXPOSE 8000
RUN npm run build

CMD [ "node", "dist/index.js" ]

# # Apply migrations at container startup instead of build time
# # CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]


# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# # Build the project
# RUN npm run build

# EXPOSE 8000

# # Run migrations on container startup, then start the app
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
