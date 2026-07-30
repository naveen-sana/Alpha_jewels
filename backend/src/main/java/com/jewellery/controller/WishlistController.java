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
        String sql = "CREATE TABLE IF NOT EXISTS ecommerce_db.wishlist_items (" +
                     "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                     "user_id BIGINT NOT NULL, " +
                     "product_id INT NOT NULL, " +
                     "UNIQUE KEY uk_user_product (user_id, product_id)" +
                     ")";
        jdbcTemplate.execute(sql);
    }

    private Long getUserIdByEmail(String email) {
        String sql = "SELECT id FROM ecommerce_db.user WHERE email = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email);
        if (result.isEmpty()) {
            return null;
        }
        return ((Number) result.get(0).get("id")).longValue();
    }

    // Get current user's wishlist
    @GetMapping
    public ResponseEntity<?> getWishlist() {
        ensureWishlistTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        System.out.println(">>> GET WISHLIST CALLED for email: " + email);
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            System.out.println(">>> GET WISHLIST ERROR: User not found for email " + email);
            return ResponseEntity.badRequest().body("User not found");
        }

        String sql = "SELECT wi.id as wishlistId, p.product_id as id, p.name, p.description, p.price, p.stock, c.category_name as categoryName, pi.image_url as imageUrl " +
                     "FROM ecommerce_db.wishlist_items wi " +
                     "JOIN ecommerce_db.products p ON wi.product_id = p.product_id " +
                     "LEFT JOIN ecommerce_db.categories c ON p.category_id = c.category_id " +
                     "LEFT JOIN ecommerce_db.productimages pi ON p.product_id = pi.product_id " +
                     "WHERE wi.user_id = ?";
        
        List<Map<String, Object>> wishlist = jdbcTemplate.queryForList(sql, userId);
        System.out.println(">>> GET WISHLIST SUCCESS: Found " + wishlist.size() + " items for userId " + userId);
        return ResponseEntity.ok(wishlist);
    }

    // Toggle product in user's wishlist (Add if absent, Remove if present)
    @PostMapping
    public ResponseEntity<?> toggleWishlist(@RequestBody Map<String, Object> request) {
        ensureWishlistTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        System.out.println(">>> TOGGLE WISHLIST CALLED for email: " + email + ", request: " + request);
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            System.out.println(">>> TOGGLE WISHLIST ERROR: User not found for email " + email);
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!request.containsKey("productId")) {
            System.out.println(">>> TOGGLE WISHLIST ERROR: productId missing in request");
            return ResponseEntity.badRequest().body("productId is required");
        }

        int productId = ((Number) request.get("productId")).intValue();
        System.out.println(">>> TOGGLE WISHLIST: userId=" + userId + ", productId=" + productId);

        String checkSql = "SELECT id FROM ecommerce_db.wishlist_items WHERE user_id = ? AND product_id = ?";
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(checkSql, userId, productId);

        Map<String, Object> response = new HashMap<>();
        if (!existing.isEmpty()) {
            String deleteSql = "DELETE FROM ecommerce_db.wishlist_items WHERE user_id = ? AND product_id = ?";
            jdbcTemplate.update(deleteSql, userId, productId);
            response.put("action", "removed");
            response.put("message", "Product removed from wishlist");
            System.out.println(">>> TOGGLE WISHLIST: REMOVED productId " + productId + " for userId " + userId);
        } else {
            String insertSql = "INSERT INTO ecommerce_db.wishlist_items (user_id, product_id) VALUES (?, ?)";
            jdbcTemplate.update(insertSql, userId, productId);
            response.put("action", "added");
            response.put("message", "Product added to wishlist");
            System.out.println(">>> TOGGLE WISHLIST: INSERTED productId " + productId + " for userId " + userId);
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

        String deleteSql = "DELETE FROM ecommerce_db.wishlist_items WHERE user_id = ? AND product_id = ?";
        jdbcTemplate.update(deleteSql, userId, productId);

        return ResponseEntity.ok("Product removed from wishlist");
    }
}
