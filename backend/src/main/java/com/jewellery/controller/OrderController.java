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

    @PostMapping("/create")
    public ResponseEntity<?> createOrderDirect(@RequestBody Map<String, Object> payload) {
        try {
            ensureOrderTablesExist();
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            Long userId = getUserIdByEmail(email);
            if (userId == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            String orderId = (String) payload.get("orderId");
            if (orderId == null || orderId.trim().isEmpty()) {
                orderId = "ORD-" + System.currentTimeMillis();
            }

            double grandTotal = ((Number) payload.get("grandTotal")).doubleValue();
            String status = payload.containsKey("status") ? (String) payload.get("status") : "SUCCESS";
            String paymentMethod = payload.containsKey("paymentMethod") ? (String) payload.get("paymentMethod") : "Razorpay Online Payment";
            String paymentStatus = payload.containsKey("paymentStatus") ? (String) payload.get("paymentStatus") : "Paid";
            String shippingAddress = payload.containsKey("shippingAddress") ? (String) payload.get("shippingAddress") : "";

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
                    Long productId = item.get("id") != null ? ((Number) item.get("id")).longValue() : 1L;
                    int quantity = item.get("quantity") != null ? ((Number) item.get("quantity")).intValue() : 1;
                    double price = item.get("price") != null ? ((Number) item.get("price")).doubleValue() : 0.0;
                    double subtotal = item.get("subtotal") != null ? ((Number) item.get("subtotal")).doubleValue() : (price * quantity);

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
            String clearCartSql = "DELETE FROM ecommerce_db.cart_items WHERE user_id = ?";
            jdbcTemplate.update(clearCartSql, userId);

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
                return ResponseEntity.badRequest().body("User not found");
            }

            String deleteItemsSql = "DELETE FROM ecommerce_db.order_items WHERE order_id = ?";
            jdbcTemplate.update(deleteItemsSql, orderId);

            String deleteOrderSql = "DELETE FROM ecommerce_db.orders WHERE order_id = ? AND user_id = ?";
            jdbcTemplate.update(deleteOrderSql, orderId, userId);

            return ResponseEntity.ok("Order deleted successfully from database");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error deleting order: " + e.getMessage());
        }
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
