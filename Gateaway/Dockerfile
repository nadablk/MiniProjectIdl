# Multi-stage build for Spring Cloud Gateway
FROM maven:3.9-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 9091

# Set environment variables (can be overridden by Render)
ENV SERVER_PORT=9091
ENV GRAPHQL_SERVICE_URL=https://graphql-service-qzpq.onrender.com
# ENV STUDENT_SERVICE_URL=http://localhost:8081
# ENV COURSE_SERVICE_URL=http://localhost:9090
# ENV CHATBOT_SERVICE_URL=http://localhost:8002

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

