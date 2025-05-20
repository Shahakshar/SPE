# Use a minimal base image with Java 17
FROM eclipse-temurin:17-jdk-alpine

# Set working directory in container
WORKDIR /app

# Copy the jar from local target directory
COPY target/authenticationandauthorizationmicroservice-0.0.1.jar app.jar

# Expose the application's port
EXPOSE 3001

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
