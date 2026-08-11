package com.jewellery.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private String getRazorpayKeyId() {
        String envKey = System.getenv("RAZORPAY_KEY_ID");
        if (envKey != null && !envKey.trim().isEmpty() && !envKey.contains("YOUR_")) return envKey.trim();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT value FROM settings WHERE key_name = 'razorpayKeyId' OR key_name = 'razorpayKey'");
            if (!rows.isEmpty() && rows.get(0).get("value") != null) {
                String val = (String) rows.get(0).get("value");
                if (val != null && !val.trim().isEmpty() && !val.contains("YOUR_") && !val.contains("rzp_live_alpha9021")) return val.trim();
            }
        } catch (Exception ignored) {}
        return "rzp_test_TK7E94H666yiG6";
    }

    private String getRazorpayKeySecret() {
        String envSecret = System.getenv("RAZORPAY_KEY_SECRET");
        if (envSecret != null && !envSecret.trim().isEmpty() && !envSecret.contains("YOUR_")) return envSecret.trim();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT value FROM settings WHERE key_name = 'razorpayKeySecret' OR key_name = 'razorpaySecret'");
            if (!rows.isEmpty() && rows.get(0).get("value") != null) {
                String val = (String) rows.get(0).get("value");
                if (val != null && !val.trim().isEmpty() && !val.contains("YOUR_")) return val.trim();
            }
        } catch (Exception ignored) {}
        return "77YZVjEVFbZno14mq05y3hl2";
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private void ensureOrderTablesExist() {
        String createOrdersSql = "CREATE TABLE IF NOT EXISTS orders (" +
                "order_id VARCHAR(100) PRIMARY KEY, " +
                "user_id BIGINT NOT NULL, " +
                "total_amount DECIMAL(12, 2) NOT NULL, " +
                "status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS', " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                ")";
        jdbcTemplate.execute(createOrdersSql);

        String createOrderItemsSql = "CREATE TABLE IF NOT EXISTS order_items (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "order_id VARCHAR(100) NOT NULL, " +
                "product_id BIGINT NOT NULL, " +
                "quantity INT NOT NULL DEFAULT 1, " +
                "price_per_unit DECIMAL(12, 2) NOT NULL, " +
                "total_price DECIMAL(12, 2) NOT NULL" +
                ")";
        jdbcTemplate.execute(createOrderItemsSql);
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody(required = false) Map<String, Object> request) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            Map<String, Object> userInfo = getUserInfoByEmail(email);
            if (userInfo == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Long userId = ((Number) userInfo.get("id")).longValue();
            String fullName = (String) userInfo.get("full_name");

            double grandTotal = 0.0;
            if (request != null && request.containsKey("grandTotal") && request.get("grandTotal") != null) {
                grandTotal = ((Number) request.get("grandTotal")).doubleValue();
            } else {
                // Calculate total from active cart
                String sql = "SELECT ci.quantity, p.price " +
                             "FROM cart_items ci " +
                             "JOIN products p ON ci.product_id = p.product_id " +
                             "WHERE ci.user_id = ?";

                List<Map<String, Object>> items = jdbcTemplate.queryForList(sql, userId);

                double subtotal = 0.0;
                for (Map<String, Object> item : items) {
                    int qty = ((Number) item.get("quantity")).intValue();
                    double price = ((Number) item.get("price")).doubleValue();
                    subtotal += (price * qty);
                }

                double shipping = 0.0;
                if (request != null && request.containsKey("shipping")) {
                    shipping = ((Number) request.get("shipping")).doubleValue();
                }

                grandTotal = subtotal + shipping;
            }

            long amountInPaise = Math.round(grandTotal * 100.0);

            if (amountInPaise <= 0) {
                return ResponseEntity.badRequest().body("Invalid order amount");
            }

            String keyId = getRazorpayKeyId();
            String keySecret = getRazorpayKeySecret();

            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcpt_" + userId + "_" + System.currentTimeMillis());

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", razorpayOrder.get("id"));
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("key", keyId);
            response.put("userEmail", email);
            response.put("userName", fullName != null ? fullName : email);
            response.put("grandTotal", grandTotal);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Razorpay order creation failed");
            err.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> payload) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            Long userId = getUserIdByEmail(email);
            if (userId == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            String razorpayOrderId = (String) payload.get("razorpay_order_id");
            String razorpayPaymentId = (String) payload.get("razorpay_payment_id");
            String razorpaySignature = (String) payload.get("razorpay_signature");

            if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null) {
                return ResponseEntity.badRequest().body("Missing payment verification parameters");
            }

            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);

            boolean isSignatureValid = Utils.verifyPaymentSignature(attributes, getRazorpayKeySecret());

            if (isSignatureValid) {
                ensureOrderTablesExist();

                // Fetch cart items to calculate order total and create order items
                String fetchCartSql = "SELECT ci.product_id, ci.quantity, p.price " +
                                      "FROM cart_items ci " +
                                      "JOIN products p ON ci.product_id = p.product_id " +
                                      "WHERE ci.user_id = ?";
                List<Map<String, Object>> cartItems = jdbcTemplate.queryForList(fetchCartSql, userId);

                double grandTotal = 0.0;
                for (Map<String, Object> item : cartItems) {
                    int qty = ((Number) item.get("quantity")).intValue();
                    double price = ((Number) item.get("price")).doubleValue();
                    grandTotal += (price * qty);
                }

                if (grandTotal <= 0 && payload.containsKey("grandTotal") && payload.get("grandTotal") != null) {
                    try {
                        grandTotal = ((Number) payload.get("grandTotal")).doubleValue();
                    } catch (Exception ignored) {}
                }

                // Insert into orders table with actual full grand total
                String insertOrderSql = "INSERT INTO orders (order_id, user_id, total_amount, status, created_at, updated_at) " +
                                        "VALUES (?, ?, ?, 'SUCCESS', NOW(), NOW()) " +
                                        "ON DUPLICATE KEY UPDATE total_amount=?, status=?, updated_at=NOW()";
                jdbcTemplate.update(insertOrderSql, razorpayOrderId, userId, grandTotal, grandTotal, "SUCCESS");

                // Insert each cart item into order_items table
                String insertOrderItemSql = "INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, total_price) " +
                                            "VALUES (?, ?, ?, ?, ?)";
                for (Map<String, Object> item : cartItems) {
                    Long productId = ((Number) item.get("product_id")).longValue();
                    int qty = ((Number) item.get("quantity")).intValue();
                    double price = ((Number) item.get("price")).doubleValue();
                    double lineTotal = price * qty;
                    jdbcTemplate.update(insertOrderItemSql, razorpayOrderId, productId, qty, price, lineTotal);
                }

                // Clear user cart on successful order placement
                String clearCartSql = "DELETE FROM cart_items WHERE user_id = ?";
                jdbcTemplate.update(clearCartSql, userId);

                Map<String, Object> response = new HashMap<>();
                response.put("status", "SUCCESS");
                response.put("message", "Payment verified and order placed successfully!");
                response.put("paymentId", razorpayPaymentId);
                response.put("orderId", razorpayOrderId);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Payment signature verification failed");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Verification error: " + e.getMessage());
        }
    }

    private Long getUserIdByEmail(String email) {
        String sql = "SELECT id FROM user WHERE email = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email);
        if (result.isEmpty()) {
            return null;
        }
        return ((Number) result.get(0).get("id")).longValue();
    }

    private Map<String, Object> getUserInfoByEmail(String email) {
        String sql = "SELECT id, full_name FROM user WHERE email = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email);
        if (result.isEmpty()) {
            return null;
        }
        return result.get(0);
    }
}
