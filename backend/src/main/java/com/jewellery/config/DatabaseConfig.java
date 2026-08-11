package com.jewellery.config;

import java.net.URI;
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

        if (url != null && !url.isBlank()) {
            log.info("Parsing database connection URL from environment variable");
            if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
                try {
                    URI uri = new URI(url);
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();
                    if (path != null && path.startsWith("/")) {
                        path = path.substring(1);
                    }
                    if (uri.getUserInfo() != null) {
                        String[] userInfo = uri.getUserInfo().split(":");
                        username = userInfo[0];
                        if (userInfo.length > 1) {
                            password = userInfo[1];
                        }
                    }
                    String query = uri.getQuery();
                    url = "jdbc:postgresql://" + host + ":" + port + "/" + path;
                    if (query != null && !query.isBlank()) {
                        url += "?" + query;
                    } else {
                        url += "?sslmode=require";
                    }
                } catch (Exception e) {
                    log.warn("Could not parse DATABASE_URL URI, converting prefix fallback", e);
                    if (url.startsWith("postgres://")) {
                        url = "jdbc:postgresql://" + url.substring("postgres://".length());
                    } else if (url.startsWith("postgresql://")) {
                        url = "jdbc:postgresql://" + url.substring("postgresql://".length());
                    }
                }
            } else if (!url.startsWith("jdbc:")) {
                url = "jdbc:" + url;
            }
        } else {
            url = "jdbc:postgresql://" + dbHost + ":" + dbPort + "/" + dbName;
        }

        log.info("Database DataSource configured cleanly.");

        return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(url)
                .username(username)
                .password(password)
                .build();
    }
}
