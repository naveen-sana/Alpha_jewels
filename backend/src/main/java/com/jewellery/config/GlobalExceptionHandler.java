package com.jewellery.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Throwable ex) {
        ex.printStackTrace();
        Map<String, Object> body = new HashMap<>();
        body.put("status", 500);
        body.put("error", ex.getClass().getName());
        body.put("message", ex.getMessage() != null ? ex.getMessage() : "Internal Server Error");
        if (ex.getCause() != null) {
            body.put("cause", ex.getCause().getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
