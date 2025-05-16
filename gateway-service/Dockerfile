# ---------- Stage 1: Build the JAR ----------
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies first (leveraging Docker cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source and build the app
COPY src ./src
RUN mvn clean package -DskipTests

# ---------- Stage 2: Runtime Image ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application's port
EXPOSE 8765

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
