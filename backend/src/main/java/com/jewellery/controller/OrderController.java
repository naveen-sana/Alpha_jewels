package com.jewellery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void ensureOrderTablesExist() {
        String createOrdersSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.orders (" +
                "order_id VARCHAR(100) PRIMARY KEY, " +
                "user_id BIGINT NOT NULL, " +
                "total_amount DECIMAL(12, 2) NOT NULL, " +
                "status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS', " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                ")";
        jdbcTemplate.execute(createOrdersSql);

        String createOrderItemsSql = "CREATE TABLE IF NOT EXISTS ecommerce_db.order_items (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "order_id VARCHAR(100) NOT NULL, " +
                "product_id BIGINT NOT NULL, " +
                "quantity INT NOT NULL DEFAULT 1, " +
                "price_per_unit DECIMAL(12, 2) NOT NULL, " +
                "total_price DECIMAL(12, 2) NOT NULL" +
                ")";
        jdbcTemplate.execute(createOrderItemsSql);
    }

    @GetMapping
    public ResponseEntity<?> getUserOrders() {
        try {
            ensureOrderTablesExist();
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            Long userId = getUserIdByEmail(email);
            if (userId == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            String sqlOrders = "SELECT order_id as orderId, total_amount as grandTotal, status, " +
                    "payment_method as paymentMethod, payment_status as paymentStatus, shipping_address as shippingAddress, " +
                    "created_at as placedOn " +
                    "FROM ecommerce_db.orders WHERE user_id = ? ORDER BY created_at DESC";
            List<Map<String, Object>> ordersList = jdbcTemplate.queryForList(sqlOrders, userId);

            List<Map<String, Object>> result = new ArrayList<>();
            for (Map<String, Object> order : ordersList) {
                String orderId = (String) order.get("orderId");

                String sqlItems = "SELECT oi.product_id as id, p.name, c.category_name as category, " +
                        "p.description as specs, oi.price_per_unit as price, oi.quantity, oi.total_price as subtotal, " +
                        "pi.image_url as imageUrl " +
                        "FROM ecommerce_db.order_items oi " +
                        "LEFT JOIN ecommerce_db.products p ON oi.product_id = p.product_id " +
                        "LEFT JOIN ecommerce_db.categories c ON p.category_id = c.category_id " +
                        "LEFT JOIN ecommerce_db.productimages pi ON p.product_id = pi.product_id " +
                        "WHERE oi.order_id = ?";
                List<Map<String, Object>> items = jdbcTemplate.queryForList(sqlItems, orderId);

                Map<String, Object> formattedOrder = new HashMap<>(order);
                formattedOrder.put("items", items);
                formattedOrder.put("itemCount", items.size());
                result.add(formattedOrder);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching orders: " + e.getMessage());
        }
    }

    @PostMapping({"", "/create"})
    public ResponseEntity<?> createOrderDirect(@RequestBody Map<String, Object> payload) {
        try {
            ensureOrderTablesExist();
            String email = "customer@alphajewels.com";
            try {
                if (SecurityContextHolder.getContext().getAuthentication() != null) {
                    email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
                }
            } catch (Exception ignored) {}

            Long userId = getUserIdByEmail(email);
            if (userId == null) {
                userId = 1L; // Fallback to primary admin/user ID if unauthenticated
            }

            String orderId = (String) payload.get("orderId");
            if (orderId == null || orderId.trim().isEmpty()) {
                orderId = "ORD-" + System.currentTimeMillis();
            }

            double grandTotal = 0.0;
            if (payload.get("grandTotal") instanceof Number) {
                grandTotal = ((Number) payload.get("grandTotal")).doubleValue();
            } else if (payload.get("grandTotal") != null) {
                try { grandTotal = Double.parseDouble(payload.get("grandTotal").toString()); } catch (Exception ignored) {}
            }

            String status = payload.containsKey("status") && payload.get("status") != null ? (String) payload.get("status") : "SUCCESS";
            String paymentMethod = payload.containsKey("paymentMethod") && payload.get("paymentMethod") != null ? (String) payload.get("paymentMethod") : "Razorpay Online Payment";
            String paymentStatus = payload.containsKey("paymentStatus") && payload.get("paymentStatus") != null ? (String) payload.get("paymentStatus") : "Paid";
            String shippingAddress = payload.containsKey("shippingAddress") && payload.get("shippingAddress") != null ? (String) payload.get("shippingAddress") : "";

            // Ensure columns exist
            String[] orderCols = {
                "ALTER TABLE ecommerce_db.orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Credit Card'",
                "ALTER TABLE ecommerce_db.orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'Paid'",
                "ALTER TABLE ecommerce_db.orders ADD COLUMN shipping_address TEXT"
            };
            for (String alterSql : orderCols) {
                try { jdbcTemplate.execute(alterSql); } catch (Exception ignored) {}
            }

            // Save order
            String insertOrderSql = "INSERT INTO ecommerce_db.orders (order_id, user_id, total_amount, status, payment_method, payment_status, shipping_address, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE total_amount=?, status=?, payment_method=?, payment_status=?, shipping_address=?, updated_at=NOW()";
            jdbcTemplate.update(insertOrderSql, orderId, userId, grandTotal, status, paymentMethod, paymentStatus, shippingAddress, grandTotal, status, paymentMethod, paymentStatus, shippingAddress);

            // Save items if provided in payload
            if (payload.containsKey("items") && payload.get("items") instanceof List) {
                List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
                String insertItemSql = "INSERT INTO ecommerce_db.order_items (order_id, product_id, quantity, price_per_unit, total_price) " +
                        "VALUES (?, ?, ?, ?, ?)";
                for (Map<String, Object> item : items) {
                    Long productId = 1L;
                    Object rawId = item.get("id") != null ? item.get("id") : item.get("productId");
                    if (rawId != null) {
                        try {
                            String idStr = rawId.toString().replaceAll("[^0-9]", "");
                            if (!idStr.isEmpty()) productId = Long.parseLong(idStr);
                        } catch (Exception ignored) {}
                    }

                    int quantity = 1;
                    if (item.get("quantity") instanceof Number) quantity = ((Number) item.get("quantity")).intValue();
                    else if (item.get("quantity") != null) {
                        try { quantity = Integer.parseInt(item.get("quantity").toString()); } catch (Exception ignored) {}
                    }

                    double price = 0.0;
                    if (item.get("price") instanceof Number) price = ((Number) item.get("price")).doubleValue();
                    else if (item.get("price") != null) {
                        try { price = Double.parseDouble(item.get("price").toString()); } catch (Exception ignored) {}
                    }

                    double subtotal = price * quantity;
                    if (item.get("subtotal") instanceof Number) subtotal = ((Number) item.get("subtotal")).doubleValue();
                    else if (item.get("subtotal") != null) {
                        try { subtotal = Double.parseDouble(item.get("subtotal").toString()); } catch (Exception ignored) {}
                    }

                    jdbcTemplate.update(insertItemSql, orderId, productId, quantity, price, subtotal);
                }
            } else {
                // Otherwise fetch from cart
                String fetchCartSql = "SELECT ci.product_id, ci.quantity, p.price " +
                        "FROM ecommerce_db.cart_items ci " +
                        "JOIN ecommerce_db.products p ON ci.product_id = p.product_id " +
                        "WHERE ci.user_id = ?";
                List<Map<String, Object>> cartItems = jdbcTemplate.queryForList(fetchCartSql, userId);
                String insertItemSql = "INSERT INTO ecommerce_db.order_items (order_id, product_id, quantity, price_per_unit, total_price) " +
                        "VALUES (?, ?, ?, ?, ?)";
                for (Map<String, Object> item : cartItems) {
                    Long productId = ((Number) item.get("product_id")).longValue();
                    int quantity = ((Number) item.get("quantity")).intValue();
                    double price = ((Number) item.get("price")).doubleValue();
                    double lineTotal = price * quantity;
                    jdbcTemplate.update(insertItemSql, orderId, productId, quantity, price, lineTotal);
                }
            }

            // Clear cart
            try {
                String clearCartSql = "DELETE FROM ecommerce_db.cart_items WHERE user_id = ?";
                jdbcTemplate.update(clearCartSql, userId);
            } catch (Exception ignored) {}

            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("orderId", orderId);
            response.put("message", "Order stored successfully in database");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating order: " + e.getMessage());
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable String orderId) {
        try {
            ensureOrderTablesExist();
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            Long userId = getUserIdByEmail(email);
            if (userId == null) {
                userId = 1L;
            }

            String deleteItemsSql = "DELETE FROM ecommerce_db.order_items WHERE order_id = ?";
            jdbcTemplate.update(deleteItemsSql, orderId);

            String deleteOrderSql = "DELETE FROM ecommerce_db.orders WHERE order_id = ?";
            jdbcTemplate.update(deleteOrderSql, orderId);

            return ResponseEntity.ok("Order deleted successfully from database");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error deleting order: " + e.getMessage());
        }
    }

    private Long getUserIdByEmail(String email) {
        if (email == null || email.trim().isEmpty()) return 1L;
        try {
            String sql = "SELECT id FROM ecommerce_db.user WHERE LOWER(email) = LOWER(?)";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email.trim());
            if (result.isEmpty()) {
                sql = "SELECT id FROM ecommerce_db.users WHERE LOWER(email) = LOWER(?)";
                result = jdbcTemplate.queryForList(sql, email.trim());
            }
            if (result.isEmpty()) {
                return 1L;
            }
            return ((Number) result.get(0).get("id")).longValue();
        } catch (Exception e) {
            return 1L;
        }
    }
}
