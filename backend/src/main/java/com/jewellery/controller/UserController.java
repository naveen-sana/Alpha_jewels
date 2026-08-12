package com.jewellery.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jewellery.dto.ChangePasswordRequest;
import com.jewellery.dto.ForgotPasswordRequest;
import com.jewellery.dto.LoginRequest;
import com.jewellery.dto.ResetPasswordRequest;
import com.jewellery.entity.Role;
import com.jewellery.entity.User;
import com.jewellery.service.JwtService;
import com.jewellery.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JwtService jwtService;

    @Autowired(required = false)
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping("/jwt-test")
    public ResponseEntity<?> testJwt() {
        try {
            String token = jwtService.generateToken("test@gmail.com", Role.USER, "Test User");
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage() != null ? e.getMessage() : e.toString()));
        }
    }

    @PostMapping("/login-test")
    public ResponseEntity<?> loginTest() {
        return ResponseEntity.ok(Map.of("status", "ok", "message", "Login Test Endpoint Ready"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody(required = false) LoginRequest request) {
        try {
            String email = request != null && request.getEmail() != null ? request.getEmail().trim() : "";
            String password = request != null && request.getPassword() != null ? request.getPassword().trim() : "";

            if (email.isEmpty() || password.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid Email or Password", "message", "Invalid Email or Password"));
            }

            LoginRequest req = new LoginRequest(email, password);
            String result = userService.loginUser(req);
            if (result != null && !result.toLowerCase().contains("invalid")) {
                return ResponseEntity.ok(Map.of("token", result, "jwt", result, "message", "Login Successful"));
            }
            return ResponseEntity.status(401).body(Map.of("error", "Invalid Email or Password", "message", "Invalid Email or Password"));
        } catch (Throwable e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid Email or Password", "message", "Invalid Email or Password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody(required = false) Map<String, Object> body) {
        try {
            if (body == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Request body is required"));
            }
            String email = body.get("email") != null ? body.get("email").toString().trim() : "";
            String password = body.get("password") != null ? body.get("password").toString().trim() : "";
            String fullName = body.get("fullName") != null ? body.get("fullName").toString().trim() : "";
            if (fullName.isEmpty() && body.get("name") != null) {
                fullName = body.get("name").toString().trim();
            }

            if (email.isEmpty() || password.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and Password are required"));
            }

            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            user.setFullName(fullName);
            user.setRole(Role.USER);

            User registered = userService.registerUser(user);
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "email", registered.getEmail()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody(required = false) Map<String, Object> body) {
        try {
            if (body == null) return ResponseEntity.badRequest().body(Map.of("error", "Request body is required"));
            ChangePasswordRequest req = new ChangePasswordRequest();
            if (body.get("email") != null) req.setEmail(body.get("email").toString().trim());
            if (body.get("oldPassword") != null) req.setOldPassword(body.get("oldPassword").toString().trim());
            if (body.get("newPassword") != null) req.setNewPassword(body.get("newPassword").toString().trim());
            return ResponseEntity.ok(Map.of("message", userService.changePassword(req)));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body(Map.of("error", "Password change failed: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody(required = false) Map<String, Object> body) {
        try {
            if (body == null || body.get("email") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            ForgotPasswordRequest req = new ForgotPasswordRequest();
            req.setEmail(body.get("email").toString().trim());
            String res = userService.forgotPassword(req);
            return ResponseEntity.ok(Map.of("message", res));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body(Map.of("error", "Forgot password failed: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody(required = false) Map<String, Object> body) {
        try {
            if (body == null || body.get("email") == null || body.get("otp") == null || body.get("newPassword") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid reset details"));
            }
            ResetPasswordRequest req = new ResetPasswordRequest();
            req.setEmail(body.get("email").toString().trim());
            req.setOtp(body.get("otp").toString().trim());
            req.setNewPassword(body.get("newPassword").toString().trim());
            String res = userService.resetPassword(req);
            return ResponseEntity.ok(Map.of("message", res));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body(Map.of("error", "Reset password failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout Successful");
    }
}
