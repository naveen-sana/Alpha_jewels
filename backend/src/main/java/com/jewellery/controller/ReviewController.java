package com.jewellery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private void ensureReviewTableExists() {
        String sql = "CREATE TABLE IF NOT EXISTS ecommerce_db.reviews (" +
                "review_id INT AUTO_INCREMENT PRIMARY KEY, " +
                "product_id INT NOT NULL, " +
                "user_id BIGINT NOT NULL, " +
                "customer_name VARCHAR(100), " +
                "rating INT DEFAULT 5, " +
                "comment TEXT, " +
                "status VARCHAR(20) DEFAULT 'APPROVED', " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                ")";
        jdbcTemplate.execute(sql);
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> body) {
        ensureReviewTableExists();
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            
            // Get user info
            String userSql = "SELECT id, full_name FROM ecommerce_db.user WHERE email = ?";
            List<Map<String, Object>> users = jdbcTemplate.queryForList(userSql, email);
            
            Long userId = 1L;
            String customerName = "Valued Customer";
            if (!users.isEmpty()) {
                userId = ((Number) users.get(0).get("id")).longValue();
                if (users.get(0).get("full_name") != null) {
                    customerName = (String) users.get(0).get("full_name");
                } else {
                    customerName = email.split("@")[0];
                }
            }

            Integer productId = ((Number) body.get("productId")).intValue();
            Integer rating = body.get("rating") != null ? ((Number) body.get("rating")).intValue() : 5;
            String comment = body.get("comment") != null ? (String) body.get("comment") : "";

            String insertSql = "INSERT INTO ecommerce_db.reviews (product_id, user_id, customer_name, rating, comment, status) " +
                    "VALUES (?, ?, ?, ?, ?, 'APPROVED')";
            jdbcTemplate.update(insertSql, productId, userId, customerName, rating, comment);

            Map<String, Object> resp = new HashMap<>();
            resp.put("message", "Thank you for your rating and review!");
            resp.put("status", "SUCCESS");
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to submit review: " + e.getMessage()));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductReviews(@PathVariable Integer productId) {
        ensureReviewTableExists();
        try {
            String sql = "SELECT review_id as id, product_id as productId, user_id as userId, customer_name as customerName, " +
                    "rating, comment, status, created_at as date FROM ecommerce_db.reviews WHERE product_id = ? AND status = 'APPROVED' " +
                    "ORDER BY created_at DESC";
            List<Map<String, Object>> reviews = jdbcTemplate.queryForList(sql, productId);
            
            double avgRating = 5.0;
            if (!reviews.isEmpty()) {
                double total = 0;
                for (Map<String, Object> r : reviews) {
                    total += ((Number) r.get("rating")).doubleValue();
                }
                avgRating = Math.round((total / reviews.size()) * 10.0) / 10.0;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviews);
            response.put("totalReviews", reviews.size());
            response.put("averageRating", avgRating);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserReviews() {
        ensureReviewTableExists();
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            String userSql = "SELECT id FROM ecommerce_db.user WHERE email = ?";
            List<Map<String, Object>> users = jdbcTemplate.queryForList(userSql, email);
            
            if (users.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }
            Long userId = ((Number) users.get(0).get("id")).longValue();

            String sql = "SELECT review_id as id, product_id as productId, rating, comment, created_at as date " +
                    "FROM ecommerce_db.reviews WHERE user_id = ? ORDER BY created_at DESC";
            List<Map<String, Object>> reviews = jdbcTemplate.queryForList(sql, userId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }
}
