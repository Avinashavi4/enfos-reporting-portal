# Build stage — compiles the jar inside the image so the reviewer needs no
# local JDK or Maven. Dependencies are resolved before the source is copied,
# so code changes don't invalidate the (slow) dependency layer.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests

# Runtime stage — JRE only, no build tooling in the final image.
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/reporting-api-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
