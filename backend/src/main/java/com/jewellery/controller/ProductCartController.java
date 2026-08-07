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

    private String getColName(String table, String preferred, String fallback) {
        try {
            List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'ecommerce_db' AND TABLE_NAME = ?", table
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

    private void ensureProductTablesExist() {
        try {
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS ecommerce_db.categories (" +
                                 "category_id INT AUTO_INCREMENT PRIMARY KEY, " +
                                 "category_name VARCHAR(100) NOT NULL UNIQUE, " +
                                 "description TEXT, " +
                                 "image_url VARCHAR(500), " +
                                 "status VARCHAR(20) DEFAULT 'ACTIVE')");
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS ecommerce_db.products (" +
                                 "product_id INT AUTO_INCREMENT PRIMARY KEY, " +
                                 "name VARCHAR(255) NOT NULL, " +
                                 "category_id INT, " +
                                 "description TEXT, " +
                                 "price DECIMAL(10, 2) NOT NULL, " +
                                 "discount DECIMAL(5, 2) DEFAULT 0.00, " +
                                 "stock INT DEFAULT 0, " +
                                 "weight DECIMAL(8, 2), " +
                                 "metal_type VARCHAR(50), " +
                                 "gold_purity VARCHAR(50) DEFAULT '22K', " +
                                 "diamond_details VARCHAR(255) DEFAULT 'VS1 / G-H Color', " +
                                 "stone_details VARCHAR(255) DEFAULT 'Natural Diamond', " +
                                 "certificate_number VARCHAR(100), " +
                                 "sku VARCHAR(100), " +
                                 "status VARCHAR(20) DEFAULT 'ACTIVE')");
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS ecommerce_db.productimages (" +
                                 "image_id INT AUTO_INCREMENT PRIMARY KEY, " +
                                 "product_id INT NOT NULL, " +
                                 "image_url TEXT NOT NULL, " +
                                 "is_thumbnail BOOLEAN DEFAULT TRUE)");

            String[] alters = {
                "ALTER TABLE ecommerce_db.categories ADD COLUMN category_name VARCHAR(100)",
                "ALTER TABLE ecommerce_db.products ADD COLUMN category_id INT",
                "ALTER TABLE ecommerce_db.products ADD COLUMN description TEXT",
                "ALTER TABLE ecommerce_db.products ADD COLUMN price DECIMAL(10, 2) DEFAULT 0.00",
                "ALTER TABLE ecommerce_db.products ADD COLUMN discount DECIMAL(5, 2) DEFAULT 0.00",
                "ALTER TABLE ecommerce_db.products ADD COLUMN stock INT DEFAULT 10",
                "ALTER TABLE ecommerce_db.products ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE'"
            };
            for (String alterSql : alters) {
                try { jdbcTemplate.execute(alterSql); } catch (Exception ignored) {}
            }

            // Seed default categories if empty
            Integer catCount = 0;
            try { catCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.categories", Integer.class); } catch (Exception ignored) {}
            if (catCount == null || catCount == 0) {
                try {
                    jdbcTemplate.execute("INSERT IGNORE INTO ecommerce_db.categories (category_id, category_name) VALUES " +
                                         "(1, 'Diamond'), (2, 'Gold'), (3, 'Platinum'), (4, 'Silver'), (9, 'Bridal')");
                } catch (Exception ignored) {}
            }

            // Seed default products if empty
            Integer prodCount = 0;
            try { prodCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM ecommerce_db.products", Integer.class); } catch (Exception ignored) {}
            if (prodCount == null || prodCount == 0) {
                try {
                    String insertProd = "INSERT INTO ecommerce_db.products (name, category_id, description, price, discount, stock, status) " +
                                        "VALUES (?, 1, 'Exquisite 22K gold ring with VVS solitaire diamond', 125000.00, 5.0, 15, 'ACTIVE')";
                    jdbcTemplate.update(insertProd, "Royal Solitaire Diamond Ring");
                    Integer p1 = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
                    if (p1 != null) jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", p1, "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80");

                    String insertProd2 = "INSERT INTO ecommerce_db.products (name, category_id, description, price, discount, stock, status) " +
                                         "VALUES (?, 2, 'Handcrafted royal Kundan and Emerald gold choker necklace', 450000.00, 10.0, 8, 'ACTIVE')";
                    jdbcTemplate.update(insertProd2, "Imperial Emerald Gold Choker");
                    Integer p2 = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
                    if (p2 != null) jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", p2, "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80");

                    String insertProd3 = "INSERT INTO ecommerce_db.products (name, category_id, description, price, discount, stock, status) " +
                                         "VALUES (?, 3, 'Elegant platinum studs featuring princess cut diamonds', 85000.00, 0.0, 20, 'ACTIVE')";
                    jdbcTemplate.update(insertProd3, "Princess Cut Diamond Studs");
                    Integer p3 = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
                    if (p3 != null) jdbcTemplate.update("INSERT INTO ecommerce_db.productimages (product_id, image_url, is_thumbnail) VALUES (?, ?, TRUE)", p3, "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80");
                } catch (Exception ignored) {}
            }
        } catch (Exception ignored) {}
    }

    // Retrieve product list, with category name and image URL (supports GET and POST)
    @RequestMapping(value = {"/products", "/products/all"}, method = {RequestMethod.GET, RequestMethod.POST})
    public List<Map<String, Object>> getProducts(@RequestParam(required = false) String category) {
        ensureProductTablesExist();
        String imgTable = "product_images";
        try {
            List<Map<String, Object>> check = jdbcTemplate.queryForList("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='ecommerce_db' AND TABLE_NAME='product_images'");
            if (check == null || check.isEmpty()) {
                imgTable = "productimages";
            }
        } catch (Exception ignored) {
            imgTable = "productimages";
        }

        String sql = "SELECT p.id as id, p.name, p.description, p.price, COALESCE(p.stock, p.stock_quantity, 10) as stock, c.name as categoryName, pi.image_url as imageUrl " +
                     "FROM ecommerce_db.products p " +
                     "LEFT JOIN ecommerce_db.categories c ON p.category_id = c.id " +
                     "LEFT JOIN (SELECT product_id, MAX(image_url) as image_url FROM ecommerce_db." + imgTable + " GROUP BY product_id) pi ON p.id = pi.product_id";

        try {
            if (category != null && !category.trim().isEmpty()) {
                String filterSql = sql + " WHERE LOWER(c.name) = LOWER(?)";
                List<Map<String, Object>> filtered = jdbcTemplate.queryForList(filterSql, category.trim());
                if (filtered != null && !filtered.isEmpty()) {
                    return filtered;
                }
            }
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                String fallbackSql = "SELECT p.id as id, p.name, p.description, p.price, 10 as stock, 'Jewelry' as categoryName, NULL as imageUrl FROM ecommerce_db.products p";
                return jdbcTemplate.queryForList(fallbackSql);
            } catch (Exception ignored) {
                return new ArrayList<>();
            }
        }
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

        String imgTable = "product_images";
        try {
            List<Map<String, Object>> check = jdbcTemplate.queryForList("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='ecommerce_db' AND TABLE_NAME='product_images'");
            if (check == null || check.isEmpty()) imgTable = "productimages";
        } catch (Exception ignored) { imgTable = "productimages"; }

        String sql = "SELECT ci.id as cart_item_id, ci.product_id, ci.quantity, " +
                     "p.name, p.description, p.price as price_per_unit, COALESCE(p.stock, p.stock_quantity, 10) as stock, " +
                     "pi.image_url " +
                     "FROM ecommerce_db.cart_items ci " +
                     "JOIN ecommerce_db.products p ON (ci.product_id = p.id OR ci.product_id = p.product_id) " +
                     "LEFT JOIN (SELECT product_id, MAX(image_url) as image_url FROM ecommerce_db." + imgTable + " GROUP BY product_id) pi ON (p.id = pi.product_id OR p.product_id = pi.product_id) " +
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
        try {
            ensureCartTableExists();
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            Long userId = getUserIdByEmail(email);
            if (userId == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Integer productIdObj = null;
            if (request.containsKey("productId") && request.get("productId") != null) {
                productIdObj = ((Number) request.get("productId")).intValue();
            } else if (request.containsKey("product_id") && request.get("product_id") != null) {
                productIdObj = ((Number) request.get("product_id")).intValue();
            } else if (request.containsKey("id") && request.get("id") != null) {
                productIdObj = ((Number) request.get("id")).intValue();
            }

            if (productIdObj == null) {
                return ResponseEntity.badRequest().body("productId is required");
            }

            int productId = productIdObj;
            int requestedQuantity = request.containsKey("quantity") && request.get("quantity") != null 
                    ? ((Number) request.get("quantity")).intValue() : 1;
            if (requestedQuantity <= 0) {
                requestedQuantity = 1;
            }

            // Fetch product stock with fallback for column names
            int availableStock = 999;
            try {
                String stockSql = "SELECT stock FROM ecommerce_db.products WHERE product_id = ?";
                List<Map<String, Object>> productRows = jdbcTemplate.queryForList(stockSql, productId);
                if (productRows.isEmpty()) {
                    stockSql = "SELECT stock FROM ecommerce_db.products WHERE id = ?";
                    productRows = jdbcTemplate.queryForList(stockSql, productId);
                }
                if (!productRows.isEmpty() && productRows.get(0).get("stock") != null) {
                    availableStock = ((Number) productRows.get(0).get("stock")).intValue();
                }
            } catch (Exception stockEx) {
                availableStock = 999;
            }

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
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to add item to cart: " + ex.getMessage());
        }
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
        if (email == null) return null;
        try {
            String sql = "SELECT id FROM ecommerce_db.user WHERE LOWER(email) = LOWER(?)";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email.trim());
            if (result.isEmpty()) {
                sql = "SELECT id FROM ecommerce_db.users WHERE LOWER(email) = LOWER(?)";
                result = jdbcTemplate.queryForList(sql, email.trim());
            }
            if (result.isEmpty()) {
                return null;
            }
            return ((Number) result.get(0).get("id")).longValue();
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String, Object> getUserInfoByEmail(String email) {
        if (email == null) return null;
        try {
            String sql = "SELECT id, full_name, role FROM ecommerce_db.user WHERE LOWER(email) = LOWER(?)";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email.trim());
            if (result.isEmpty()) {
                sql = "SELECT id, full_name, role FROM ecommerce_db.users WHERE LOWER(email) = LOWER(?)";
                result = jdbcTemplate.queryForList(sql, email.trim());
            }
            if (result.isEmpty()) {
                return null;
            }
            return result.get(0);
        } catch (Exception e) {
            return null;
        }
    }
}
