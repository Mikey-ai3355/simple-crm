# syntax=docker/dockerfile:1

# ---- Build stage: compile the Spring Boot jar ----
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the build descriptor first to keep the dependency layer cached
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Copy sources and build the executable jar
COPY src ./src
# devtools is a dev-only aid; exclude it from the boot jar
RUN mvn -B -q package -DskipTests -Dmaven.test.skip=true

# ---- Run stage: minimal JRE ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Run as a non-root user
RUN useradd -m appuser

COPY --from=build /app/target/simple-crm-0.0.1-SNAPSHOT.jar app.jar

USER appuser
EXPOSE 8080

# Spring reads PORT (default 8080); health check at /health
ENTRYPOINT ["java", "-jar", "app.jar"]
