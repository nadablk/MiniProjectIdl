package gateaway.cloud.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import java.net.URI;

import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;

@Configuration
public class GatewayConfig {

    // Spring Boot Backend URL (same device - localhost)
    private static final String SPRING_BOOT_URL = "http://localhost:8081";
    
    // Django Backend URL (remote device - update this IP to Device 2's IP)
    private static final String DJANGO_URL = "http://localhost:9090";
    
    // Chatbot Service URL
    private static final String CHATBOT_URL = "http://localhost:8002";


    @Bean
    @SuppressWarnings("deprecation")
    public RouterFunction<ServerResponse> gatewayRoutes() {
        return route("spring-students")
                .GET("/api/students/**", http(URI.create(SPRING_BOOT_URL)))
                .POST("/api/students/**", http(URI.create(SPRING_BOOT_URL)))
                .PUT("/api/students/**", http(URI.create(SPRING_BOOT_URL)))
                .DELETE("/api/students/**", http(URI.create(SPRING_BOOT_URL)))
                .build()
                
            .and(route("spring-universities")
                .GET("/api/universities/**", http(URI.create(SPRING_BOOT_URL)))
                .POST("/api/universities/**", http(URI.create(SPRING_BOOT_URL)))
                .PUT("/api/universities/**", http(URI.create(SPRING_BOOT_URL)))
                .DELETE("/api/universities/**", http(URI.create(SPRING_BOOT_URL)))
                .build())
                
            .and(route("django-courses")
                .GET("/api/courses/**", http(URI.create(DJANGO_URL)))
                .POST("/api/courses/**", http(URI.create(DJANGO_URL)))
                .PUT("/api/courses/**", http(URI.create(DJANGO_URL)))
                .DELETE("/api/courses/**", http(URI.create(DJANGO_URL)))
                .build())
                
            .and(route("django-enrollments")
                .GET("/api/enrollments/**", http(URI.create(DJANGO_URL)))
                .POST("/api/enrollments/**", http(URI.create(DJANGO_URL)))
                .PUT("/api/enrollments/**", http(URI.create(DJANGO_URL)))
                .DELETE("/api/enrollments/**", http(URI.create(DJANGO_URL)))
                .build())
                
            // Spring Boot GraphQL - Route to /graphql endpoint on Spring Boot
            .and(route("spring-graphql")
                .POST("/graphql/spring/**", http(SPRING_BOOT_URL + "/graphql"))
                .GET("/graphql/spring/**", http(SPRING_BOOT_URL + "/graphql"))
                .build())
                
            // Django GraphQL - Route to /graphql endpoint on Django
            .and(route("django-graphql")
                .POST("/graphql/django/**", http(DJANGO_URL + "/graphql"))
                .GET("/graphql/django/**", http(DJANGO_URL + "/graphql"))
                .build())
                
            // Chatbot routes
            .and(route("chatbot-translate")
                .POST("/api/chatbot/translate/**", http(URI.create(CHATBOT_URL)))
                .build())
                
            .and(route("chatbot-summarize")
                .POST("/api/chatbot/summarize/**", http(URI.create(CHATBOT_URL)))
                .build())
                
            .and(route("chatbot-health")
                .GET("/api/chatbot/health/**", http(URI.create(CHATBOT_URL)))
                .build());
    }
}
