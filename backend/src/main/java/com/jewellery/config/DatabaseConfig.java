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

            // Handle user:pass@host format in mysql:// or jdbc:mysql:// URLs
            if (cleanUrl.contains("@")) {
                try {
                    String raw = cleanUrl;
                    if (raw.startsWith("jdbc:")) raw = raw.substring(5);
                    if (raw.startsWith("mysql://")) raw = raw.substring(8);

                    int atIdx = raw.indexOf("@");
                    String userInfo = raw.substring(0, atIdx);
                    String hostAndParams = raw.substring(atIdx + 1);

                    String parsedUser = userInfo;
                    String parsedPass = "";
                    if (userInfo.contains(":")) {
                        parsedUser = userInfo.substring(0, userInfo.indexOf(":"));
                        parsedPass = userInfo.substring(userInfo.indexOf(":") + 1);
                    }

                    String formattedUrl = "jdbc:mysql://" + hostAndParams;
                    formattedUrl = formattedUrl.replaceAll("(?i)sslmode=", "sslMode=")
                                               .replaceAll("(?i)ssl-mode=", "sslMode=");

                    if (!formattedUrl.contains("trustServerCertificate=")) {
                        formattedUrl += (formattedUrl.contains("?") ? "&" : "?") + "trustServerCertificate=true";
                    }
                    if (!formattedUrl.contains("allowPublicKeyRetrieval=")) {
                        formattedUrl += "&allowPublicKeyRetrieval=true";
                    }

                    log.info("Successfully parsed Aiven MySQL URL for user: {}", parsedUser);
                    return DataSourceBuilder.create()
                            .driverClassName("com.mysql.cj.jdbc.Driver")
                            .url(formattedUrl)
                            .username(parsedUser)
                            .password(parsedPass)
                            .build();
                } catch (Exception ex) {
                    log.error("Failed to parse credentials from database URL: {}", ex.getMessage());
                }
            }

            if (cleanUrl.startsWith("mysql://")) {
                cleanUrl = "jdbc:" + cleanUrl;
            }

            cleanUrl = cleanUrl.replaceAll("(?i)sslmode=", "sslMode=")
                               .replaceAll("(?i)ssl-mode=", "sslMode=");

            var builder = DataSourceBuilder.create()
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .url(cleanUrl);

            if (username != null && !username.trim().isEmpty()) {
                builder.username(username);
            }
            if (password != null && !password.trim().isEmpty()) {
                builder.password(password);
            }

            return builder.build();
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

