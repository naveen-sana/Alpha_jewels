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

    @Value("${DB_PORT:3306}")
    private String dbPort;

    @Value("${DB_NAME:ecommerce_db}")
    private String dbName;

    @Value("${DB_USERNAME:root}")
    private String dbUsername;

    @Value("${DB_PASSWORD:}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = databaseUrl;
        String username = dbUsername;
        String password = dbPassword;

        // If cloud/Aiven MySQL URL is supplied via environment variable
        if (url != null && !url.trim().isEmpty()) {
            String cleanUrl = url.trim();
            log.info("Configuring MySQL DataSource from SPRING_DATASOURCE_URL/DATABASE_URL environment variable");

            if (cleanUrl.startsWith("mysql://")) {
                cleanUrl = "jdbc:" + cleanUrl;
            }

            // Normalize SSL parameters for MySQL Connector/J (sslMode=REQUIRED / useSSL=true)
            cleanUrl = cleanUrl.replaceAll("(?i)sslmode=", "sslMode=")
                               .replaceAll("(?i)ssl-mode=", "sslMode=");

            return DataSourceBuilder.create()
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .url(cleanUrl)
                    .username(username)
                    .password(password)
                    .build();
        }

        // Local MySQL Server 8.0 DataSource configuration
        log.info("Configuring local MySQL Server 8.0 DataSource for ecommerce_db on port {}", dbPort);
        String localUrl = "jdbc:mysql://" + dbHost + ":" + dbPort + "/" + dbName + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        return DataSourceBuilder.create()
                .driverClassName("com.mysql.cj.jdbc.Driver")
                .url(localUrl)
                .username(username)
                .password(password)
                .build();
    }
}

