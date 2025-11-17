// ===================================================================
// API Configuration - GATEWAY ONLY
// ===================================================================
// All requests go through the Gateway on port 9091
// The Gateway routes to GraphQL (port 9000) which connects to all services
// ===================================================================

export const API_CONFIG = {
  // Single GraphQL endpoint through Gateway
  GRAPHQL_ENDPOINT: "https://gateaway-service1.onrender.com/graphql",
    // GRAPHQL_ENDPOINT: "http://localhost:9091/graphql",


};

// For deployment or network access, change to:
// GRAPHQL_ENDPOINT: "http://YOUR_IP:9091/graphql"
