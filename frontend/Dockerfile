FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY src/package*.json ./

# Install dependencies (akan di-override oleh volume, tapi ini untuk initial build)
RUN npm install

# Expose port
EXPOSE 3000

# Start command dengan install dependencies jika belum ada
CMD sh -c "npm install && npm start"