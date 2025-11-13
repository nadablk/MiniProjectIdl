# GraphQL Server Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 9000

# Set environment variables (can be overridden by Render)
ENV PORT=9000
ENV STUDENT_BASE=http://localhost:8081/api
ENV COURSE_BASE=http://localhost:9090/api
ENV AI_BASE=http://localhost:8002/api
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
