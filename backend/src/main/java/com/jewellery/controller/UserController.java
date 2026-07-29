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
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }
    
    @PostMapping("/login")
    public String loginUser(@RequestBody LoginRequest request) {
        return userService.loginUser(request);
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request) {
        return userService.changePassword(request);
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        System.out.println("========== FORGOT PASSWORD API CALLED ==========");
        return ResponseEntity.ok(userService.forgotPassword(request));
    }
    

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        return userService.resetPassword(request);
    }

    @PostMapping("/logout")
    public String logout() {
        return "Logout Successful";
    }

}
