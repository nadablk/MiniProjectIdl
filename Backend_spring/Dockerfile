# Multi-stage build for Spring Boot backend
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
EXPOSE 8081

# Set environment variables (can be overridden by Render)
ENV SERVER_PORT=8081
ENV SPRING_DATASOURCE_URL=jdbc:mysql://sql7.freesqldatabase.com:3306/sql7807643
ENV SPRING_DATASOURCE_USERNAME=sql7807643
ENV SPRING_DATASOURCE_PASSWORD=dUh4zRXskS





# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
