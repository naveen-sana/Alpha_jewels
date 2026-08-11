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
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private void ensureWishlistTableExists() {
        try {
            String sql = "CREATE TABLE IF NOT EXISTS wishlist_items (" +
                         "id SERIAL PRIMARY KEY, " +
                         "user_id BIGINT NOT NULL, " +
                         "product_id INT NOT NULL, " +
                         "CONSTRAINT uk_user_product UNIQUE (user_id, product_id)" +
                         ")";
            jdbcTemplate.execute(sql);
        } catch (Exception ignored) {}
    }

    private String getColName(String table, String preferred, String fallback) {
        try {
            List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE LOWER(TABLE_NAME) = LOWER(?)", table
            );
            for (Map<String, Object> col : columns) {
                for (Object val : col.values()) {
                    String name = String.valueOf(val);
                    if (preferred.equalsIgnoreCase(name)) return preferred;
                    if (fallback.equalsIgnoreCase(name)) return fallback;
                }
            }
        } catch (Exception ignored) {}
        return preferred;
    }

    private Long getUserIdByEmail(String email) {
        if (email == null) return null;
        try {
            List<Map<String, Object>> result = List.of();
            try {
                result = jdbcTemplate.queryForList("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", email.trim());
            } catch (Exception e) {
                try {
                    result = jdbcTemplate.queryForList("SELECT id FROM user WHERE LOWER(email) = LOWER(?)", email.trim());
                } catch (Exception ignored) {}
            }
            if (result.isEmpty()) {
                return null;
            }
            return ((Number) result.get(0).get("id")).longValue();
        } catch (Exception e) {
            return null;
        }
    }

    // Get current user's wishlist
    @GetMapping
    public ResponseEntity<?> getWishlist() {
        ensureWishlistTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        String pIdCol = getColName("products", "product_id", "id");
        String cIdCol = getColName("categories", "category_id", "id");
        String cNameCol = getColName("categories", "category_name", "name");
        String pCatIdCol = getColName("products", "category_id", "category_id");

        String imgTable = "product_images";
        try {
            List<Map<String, Object>> check = jdbcTemplate.queryForList("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE LOWER(TABLE_NAME)='product_images'");
            if (check == null || check.isEmpty()) imgTable = "productimages";
        } catch (Exception ignored) {
            imgTable = "productimages";
        }

        String piPIdCol = getColName(imgTable, "product_id", "product_id");

        String sql = "SELECT wi.id as wishlistId, p." + pIdCol + " as id, p.name, p.description, p.price, " +
                     "COALESCE(p.stock, p.stock_quantity, 10) as stock, c." + cNameCol + " as categoryName, pi.image_url as imageUrl " +
                     "FROM wishlist_items wi " +
                     "JOIN products p ON wi.product_id = p." + pIdCol + " " +
                     "LEFT JOIN categories c ON p." + pCatIdCol + " = c." + cIdCol + " " +
                     "LEFT JOIN (SELECT " + piPIdCol + ", MAX(image_url) as image_url FROM " + imgTable + " GROUP BY " + piPIdCol + ") pi ON p." + pIdCol + " = pi." + piPIdCol + " " +
                     "WHERE wi.user_id = ?";
        
        List<Map<String, Object>> wishlist = jdbcTemplate.queryForList(sql, userId);
        return ResponseEntity.ok(wishlist);
    }

    // Toggle product in user's wishlist
    @PostMapping({"", "/", "/toggle", "/add"})
    public ResponseEntity<?> toggleWishlist(@RequestBody Map<String, Object> request) {
        ensureWishlistTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!request.containsKey("productId") && !request.containsKey("product_id") && !request.containsKey("id")) {
            return ResponseEntity.badRequest().body("productId is required");
        }

        Object pObj = request.containsKey("productId") ? request.get("productId") : (request.containsKey("product_id") ? request.get("product_id") : request.get("id"));
        int productId = ((Number) pObj).intValue();

        String checkSql = "SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?";
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(checkSql, userId, productId);

        Map<String, Object> response = new HashMap<>();
        if (!existing.isEmpty()) {
            String deleteSql = "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?";
            jdbcTemplate.update(deleteSql, userId, productId);
            response.put("action", "removed");
            response.put("message", "Product removed from wishlist");
        } else {
            String insertSql = "INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)";
            jdbcTemplate.update(insertSql, userId, productId);
            response.put("action", "added");
            response.put("message", "Product added to wishlist");
        }

        return ResponseEntity.ok(response);
    }

    // Delete a product from wishlist
    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteFromWishlist(@PathVariable int productId) {
        ensureWishlistTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        String deleteSql = "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?";
        jdbcTemplate.update(deleteSql, userId, productId);

        return ResponseEntity.ok("Product removed from wishlist");
    }
}
