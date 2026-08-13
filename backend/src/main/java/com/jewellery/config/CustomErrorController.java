package com.jewellery.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Map<String, Object> body = new HashMap<>();
        Object statusObj = request.getAttribute("jakarta.servlet.error.status_code");
        int status = statusObj instanceof Integer i ? i : 500;

        body.put("status", status);
        body.put("message", status == 404 ? "Resource Not Found" : (status == 401 ? "Unauthorized Access" : (status == 403 ? "Access Denied" : "An internal server error occurred")));
        return ResponseEntity.status(status).body(body);
    }
}
