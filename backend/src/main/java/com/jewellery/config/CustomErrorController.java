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
        Object status = request.getAttribute("jakarta.servlet.error.status_code");
        Object message = request.getAttribute("jakarta.servlet.error.message");
        Object exception = request.getAttribute("jakarta.servlet.error.exception");

        body.put("status", status != null ? status : 500);
        body.put("message", message != null ? message.toString() : "Error occurred");
        if (exception instanceof Throwable t) {
            body.put("exceptionClass", t.getClass().getName());
            body.put("exceptionMessage", t.getMessage());
            if (t.getCause() != null) {
                body.put("causeClass", t.getCause().getClass().getName());
                body.put("causeMessage", t.getCause().getMessage());
            }
        }
        return ResponseEntity.status(status != null ? (Integer) status : 500).body(body);
    }
}
