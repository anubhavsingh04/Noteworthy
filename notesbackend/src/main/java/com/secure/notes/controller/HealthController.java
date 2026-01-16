package com.secure.notes.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
public class HealthController {

    @GetMapping("/api/health-check")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        log.info("Health check started /api/health-check");  // Use 'log' from @Slf4j
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "Noteworthy Backend");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/ping")
    public ResponseEntity<String> ping() {
        log.info("Health check started /api/ping");  // Use 'log' from @Slf4j
        return ResponseEntity.ok("pong");
    }
}