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

    // Node.js GraphQL Gateway URL (Apollo Server - Unified GraphQL API)
    // This is the ONLY backend URL we need - GraphQL handles all the rest
    private static final String GRAPHQL_GATEWAY_URL = "https://graphql-service-qzpq.onrender.com";

    @Bean
    @SuppressWarnings("deprecation")
    public RouterFunction<ServerResponse> gatewayRoutes() {
        return route("graphql-gateway")
                // Route all /graphql/** paths to GraphQL Gateway
                .POST("/graphql/**", http(URI.create(GRAPHQL_GATEWAY_URL)))
                .GET("/graphql/**", http(URI.create(GRAPHQL_GATEWAY_URL)))
                .build()
                
            // Route root /graphql path (for Apollo Studio)
            .and(route("graphql-root")
                .POST("/graphql", http(URI.create(GRAPHQL_GATEWAY_URL)))
                .GET("/graphql", http(URI.create(GRAPHQL_GATEWAY_URL)))
                .build());
    }
}
