// ===================================================================
// API Configuration - Direct GraphQL
// ===================================================================
// Direct connection to GraphQL service (bypassing Gateway due to cold start issues)
// GraphQL service connects to all backend services (Spring Boot, Django, Chatbot)
// ===================================================================

export const API_CONFIG = {
  // Direct GraphQL endpoint - faster, no cold start delays
  GRAPHQL_ENDPOINT: "https://graphql-service-qzpq.onrender.com/graphql",
  
  // Alternative endpoints (commented out):
  // GRAPHQL_ENDPOINT: "https://gateaway-service1.onrender.com/graphql", // Gateway (has timeout issues)
  // GRAPHQL_ENDPOINT: "http://localhost:9000/graphql", // Local GraphQL
};

// The GraphQL service routes to:
// - Spring Boot: https://miniprojectidl-13.onrender.com/api (Students, Universities)
// - Django: https://mini-project-backend11.onrender.com/api (Courses, Enrollments)
// - Chatbot: [to be deployed] (Translation, Summarization)
