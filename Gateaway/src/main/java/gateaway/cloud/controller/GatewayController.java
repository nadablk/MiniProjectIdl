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
            "graphql", "/graphql/** → GraphQL Gateway (https://graphql-service-qzpq.onrender.com)",
            "note", "All queries go through GraphQL which routes to: Spring Boot API (https://miniprojectidl-13.onrender.com/api), Django API (https://mini-project-backend11.onrender.com/api)"
        ));
        return ResponseEntity.ok(health);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> info() {
        Map<String, String> info = new HashMap<>();
        info.put("name", "API Gateway");
        info.put("version", "1.0.0");
        info.put("description", "Central API Gateway routing to GraphQL Service");
        info.put("port", "9091");
        info.put("graphql_service", "https://graphql-service-qzpq.onrender.com");
        info.put("architecture", "Gateway → GraphQL → (Spring Boot API + Django API + Chatbot API)");
        return ResponseEntity.ok(info);
    }
}