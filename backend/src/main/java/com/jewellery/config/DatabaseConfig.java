package com.jewellery.config;

import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${SPRING_DATASOURCE_URL:${DATABASE_URL:}}")
    private String databaseUrl;

    @Value("${DB_HOST:localhost}")
    private String dbHost;

    @Value("${DB_PORT:5432}")
    private String dbPort;

    @Value("${DB_NAME:ecommerce_db}")
    private String dbName;

    @Value("${DB_USERNAME:postgres}")
    private String dbUsername;

    @Value("${DB_PASSWORD:postgres}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = databaseUrl;
        String username = dbUsername;
        String password = dbPassword;

        if (url != null && (url.contains("aivencloud.com") || url.contains("onrender.com") || url.contains("render.com") || url.contains("postgresql"))) {
            log.info("Parsing cloud PostgreSQL database connection string");
            
            String clean = url.trim();
            if (clean.startsWith("jdbc:postgresql://")) {
                clean = clean.substring("jdbc:postgresql://".length());
            } else if (clean.startsWith("postgres://")) {
                clean = clean.substring("postgres://".length());
            } else if (clean.startsWith("postgresql://")) {
                clean = clean.substring("postgresql://".length());
            }

            if (clean.contains("@")) {
                int lastAt = clean.lastIndexOf("@");
                String creds = clean.substring(0, lastAt);
                clean = clean.substring(lastAt + 1);

                int colonIdx = creds.indexOf(":");
                if (colonIdx != -1) {
                    username = creds.substring(0, colonIdx);
                    password = creds.substring(colonIdx + 1);
                } else {
                    username = creds;
                }
            }

            String queryParams = "sslmode=require";
            if (clean.contains("?")) {
                int questionIdx = clean.indexOf("?");
                queryParams = clean.substring(questionIdx + 1);
                clean = clean.substring(0, questionIdx);
            }

            String host = dbHost;
            String port = dbPort;
            String db = dbName;

            if (clean.contains("/")) {
                int slashIdx = clean.indexOf("/");
                String hostPort = clean.substring(0, slashIdx);
                db = clean.substring(slashIdx + 1);

                if (hostPort.contains(":")) {
                    int colonIdx = hostPort.lastIndexOf(":");
                    host = hostPort.substring(0, colonIdx);
                    port = hostPort.substring(colonIdx + 1);
                } else if (!hostPort.isBlank()) {
                    host = hostPort;
                    port = "5432";
                }
            }

            url = "jdbc:postgresql://" + host + ":" + port + "/" + db + "?" + queryParams;
            log.info("Configured PostgreSQL DataSource for host: {}", host);

            return DataSourceBuilder.create()
                    .driverClassName("org.postgresql.Driver")
                    .url(url)
                    .username(username)
                    .password(password)
                    .build();
        }

        // Local MySQL Server 8.0 configuration
        log.info("Configuring local MySQL Server 8.0 DataSource for ecommerce_db on port 3306");
        return DataSourceBuilder.create()
                .driverClassName("com.mysql.cj.jdbc.Driver")
                .url("jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC")
                .username("root")
                .password("Naveen@0987")
                .build();
    }
}
