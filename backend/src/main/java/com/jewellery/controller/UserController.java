package com.jewellery.controller;
import com.jewellery.dto.ChangePasswordRequest;
import org.springframework.http.ResponseEntity;
import com.jewellery.dto.ForgotPasswordRequest;
import com.jewellery.dto.LoginRequest;
import com.jewellery.dto.ResetPasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.jewellery.entity.User;
import com.jewellery.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registered = userService.registerUser(user);
            return ResponseEntity.ok(registered);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            String result = userService.loginUser(request);
            if ("Invalid Email or Password".equalsIgnoreCase(result)) {
                return ResponseEntity.status(401).body(java.util.Map.of("error", result, "message", result));
            }
            return ResponseEntity.ok(java.util.Map.of("token", result, "message", "Login Successful"));
        } catch (Throwable e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Login error: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.changePassword(request));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Password change failed: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            System.out.println("========== FORGOT PASSWORD API CALLED ==========");
            return ResponseEntity.ok(userService.forgotPassword(request));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Forgot password failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.resetPassword(request));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Reset password failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout Successful");
    }

}
