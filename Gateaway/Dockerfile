# Multi-stage build for Spring Cloud Gateway
FROM maven:3.9-eclipse-temurin-21 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage - Use full JRE instead of Alpine for better compatibility
FROM eclipse-temurin:21-jre

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 9091

# Set environment variables
ENV SERVER_PORT=9091
ENV GRAPHQL_SERVICE_URL=https://graphql-service-qzpq.onrender.com/graphql

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9091/gateway/health || exit 1

# Run the application with optimized JVM settings for Render free tier
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
