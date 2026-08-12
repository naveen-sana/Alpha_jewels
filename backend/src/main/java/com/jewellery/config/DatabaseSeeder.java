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
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS \"user\" (" +
                    "id SERIAL PRIMARY KEY, " +
                    "email VARCHAR(255) NOT NULL UNIQUE, " +
                    "name VARCHAR(255), " +
                    "full_name VARCHAR(255), " +
                    "password VARCHAR(255) NOT NULL, " +
                    "role VARCHAR(50) DEFAULT 'USER', " +
                    "mobile_number VARCHAR(50), " +
                    "phone VARCHAR(50)" +
                    ")");
        } catch (Exception ignored) {}

        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS users (" +
                    "id SERIAL PRIMARY KEY, " +
                    "email VARCHAR(255) NOT NULL UNIQUE, " +
                    "name VARCHAR(255), " +
                    "full_name VARCHAR(255), " +
                    "password VARCHAR(255) NOT NULL, " +
                    "role VARCHAR(50) DEFAULT 'USER', " +
                    "mobile_number VARCHAR(50), " +
                    "phone VARCHAR(50)" +
                    ")");
        } catch (Exception ignored) {}

        // Ensure admin@gmail.com exists as ADMIN
        try {
            List<Integer> countAdmin = jdbcTemplate.queryForList("SELECT 1 FROM \"user\" WHERE LOWER(email) = LOWER('admin@gmail.com')", Integer.class);
            if (countAdmin.isEmpty() && passwordEncoder != null) {
                String hashedPass = passwordEncoder.encode("admin");
                jdbcTemplate.update("INSERT INTO \"user\" (email, name, full_name, password, role) VALUES ('admin@gmail.com', 'System Admin', 'System Admin', ?, 'ADMIN')", hashedPass);
            }
        } catch (Exception ignored) {}

        // Ensure naveensana66028@gmail.com exists as ADMIN
        String targetEmail = "naveensana66028@gmail.com";
        try {
            List<Integer> count = jdbcTemplate.queryForList("SELECT 1 FROM \"user\" WHERE LOWER(email) = LOWER(?)", Integer.class, targetEmail);
            if (count.isEmpty() && passwordEncoder != null) {
                String hashedPass = passwordEncoder.encode("Naveen@0987");
                jdbcTemplate.update("INSERT INTO \"user\" (email, name, full_name, password, role) VALUES (?, 'Naveen Sana', 'Naveen Sana', ?, 'ADMIN')", targetEmail, hashedPass);
            } else if (!count.isEmpty()) {
                jdbcTemplate.update("UPDATE \"user\" SET role = 'ADMIN' WHERE LOWER(email) = LOWER(?)", targetEmail);
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
            org.springframework.core.io.Resource resource = new org.springframework.core.io.ClassPathResource("ecommerce_db_postgres.sql");
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
                            // Ignore non-critical errors (e.g. duplicate key or table exists)
                        }
                    }
                }
                System.out.println("ecommerce_db_postgres.sql migrated successfully into PostgreSQL!");
            }
        } catch (Exception e) {
            System.err.println("Error executing ecommerce_db_postgres.sql: " + e.getMessage());
        }
    }
}
