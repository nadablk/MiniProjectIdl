// ===================================================================
// API CONFIGURATION - CENTRAL IP MANAGEMENT
// ===================================================================
// 🔧 CHANGE NETWORK IPs HERE WHEN SWITCHING NETWORKS
// ===================================================================

// ====================
// OPTION 1: LOCALHOST (Same Machine)
// ====================
// Use this when all services run on the same computer
// Uncomment these lines and comment out OPTION 2

// export const NETWORK_CONFIG = {
//   GATEWAY_HOST: "localhost",
//   GATEWAY_PORT: 8080,
// };

// ====================
// OPTION 2: NETWORK IP (Different Machines)
// ====================
// Use this when services run on different computers in the network
// 🔧 CHANGE THIS IP to your Gateway machine's network IP

export const NETWORK_CONFIG = {
  GATEWAY_HOST: "192.168.117.225", // 🔧 CHANGE THIS when network changes
  GATEWAY_PORT: 8080,
};

// ====================
// AUTO-GENERATED URLS (Don't modify these)
// ====================
export const API_CONFIG = {
  // Gateway Base URL
  GATEWAY_BASE_URL: `http://${NETWORK_CONFIG.GATEWAY_HOST}:${NETWORK_CONFIG.GATEWAY_PORT}`,

  // REST API Endpoints
  REST_API_BASE: `http://${NETWORK_CONFIG.GATEWAY_HOST}:${NETWORK_CONFIG.GATEWAY_PORT}/api`,

  // GraphQL Endpoints
  SPRING_GRAPHQL: `http://${NETWORK_CONFIG.GATEWAY_HOST}:${NETWORK_CONFIG.GATEWAY_PORT}/graphql/spring`,
  DJANGO_GRAPHQL: `http://${NETWORK_CONFIG.GATEWAY_HOST}:${NETWORK_CONFIG.GATEWAY_PORT}/graphql/django`,
};

// ====================
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
