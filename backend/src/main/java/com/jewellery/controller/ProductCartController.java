package com.jewellery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductCartController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Retrieve product list, with category name and image URL
    @GetMapping("/products")
    public List<Map<String, Object>> getProducts(@RequestParam(required = false) String category) {
        String sql = "SELECT p.product_id as id, p.name, p.description, p.price, p.stock, c.category_name as categoryName, pi.image_url as imageUrl " +
                     "FROM ecommerce_db.products p " +
                     "LEFT JOIN ecommerce_db.categories c ON p.category_id = c.category_id " +
                     "LEFT JOIN ecommerce_db.productimages pi ON p.product_id = pi.product_id";
        
        if (category != null && !category.trim().isEmpty()) {
            sql += " WHERE c.category_name = ?";
            return jdbcTemplate.queryForList(sql, category.trim());
        }
        
        return jdbcTemplate.queryForList(sql);
    }

    // Retrieve current user's cart items
    @GetMapping("/cart")
    public List<Map<String, Object>> getCart() {
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            throw new IllegalArgumentException("User not found");
        }

        String sql = "SELECT ci.id, ci.product_id as productId, ci.quantity, p.name, p.price, pi.image_url as imageUrl " +
                     "FROM ecommerce_db.cart_items ci " +
                     "LEFT JOIN ecommerce_db.products p ON ci.product_id = p.product_id " +
                     "LEFT JOIN ecommerce_db.productimages pi ON p.product_id = pi.product_id " +
                     "WHERE ci.user_id = ?";
        return jdbcTemplate.queryForList(sql, userId);
    }

    // Add a product to the user's cart
    @PostMapping("/cart")
    public ResponseEntity<String> addToCart(@RequestBody Map<String, Object> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        int productId = ((Number) request.get("productId")).intValue();
        int quantity = request.containsKey("quantity") ? ((Number) request.get("quantity")).intValue() : 1;

        // Check if item already in cart
        String checkSql = "SELECT id, quantity FROM ecommerce_db.cart_items WHERE user_id = ? AND product_id = ?";
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(checkSql, userId, productId);

        if (!existing.isEmpty()) {
            int currentQty = ((Number) existing.get(0).get("quantity")).intValue();
            String updateSql = "UPDATE ecommerce_db.cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?";
            jdbcTemplate.update(updateSql, currentQty + quantity, userId, productId);
        } else {
            String insertSql = "INSERT INTO ecommerce_db.cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)";
            jdbcTemplate.update(insertSql, userId, productId, quantity);
        }

        return ResponseEntity.ok("Item added to cart successfully");
    }

    // Delete a product from the user's cart
    @DeleteMapping("/cart/{productId}")
    public ResponseEntity<String> deleteFromCart(@PathVariable int productId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        String deleteSql = "DELETE FROM ecommerce_db.cart_items WHERE user_id = ? AND product_id = ?";
        jdbcTemplate.update(deleteSql, userId, productId);

        return ResponseEntity.ok("Item removed from cart successfully");
    }

    private Long getUserIdByEmail(String email) {
        String sql = "SELECT id FROM ecommerce_db.user WHERE email = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email);
        if (result.isEmpty()) {
            return null;
        }
        return ((Number) result.get(0).get("id")).longValue();
    }
}
