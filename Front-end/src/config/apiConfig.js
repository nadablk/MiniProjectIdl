// ===================================================================
// API CONFIGURATION - CENTRAL IP MANAGEMENT
// ===================================================================
// 🔧 CHANGE NETWORK IPs HERE WHEN SWITCHING NETWORKS
// ===================================================================

// ====================
// OPTION 1: LOCALHOST (Same Machine) - USE SPRING GATEWAY
// ====================
// Use this when all services run on the same computer
// Frontend connects through Spring Gateway which routes to GraphQL

export const NETWORK_CONFIG = {
  GATEWAY_HOST: "localhost",
  GATEWAY_PORT: 9091,
  GRAPHQL_HOST: "localhost",
  GRAPHQL_PORT: 9091, // Changed to use Spring Gateway port
};

// ====================
// OPTION 2: NETWORK IP (Different Machines) - USE SPRING GATEWAY
// ====================
// Use this when services run on different computers in the network
// 🔧 CHANGE THIS IP to your Gateway machine's network IP

// export const NETWORK_CONFIG = {
//   GATEWAY_HOST: "192.168.117.225", // 🔧 CHANGE THIS when network changes
//   GATEWAY_PORT: 9091,
//   GRAPHQL_HOST: "192.168.117.225", // 🔧 Same as Gateway (routes through it)
//   GRAPHQL_PORT: 9091, // 🔧 Same as Gateway port (routes through it)
// };

// ====================
// AUTO-GENERATED URLS (Don't modify these)
// ====================
export const API_CONFIG = {
  // Gateway Base URL (for any direct REST calls if needed)
  GATEWAY_BASE_URL: `http://${NETWORK_CONFIG.GATEWAY_HOST}:${NETWORK_CONFIG.GATEWAY_PORT}`,

  // GraphQL Endpoint (Single unified endpoint for ALL operations)
  // All queries, mutations for Students, Universities, Courses, Enrollments, and Chatbot
  GRAPHQL_ENDPOINT: `http://${NETWORK_CONFIG.GRAPHQL_HOST}:${NETWORK_CONFIG.GRAPHQL_PORT}/graphql`,
}; // ====================
// HOW TO FIND YOUR NETWORK IP
// ====================
// Windows: Open PowerShell and run: ipconfig
//   - Look for "IPv4 Address" under your active network adapter
//   - Example: 192.168.1.100
//
// Mac/Linux: Open Terminal and run: ifconfig
//   - Look for "inet" under your active network interface (en0, eth0, etc.)
//   - Example: 192.168.1.100
// ====================

export default API_CONFIG;
