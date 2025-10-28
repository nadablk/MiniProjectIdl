package gateaway.cloud.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/gateway")
public class GatewayController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "API Gateway");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("routes", Map.of(
            "students", "/api/students/** → Spring Boot (localhost:8081)",
            "universities", "/api/universities/** → Spring Boot (localhost:8081)",
            "courses", "/api/courses/** → Django (192.168.117.225:9090)",
            "enrollments", "/api/enrollments/** → Django (192.168.117.225:9090)",
            "graphql", "/graphql/** → Spring Boot (localhost:8081)"
        ));
        return ResponseEntity.ok(health);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> info() {
        Map<String, String> info = new HashMap<>();
        info.put("name", "API Gateway");
        info.put("version", "1.0.0");
        info.put("description", "Central API Gateway for Student Management System");
        info.put("port", "8080");
        info.put("backends", "Spring Boot (8081) + Django (9090)");
        return ResponseEntity.ok(info);
    }
}
