# 🌐 Spring Cloud Gateway - Complete Guide

## 📚 Table of Contents

1. [What is an API Gateway?](#what-is-an-api-gateway)
2. [Why Do We Need It?](#why-do-we-need-it)
3. [How API Gateway Works](#how-api-gateway-works)
4. [Spring Cloud Gateway Architecture](#spring-cloud-gateway-architecture)
5. [Key Concepts](#key-concepts)
6. [Implementation Guide](#implementation-guide)
7. [Your Project Integration](#your-project-integration)
8. [Advanced Features](#advanced-features)

---

## 🎯 What is an API Gateway?

An **API Gateway** is a **single entry point** for all client requests in a microservices architecture. Think of it as a **receptionist** in a large office building.

### 🏢 Real-World Analogy

Imagine a shopping mall with multiple stores:

**WITHOUT Gateway (Current Setup):**

```
Customer → Goes directly to each store
- Store A (Spring Boot - Students)    @ 192.168.1.100:8081
- Store B (Django - Courses)           @ 192.168.1.200:9090
- Store C (Another Service)            @ 192.168.1.150:8080
```

Problems:

- Customer must know the location of EVERY store
- If a store moves, customer gets lost
- No central security check
- Can't control traffic

**WITH Gateway:**

```
Customer → Information Desk → Directs to correct store
         (API Gateway)
         @ 192.168.1.50:8080
```

Benefits:

- Customer only needs to know ONE location
- Gateway handles routing internally
- Central security/authentication
- Can balance traffic

---

## 🤔 Why Do We Need It?

### **Your Current Problem:**

**Frontend needs to know multiple backend URLs:**

```javascript
// api.js
const SPRING_API_BASE_URL = "http://192.168.117.225:8081/api"; // Spring Boot
const DJANGO_API_BASE_URL = "http://192.168.117.225:9090/api"; // Django
```

**Issues:**

1. ❌ Frontend must track multiple IPs
2. ❌ If backend IP changes, frontend breaks
3. ❌ CORS configuration needed for EACH backend
4. ❌ No central authentication
5. ❌ Can't monitor all traffic in one place

### **With API Gateway:**

**Frontend only knows ONE URL:**

```javascript
// api.js
const API_BASE_URL = "http://192.168.117.225:8080/api"; // Gateway only!

// Gateway automatically routes:
// /api/students     → Spring Boot (localhost:8081)
// /api/universities → Spring Boot (localhost:8081)
// /api/courses      → Django (localhost:9090)
// /api/enrollments  → Django (localhost:9090)
```

**Benefits:**

1. ✅ Single endpoint for frontend
2. ✅ Backend IPs can change freely
3. ✅ CORS configured once (on Gateway)
4. ✅ Central authentication/authorization
5. ✅ Load balancing & monitoring

---

## 🔄 How API Gateway Works

### **Request Flow:**

```
┌──────────┐
│  Client  │  (React Frontend)
│ Browser  │
└────┬─────┘
     │ HTTP Request
     │ GET /api/students
     ▼
┌────────────────┐
│  API Gateway   │  Port 8080
│ (Spring Cloud) │
└────┬───────────┘
     │
     │ Routing Logic:
     │ - Checks path (/api/students)
     │ - Finds matching route
     │ - Forwards to backend
     │
     ├─────────────────────┬──────────────────┐
     ▼                     ▼                  ▼
┌─────────────┐    ┌──────────────┐   ┌──────────────┐
│ Spring Boot │    │    Django    │   │   Service C  │
│   :8081     │    │    :9090     │   │    :8082     │
└─────────────┘    └──────────────┘   └──────────────┘
 Students/Unis       Courses/Enroll      Other
```

### **Step-by-Step Process:**

1. **Client Request:** Browser sends `GET http://gateway:8080/api/students`
2. **Gateway Receives:** Gateway intercepts the request
3. **Route Matching:** Gateway checks: "Does `/api/students` match any route?"
4. **Route Found:** Yes! Route says: "Forward to `http://localhost:8081/api/students`"
5. **Forward Request:** Gateway sends request to Spring Boot
6. **Backend Response:** Spring Boot returns student data
7. **Gateway Returns:** Gateway forwards response back to client
8. **Client Receives:** Browser gets student data (doesn't know about Spring Boot!)

---

## 🏗️ Spring Cloud Gateway Architecture

### **Core Components:**

```
┌────────────────────────────────────────┐
│         API Gateway                     │
│  ┌──────────────────────────────────┐  │
│  │  Route Predicates                │  │
│  │  (Match requests)                │  │
│  │  - Path: /api/students/**        │  │
│  │  - Method: GET, POST             │  │
│  │  - Headers: Authorization        │  │
│  └──────────────────────────────────┘  │
│                 ↓                       │
│  ┌──────────────────────────────────┐  │
│  │  Filters                         │  │
│  │  (Modify requests/responses)     │  │
│  │  - Add headers                   │  │
│  │  - Authentication                │  │
│  │  - Rate limiting                 │  │
│  │  - Logging                       │  │
│  └──────────────────────────────────┘  │
│                 ↓                       │
│  ┌──────────────────────────────────┐  │
│  │  URI Handler                     │  │
│  │  (Where to forward)              │  │
│  │  - http://localhost:8081         │  │
│  │  - http://localhost:9090         │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

## 📖 Key Concepts

### **1. Routes**

A **Route** is a rule that tells the gateway where to send requests.

**Components of a Route:**

- **ID**: Unique identifier for the route
- **URI**: Destination backend service
- **Predicates**: Conditions to match (path, method, headers)
- **Filters**: Transformations to apply

**Example Route:**

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: student-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/students/**
          filters:
            - AddResponseHeader=X-Response-From, Spring-Boot
```

**Translation:**

- **ID**: Call this route "student-service"
- **URI**: Forward to Spring Boot at localhost:8081
- **Predicates**: Match any path starting with `/api/students/`
- **Filters**: Add a header to the response

### **2. Predicates**

**Predicates** are conditions that must be TRUE for a route to match.

**Common Predicates:**

| Predicate | Example                 | Matches                            |
| --------- | ----------------------- | ---------------------------------- |
| Path      | `Path=/api/students/**` | `/api/students`, `/api/students/5` |
| Method    | `Method=GET,POST`       | GET and POST requests only         |
| Header    | `Header=Authorization`  | Requests with Authorization header |
| Query     | `Query=type,premium`    | `?type=premium`                    |
| Host      | `Host=**.example.com`   | `api.example.com`                  |

**Example:**

```yaml
predicates:
  - Path=/api/students/**
  - Method=GET,POST
  - Header=X-Request-Type, student-api
```

**Matches:** `GET /api/students/5` with header `X-Request-Type: student-api`

### **3. Filters**

**Filters** modify requests before forwarding or responses before returning.

**Common Filters:**

| Filter              | Purpose                | Example                             |
| ------------------- | ---------------------- | ----------------------------------- |
| AddRequestHeader    | Add header to request  | `AddRequestHeader=X-User, Admin`    |
| AddResponseHeader   | Add header to response | `AddResponseHeader=X-From, Gateway` |
| RemoveRequestHeader | Remove header          | `RemoveRequestHeader=Cookie`        |
| RewritePath         | Change path            | `/api/students/` → `/students/`     |
| StripPrefix         | Remove path segments   | `/api/students` → `/students`       |
| RequestRateLimiter  | Limit requests         | Max 100 req/min                     |
| CircuitBreaker      | Handle failures        | Fallback if service down            |

**Example:**

```yaml
filters:
  - StripPrefix=1 # Remove first path segment
  # /api/students → /students

  - AddRequestHeader=X-Gateway-Version, 1.0
  # Adds header to every request

  - RewritePath=/api/(?<segment>.*), /$\{segment}
  # /api/students → /students
```

### **4. Load Balancing**

Distribute requests across multiple instances of the same service.

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: student-service
          uri: lb://STUDENT-SERVICE # Load balancer
          predicates:
            - Path=/api/students/**
```

Requires service discovery (Eureka, Consul).

---

## 💻 Implementation Guide

### **Step 1: Create Gateway Project**

**Option A: Spring Initializr (https://start.spring.io/)**

- Project: Maven
- Language: Java
- Spring Boot: 3.5.6
- Dependencies: **Gateway**, **Reactive Web**

**Option B: Manual Setup**

Create new Spring Boot project with dependencies:

```xml
<dependencies>
    <!-- Spring Cloud Gateway -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2023.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### **Step 2: Configure Routes**

**application.yml:**

```yaml
server:
  port: 8080 # Gateway port

spring:
  application:
    name: api-gateway

  cloud:
    gateway:
      # CORS Configuration (once for all services!)
      globalcors:
        corsConfigurations:
          "[/**]":
            allowedOrigins: "*"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true

      # Routes Configuration
      routes:
        # Spring Boot Routes (Students & Universities)
        - id: spring-boot-students
          uri: http://localhost:8081
          predicates:
            - Path=/api/students/**
          filters:
            - StripPrefix=0

        - id: spring-boot-universities
          uri: http://localhost:8081
          predicates:
            - Path=/api/universities/**
          filters:
            - StripPrefix=0

        # Django Routes (Courses & Enrollments)
        - id: django-courses
          uri: http://localhost:9090
          predicates:
            - Path=/api/courses/**
          filters:
            - StripPrefix=0

        - id: django-enrollments
          uri: http://localhost:9090
          predicates:
            - Path=/api/enrollments/**
          filters:
            - StripPrefix=0
```

### **Step 3: Main Application Class**

**GatewayApplication.java:**

```java
package com.project.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

### **Step 4: Custom Route Configuration (Optional)**

**Java Configuration Alternative:**

```java
package com.project.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // Spring Boot - Students
            .route("students", r -> r
                .path("/api/students/**")
                .uri("http://localhost:8081"))

            // Spring Boot - Universities
            .route("universities", r -> r
                .path("/api/universities/**")
                .uri("http://localhost:8081"))

            // Django - Courses
            .route("courses", r -> r
                .path("/api/courses/**")
                .uri("http://localhost:9090"))

            // Django - Enrollments
            .route("enrollments", r -> r
                .path("/api/enrollments/**")
                .uri("http://localhost:9090"))

            .build();
    }
}
```

### **Step 5: Run the Gateway**

```bash
mvn spring-boot:run
```

Gateway starts on port **8080**.

---

## 🔧 Your Project Integration

### **Before (Without Gateway):**

```
Frontend (Device 3)
├── Spring Boot API @ 192.168.117.225:8081
│   ├── /api/students
│   └── /api/universities
│
└── Django API @ 192.168.117.225:9090
    ├── /api/courses
    └── /api/enrollments
```

**Frontend code:**

```javascript
const SPRING_API_BASE_URL = "http://192.168.117.225:8081/api";
const DJANGO_API_BASE_URL = "http://192.168.117.225:9090/api";
```

### **After (With Gateway):**

```
Frontend (Device 3)
└── API Gateway @ 192.168.117.225:8080
    ├── /api/students     → Spring Boot :8081
    ├── /api/universities → Spring Boot :8081
    ├── /api/courses      → Django :9090
    └── /api/enrollments  → Django :9090
```

**Frontend code (SIMPLIFIED!):**

```javascript
const API_BASE_URL = "http://192.168.117.225:8080/api";

// All requests go through gateway!
fetch(`${API_BASE_URL}/students`); // → Gateway → Spring Boot
fetch(`${API_BASE_URL}/courses`); // → Gateway → Django
fetch(`${API_BASE_URL}/enrollments`); // → Gateway → Django
```

### **Project Structure:**

```
mini projet IDL/
├── Backend_spring/        (Port 8081)
├── backend/              (Django - Port 9090)
├── Front-end/            (React - Port 5173)
└── Gateway/              (NEW! - Port 8080)
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/project/gateway/
    │       │       └── GatewayApplication.java
    │       └── resources/
    │           └── application.yml
    └── pom.xml
```

---

## 🎨 Advanced Features

### **1. Request/Response Logging**

```java
@Component
public class LoggingFilter implements GlobalFilter {

    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        logger.info("Request: {} {}",
            exchange.getRequest().getMethod(),
            exchange.getRequest().getPath());

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            logger.info("Response Status: {}",
                exchange.getResponse().getStatusCode());
        }));
    }
}
```

### **2. Authentication Filter**

```java
@Component
public class AuthenticationFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String authHeader = exchange.getRequest()
            .getHeaders()
            .getFirst("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Validate token...
        return chain.filter(exchange);
    }
}
```

### **3. Rate Limiting**

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: students
          uri: http://localhost:8081
          predicates:
            - Path=/api/students/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10 # Tokens per second
                redis-rate-limiter.burstCapacity: 20 # Max burst
```

### **4. Circuit Breaker (Resilience)**

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: students
          uri: http://localhost:8081
          predicates:
            - Path=/api/students/**
          filters:
            - name: CircuitBreaker
              args:
                name: studentService
                fallbackUri: forward:/fallback/students
```

```java
@RestController
public class FallbackController {

    @GetMapping("/fallback/students")
    public ResponseEntity<String> studentsFallback() {
        return ResponseEntity.ok("Service temporarily unavailable. Please try again later.");
    }
}
```

### **5. Path Rewriting**

```yaml
filters:
  - RewritePath=/api/(?<segment>.*), /$\{segment}
  # Removes '/api' prefix before forwarding
  # Gateway: /api/students/5
  # Backend: /students/5
```

### **6. Custom Headers**

```yaml
filters:
  - AddRequestHeader=X-Gateway-Request, true
  - AddResponseHeader=X-Powered-By, API-Gateway
  - RemoveRequestHeader=Cookie # Remove sensitive headers
```

---

## 📊 Comparison: Before vs After

### **Complexity:**

| Aspect         | Without Gateway | With Gateway        |
| -------------- | --------------- | ------------------- |
| Frontend URLs  | 2+ URLs         | 1 URL               |
| CORS Config    | Each backend    | Once (gateway)      |
| IP Changes     | Update frontend | Update gateway only |
| Authentication | Each backend    | Once (gateway)      |
| Monitoring     | Multiple logs   | Centralized         |
| Load Balancing | Manual          | Automatic           |

### **Performance:**

- **Overhead**: ~5-10ms per request (minimal)
- **Benefits**: Load balancing, caching, failover
- **Net Result**: Better overall performance

### **Security:**

- **Centralized**: All requests go through one point
- **Authentication**: Single implementation
- **Rate Limiting**: Protect all services
- **Hide Backend**: Frontend never knows backend IPs

---

## 🎯 Summary

### **What You Learned:**

1. ✅ **What**: API Gateway is a single entry point for microservices
2. ✅ **Why**: Simplifies frontend, centralizes concerns
3. ✅ **How**: Routes requests based on path/conditions
4. ✅ **Implementation**: Spring Cloud Gateway with YAML/Java config
5. ✅ **Benefits**: Single URL, CORS, auth, monitoring, load balancing

### **Your Project Benefits:**

**Before:**

```javascript
// Frontend knows about 2 backends
const SPRING_URL = "http://192.168.117.225:8081/api";
const DJANGO_URL = "http://192.168.117.225:9090/api";
```

**After:**

```javascript
// Frontend only knows gateway
const API_URL = "http://192.168.117.225:8080/api";
```

### **Next Steps:**

1. Create Gateway project
2. Configure routes for Spring Boot & Django
3. Update frontend to use single URL
4. Add authentication/logging
5. Deploy gateway

---

## 🚀 Quick Start Command

```bash
# Create gateway project
spring init --dependencies=gateway,webflux gateway

# Configure routes in application.yml
# Run gateway
mvn spring-boot:run

# Update frontend
const API_URL = "http://gateway-ip:8080/api";
```

**Congratulations!** You now understand API Gateways! 🎉
