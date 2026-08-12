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
    public ResponseEntity<?> loginUser(
            @RequestBody(required = false) Object input,
            @RequestParam(value = "email", required = false) String emailParam,
            @RequestParam(value = "password", required = false) String passwordParam) {
        try {
            String email = "";
            String password = "";

            if (input instanceof Map<?, ?> map) {
                Object e = map.get("email");
                Object p = map.get("password");
                if (e != null) email = e.toString().trim();
                if (p != null) password = p.toString().trim();
            } else if (input instanceof LoginRequest req) {
                if (req.getEmail() != null) email = req.getEmail().trim();
                if (req.getPassword() != null) password = req.getPassword().trim();
            }

            if (email.isEmpty() && emailParam != null) email = emailParam.trim();
            if (password.isEmpty() && passwordParam != null) password = passwordParam.trim();

            if (email.isEmpty() || password.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid Email or Password", "message", "Invalid Email or Password"));
            }

            LoginRequest req = new LoginRequest();
            req.setEmail(email);
            req.setPassword(password);

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
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registered = userService.registerUser(user);
            return ResponseEntity.ok(registered);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.changePassword(request));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body("Password change failed: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.forgotPassword(request));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body("Forgot password failed: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.resetPassword(request));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body("Reset password failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout Successful");
    }
}
