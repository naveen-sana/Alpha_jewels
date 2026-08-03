package com.jewellery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductCartController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private void ensureCartTableExists() {
        String sql = "CREATE TABLE IF NOT EXISTS ecommerce_db.cart_items (" +
                     "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                     "user_id BIGINT NOT NULL, " +
                     "product_id INT NOT NULL, " +
                     "quantity INT NOT NULL DEFAULT 1, " +
                     "UNIQUE KEY uk_user_cart_product (user_id, product_id)" +
                     ")";
        jdbcTemplate.execute(sql);
    }

    // Retrieve product list, with category name and image URL (supports GET and POST)
    @RequestMapping(value = {"/products", "/products/all"}, method = {RequestMethod.GET, RequestMethod.POST})
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

    // Get Cart Item Count: GET /api/cart/items/count
    @GetMapping("/cart/items/count")
    public ResponseEntity<Map<String, Object>> getCartItemCount() {
        ensureCartTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("count", 0);
            return ResponseEntity.ok(err);
        }

        String sql = "SELECT COALESCE(SUM(quantity), 0) FROM ecommerce_db.cart_items WHERE user_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("count", count != null ? count : 0);
        return ResponseEntity.ok(response);
    }

    // Retrieve current user's cart items (Structured format for GET /api/cart/items & GET /api/cart)
    @GetMapping({"/cart/items", "/cart"})
    public ResponseEntity<?> getCart() {
        ensureCartTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Map<String, Object> userInfo = getUserInfoByEmail(email);
        if (userInfo == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Long userId = ((Number) userInfo.get("id")).longValue();
        String username = (String) userInfo.get("full_name");
        if (username == null || username.trim().isEmpty()) {
            username = email;
        }
        String role = (String) userInfo.get("role");
        if (role == null) role = "CUSTOMER";

        String sql = "SELECT ci.id as cart_item_id, ci.product_id, ci.quantity, " +
                     "p.name, p.description, p.price as price_per_unit, p.stock, " +
                     "pi.image_url " +
                     "FROM ecommerce_db.cart_items ci " +
                     "JOIN ecommerce_db.products p ON ci.product_id = p.product_id " +
                     "LEFT JOIN ecommerce_db.productimages pi ON p.product_id = pi.product_id " +
                     "WHERE ci.user_id = ?";

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, userId);

        double overallTotalPrice = 0.0;
        List<Map<String, Object>> productsList = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            Map<String, Object> item = new HashMap<>();
            int productId = ((Number) row.get("product_id")).intValue();
            int quantity = ((Number) row.get("quantity")).intValue();
            double pricePerUnit = row.get("price_per_unit") != null ? ((Number) row.get("price_per_unit")).doubleValue() : 0.0;
            double totalPrice = Math.round(pricePerUnit * quantity * 100.0) / 100.0;

            overallTotalPrice += totalPrice;

            item.put("id", row.get("cart_item_id"));
            item.put("productId", productId);
            item.put("product_id", productId);
            item.put("name", row.get("name"));
            item.put("description", row.get("description"));
            item.put("imageUrl", row.get("image_url"));
            item.put("image_url", row.get("image_url"));
            item.put("price", pricePerUnit);
            item.put("price_per_unit", pricePerUnit);
            item.put("quantity", quantity);
            item.put("total_price", totalPrice);
            item.put("stock", row.get("stock"));

            productsList.add(item);
        }

        overallTotalPrice = Math.round(overallTotalPrice * 100.0) / 100.0;

        Map<String, Object> cartDetails = new HashMap<>();
        cartDetails.put("overall_total_price", overallTotalPrice);
        cartDetails.put("products", productsList);

        Map<String, Object> response = new HashMap<>();
        response.put("role", role);
        response.put("username", username);
        response.put("cart", cartDetails);
        response.put("items", productsList);

        return ResponseEntity.ok(response);
    }

    // Add a product to the user's cart: POST /api/cart/add, POST /api/cart/items/add
    @PostMapping({"/cart/add", "/cart/items/add"})
    public ResponseEntity<?> addToCart(@RequestBody(required = false) Map<String, Object> request) {
        if (request == null) {
            return ResponseEntity.badRequest().body("Request body is required");
        }
        ensureCartTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Integer productIdObj = null;
        if (request.containsKey("productId")) {
            productIdObj = ((Number) request.get("productId")).intValue();
        } else if (request.containsKey("product_id")) {
            productIdObj = ((Number) request.get("product_id")).intValue();
        }

        if (productIdObj == null) {
            return ResponseEntity.badRequest().body("productId is required");
        }

        int productId = productIdObj;
        int requestedQuantity = request.containsKey("quantity") ? ((Number) request.get("quantity")).intValue() : 1;
        if (requestedQuantity <= 0) {
            requestedQuantity = 1;
        }

        // Fetch product stock
        String stockSql = "SELECT stock FROM ecommerce_db.products WHERE product_id = ?";
        List<Map<String, Object>> productRows = jdbcTemplate.queryForList(stockSql, productId);
        if (productRows.isEmpty()) {
            return ResponseEntity.badRequest().body("Product not found");
        }
        int availableStock = ((Number) productRows.get(0).get("stock")).intValue();

        // Check existing quantity in cart
        String checkSql = "SELECT id, quantity FROM ecommerce_db.cart_items WHERE user_id = ? AND product_id = ?";
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(checkSql, userId, productId);

        int currentQty = existing.isEmpty() ? 0 : ((Number) existing.get(0).get("quantity")).intValue();
        int newTotalQty = currentQty + requestedQuantity;

        if (availableStock <= 0 || newTotalQty > availableStock) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Stock limit exceeded");
            err.put("message", "Stock limit exceeded. Only " + availableStock + " products are available.");
            err.put("availableStock", availableStock);
            return ResponseEntity.badRequest().body(err);
        }

        if (!existing.isEmpty()) {
            String updateSql = "UPDATE ecommerce_db.cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?";
            jdbcTemplate.update(updateSql, newTotalQty, userId, productId);
        } else {
            String insertSql = "INSERT INTO ecommerce_db.cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)";
            jdbcTemplate.update(insertSql, userId, productId, requestedQuantity);
        }

        // Get updated count
        String countSql = "SELECT COALESCE(SUM(quantity), 0) FROM ecommerce_db.cart_items WHERE user_id = ?";
        Integer count = jdbcTemplate.queryForObject(countSql, Integer.class, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Item added to cart successfully");
        response.put("count", count != null ? count : 0);
        return ResponseEntity.ok(response);
    }

    // Update Quantity: PUT /api/cart/update
    @PutMapping("/cart/update")
    public ResponseEntity<?> updateQuantity(@RequestBody Map<String, Object> request) {
        ensureCartTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Integer productIdObj = null;
        if (request.containsKey("productId")) {
            productIdObj = ((Number) request.get("productId")).intValue();
        } else if (request.containsKey("product_id")) {
            productIdObj = ((Number) request.get("product_id")).intValue();
        }

        if (productIdObj == null) {
            return ResponseEntity.badRequest().body("productId is required");
        }

        int productId = productIdObj;

        // Check if existing item in cart
        String checkSql = "SELECT id, quantity FROM ecommerce_db.cart_items WHERE user_id = ? AND product_id = ?";
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(checkSql, userId, productId);

        if (existing.isEmpty()) {
            return ResponseEntity.badRequest().body("Item not found in cart");
        }

        int currentQty = ((Number) existing.get(0).get("quantity")).intValue();
        int targetQty = currentQty;

        if (request.containsKey("quantity")) {
            targetQty = ((Number) request.get("quantity")).intValue();
        } else if (request.containsKey("action")) {
            String action = (String) request.get("action");
            if ("increase".equalsIgnoreCase(action) || "increment".equalsIgnoreCase(action)) {
                targetQty = currentQty + 1;
            } else if ("decrease".equalsIgnoreCase(action) || "decrement".equalsIgnoreCase(action)) {
                targetQty = currentQty - 1;
            }
        }

        // If target quantity becomes 0 or less, remove item automatically
        if (targetQty <= 0) {
            String deleteSql = "DELETE FROM ecommerce_db.cart_items WHERE user_id = ? AND product_id = ?";
            jdbcTemplate.update(deleteSql, userId, productId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product removed from cart");
            response.put("quantity", 0);
            return ResponseEntity.ok(response);
        }

        // Stock validation check
        String stockSql = "SELECT stock FROM ecommerce_db.products WHERE product_id = ?";
        List<Map<String, Object>> productRows = jdbcTemplate.queryForList(stockSql, productId);
        if (productRows.isEmpty()) {
            return ResponseEntity.badRequest().body("Product not found");
        }
        int availableStock = ((Number) productRows.get(0).get("stock")).intValue();

        if (targetQty > availableStock) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Stock limit exceeded");
            err.put("message", "Stock limit exceeded. Only " + availableStock + " products are available.");
            err.put("availableStock", availableStock);
            return ResponseEntity.badRequest().body(err);
        }

        String updateSql = "UPDATE ecommerce_db.cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?";
        jdbcTemplate.update(updateSql, targetQty, userId, productId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cart updated successfully");
        response.put("quantity", targetQty);
        return ResponseEntity.ok(response);
    }

    // Delete a product from the user's cart: DELETE /api/cart/delete & DELETE /api/cart/delete/{productId} & DELETE /api/cart/{productId}
    @DeleteMapping({"/cart/delete/{productId}", "/cart/{productId}", "/cart/delete"})
    public ResponseEntity<?> deleteFromCart(
            @PathVariable(required = false) Integer productId,
            @RequestParam(required = false) Integer productIdParam,
            @RequestBody(required = false) Map<String, Object> body) {
        
        ensureCartTableExists();
        String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Long userId = getUserIdByEmail(email);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        int targetProductId = -1;
        if (productId != null) {
            targetProductId = productId;
        } else if (productIdParam != null) {
            targetProductId = productIdParam;
        } else if (body != null && body.containsKey("productId")) {
            targetProductId = ((Number) body.get("productId")).intValue();
        } else if (body != null && body.containsKey("product_id")) {
            targetProductId = ((Number) body.get("product_id")).intValue();
        }

        if (targetProductId <= 0) {
            return ResponseEntity.badRequest().body("Valid productId is required");
        }

        String deleteSql = "DELETE FROM ecommerce_db.cart_items WHERE user_id = ? AND product_id = ?";
        jdbcTemplate.update(deleteSql, userId, targetProductId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Item removed from cart successfully");
        response.put("productId", targetProductId);
        return ResponseEntity.ok(response);
    }

    private Long getUserIdByEmail(String email) {
        String sql = "SELECT id FROM ecommerce_db.user WHERE email = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email);
        if (result.isEmpty()) {
            return null;
        }
        return ((Number) result.get(0).get("id")).longValue();
    }

    private Map<String, Object> getUserInfoByEmail(String email) {
        String sql = "SELECT id, full_name, role FROM ecommerce_db.user WHERE email = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email);
        if (result.isEmpty()) {
            return null;
        }
        return result.get(0);
    }
}
