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

# Environment variables (will be overridden by Render render.yaml)
ENV PORT=9000
ENV NODE_ENV=production
ENV STUDENT_BASE=https://miniprojectidl-13.onrender.com/api
ENV COURSE_BASE=https://mini-project-backend11.onrender.com/api
ENV AI_BASE=http://localhost:8002/api

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "index.js"]
