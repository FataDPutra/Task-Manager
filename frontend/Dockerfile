FROM node:20-alpine

WORKDIR /app

# Copy source code (jika ada)
COPY src/ .

# If package.json exists, install dependencies
RUN if [ -f package.json ]; then \
    npm install; \
    else \
    echo "No package.json found, will install later"; \
    fi

# Expose port
EXPOSE 3000

# Start command will be overridden by docker-compose
CMD ["npm", "start"]