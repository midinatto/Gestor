# ---- Estágio 1: build ----
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Cache de dependências
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Código + build
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---- Estágio 2: runtime ----
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
