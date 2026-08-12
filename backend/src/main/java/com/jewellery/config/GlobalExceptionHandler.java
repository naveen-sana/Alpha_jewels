package com.jewellery.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Throwable ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage() != null ? ex.getMessage() : ex.getClass().getSimpleName());
        body.put("exceptionType", ex.getClass().getName());
        if (ex.getCause() != null) {
            body.put("cause", ex.getCause().getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
