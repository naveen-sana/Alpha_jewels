package com.jewellery.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired(required = false)
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            seedTablesAndProducts();
            seedUsers();
        } catch (Exception e) {
            System.err.println("DatabaseSeeder error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void seedUsers() {
        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS `users` (" +
                    "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                    "email VARCHAR(255) NOT NULL UNIQUE, " +
                    "full_name VARCHAR(255), " +
                    "phone VARCHAR(50), " +
                    "password VARCHAR(255) NOT NULL, " +
                    "role VARCHAR(50) DEFAULT 'USER'" +
                    ")");
            try { jdbcTemplate.execute("ALTER TABLE `users` ADD COLUMN `full_name` VARCHAR(255)"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("ALTER TABLE `users` ADD COLUMN `phone` VARCHAR(50)"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("ALTER TABLE `users` ADD COLUMN `role` VARCHAR(50) DEFAULT 'USER'"); } catch (Exception ignored) {}
            try { jdbcTemplate.execute("DELETE t1 FROM `users` t1 INNER JOIN `users` t2 WHERE t1.id > t2.id AND LOWER(t1.email) = LOWER(t2.email)"); } catch (Exception ignored) {}
        } catch (Exception ignored) {}

        // Ensure admin@gmail.com exists as ADMIN
        try {
            List<Integer> countAdmin = jdbcTemplate.queryForList("SELECT 1 FROM `users` WHERE LOWER(email) = LOWER('admin@gmail.com')", Integer.class);
            if (countAdmin.isEmpty() && passwordEncoder != null) {
                String hashedPass = passwordEncoder.encode("admin");
                jdbcTemplate.update("INSERT INTO `users` (email, full_name, password, role) VALUES ('admin@gmail.com', 'System Admin', ?, 'ADMIN')", hashedPass);
            }
        } catch (Exception ignored) {}

        // Ensure naveensana66028@gmail.com exists as ADMIN
        String targetEmail = "naveensana66028@gmail.com";
        try {
            List<Integer> count = jdbcTemplate.queryForList("SELECT 1 FROM `users` WHERE LOWER(email) = LOWER(?)", Integer.class, targetEmail);
            if (count.isEmpty() && passwordEncoder != null) {
                String defaultAdminPass = System.getenv("ADMIN_PASSWORD") != null ? System.getenv("ADMIN_PASSWORD") : "Admin@123456";
                String hashedPass = passwordEncoder.encode(defaultAdminPass);
                jdbcTemplate.update("INSERT INTO `users` (email, full_name, password, role) VALUES (?, 'Naveen Sana', ?, 'ADMIN')", targetEmail, hashedPass);
            } else if (!count.isEmpty()) {
                jdbcTemplate.update("UPDATE `users` SET role = 'ADMIN' WHERE LOWER(email) = LOWER(?)", targetEmail);
            }
        } catch (Exception ignored) {}
    }

    private Integer getOrCreateCategoryId(String catName) {
        try {
            List<Integer> list = jdbcTemplate.queryForList("SELECT COALESCE(category_id, id) FROM categories WHERE LOWER(category_name) = LOWER(?) OR LOWER(name) = LOWER(?) LIMIT 1", Integer.class, catName, catName);
            if (list != null && !list.isEmpty() && list.get(0) != null) {
                return list.get(0);
            }
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.update("INSERT INTO categories (category_name, name, description, status) VALUES (?, ?, ?, 'ACTIVE')", catName, catName, catName + " collection");
            List<Integer> list = jdbcTemplate.queryForList("SELECT COALESCE(category_id, id) FROM categories WHERE LOWER(category_name) = LOWER(?) OR LOWER(name) = LOWER(?) LIMIT 1", Integer.class, catName, catName);
            if (list != null && !list.isEmpty() && list.get(0) != null) {
                return list.get(0);
            }
        } catch (Exception ignored) {}

        return 1;
    }

    private void seedTablesAndProducts() {
        try {
            org.springframework.core.io.Resource resource = new org.springframework.core.io.ClassPathResource("ecommerce_db_mysql.sql");
            if (resource.exists()) {
                byte[] bytes = resource.getInputStream().readAllBytes();
                String sql = new String(bytes, java.nio.charset.StandardCharsets.UTF_8);
                String[] statements = sql.split(";");
                for (String stmt : statements) {
                    String trimmed = stmt.trim();
                    if (!trimmed.isEmpty()) {
                        try {
                            jdbcTemplate.execute(trimmed);
                        } catch (Exception e) {
                            // Ignore non-critical errors (e.g. table or row exists)
                        }
                    }
                }
                System.out.println("ecommerce_db_mysql.sql migrated successfully into MySQL!");
            }
        } catch (Exception e) {
            System.err.println("Error executing ecommerce_db_mysql.sql: " + e.getMessage());
        }
    }
}
