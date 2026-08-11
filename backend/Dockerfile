# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy files
COPY . .

# Build application regardless of root directory path
RUN if [ -f "pom.xml" ]; then \
      mvn clean package -DskipTests; \
    elif [ -f "backend/pom.xml" ]; then \
      cd backend && mvn clean package -DskipTests && mkdir -p /app/target && cp target/*.jar /app/target/; \
    fi

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
