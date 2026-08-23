# ---- Etapa 1: build com Maven + JDK 17 ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copia primeiro o pom.xml para aproveitar cache de dependências
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copia o restante do código e builda o jar (sem rodar os testes)
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---- Etapa 2: imagem final, só com o JRE ----
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/target/app.jar app.jar

# Render injeta a variável PORT; a aplicação já está configurada para usá-la
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
