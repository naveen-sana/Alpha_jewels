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

    private static final String RAZORPAY_KEY_ID = "rzp_test_TK7E94H666yiG6";
    private static final String RAZORPAY_KEY_SECRET = "77YZVjEVFbZno14mq05y3hl2";

    @Autowired
    private JdbcTemplate jdbcTemplate;

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

            // Calculate total from active cart
            String sql = "SELECT ci.quantity, p.price " +
                         "FROM ecommerce_db.cart_items ci " +
                         "JOIN ecommerce_db.products p ON ci.product_id = p.product_id " +
                         "WHERE ci.user_id = ?";

            List<Map<String, Object>> items = jdbcTemplate.queryForList(sql, userId);

            if (items.isEmpty()) {
                return ResponseEntity.badRequest().body("Your cart is empty");
            }

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

            double grandTotal = subtotal + shipping;
            // Cap at 1,500,000 paise (₹15,000) for standard Razorpay test mode transaction cap
            long amountInPaise = Math.min(Math.round(grandTotal * 100.0), 1500000L);

            if (amountInPaise <= 0) {
                return ResponseEntity.badRequest().body("Invalid order amount");
            }

            RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcpt_" + userId + "_" + System.currentTimeMillis());

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", razorpayOrder.get("id"));
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("key", RAZORPAY_KEY_ID);
            response.put("userEmail", email);
            response.put("userName", fullName != null ? fullName : email);
            response.put("subtotal", subtotal);
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
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            Long userId = getUserIdByEmail(email);
            if (userId == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            String razorpayOrderId = payload.get("razorpay_order_id");
            String razorpayPaymentId = payload.get("razorpay_payment_id");
            String razorpaySignature = payload.get("razorpay_signature");

            if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null) {
                return ResponseEntity.badRequest().body("Missing payment verification parameters");
            }

            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);

            boolean isSignatureValid = Utils.verifyPaymentSignature(attributes, RAZORPAY_KEY_SECRET);

            if (isSignatureValid) {
                // Clear user cart on successful order placement
                String clearCartSql = "DELETE FROM ecommerce_db.cart_items WHERE user_id = ?";
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
        String sql = "SELECT id FROM ecommerce_db.user WHERE email = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email);
        if (result.isEmpty()) {
            return null;
        }
        return ((Number) result.get(0).get("id")).longValue();
    }

    private Map<String, Object> getUserInfoByEmail(String email) {
        String sql = "SELECT id, full_name FROM ecommerce_db.user WHERE email = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, email);
        if (result.isEmpty()) {
            return null;
        }
        return result.get(0);
    }
}
