import { useState } from "react";
import { API_CONFIG } from "../config/apiConfig";

/**
 * Connection Test Component
 * Tests the communication path: Frontend → Spring Gateway → GraphQL
 */
function ConnectionTest() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      // Test 1: Basic GraphQL query
      const response = await fetch(API_CONFIG.GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query TestConnection {
              __typename
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
      }

      setTestResult({
        success: true,
        message: "Connection successful!",
        endpoint: API_CONFIG.GRAPHQL_ENDPOINT,
        response: result.data,
      });
    } catch (err) {
      setError(err.message);
      setTestResult({
        success: false,
        message: "Connection failed",
        endpoint: API_CONFIG.GRAPHQL_ENDPOINT,
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const testFullQuery = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      // Test 2: Full query with data
      const response = await fetch(API_CONFIG.GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query TestFullConnection {
              allStudents {
                id
                firstName
                lastName
                email
              }
              allUniversities {
                id
                name
                location
              }
              chatbotHealth {
                success
                status
                service
              }
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
      }

      setTestResult({
        success: true,
        message: "Full query successful!",
        endpoint: API_CONFIG.GRAPHQL_ENDPOINT,
        response: result.data,
      });
    } catch (err) {
      setError(err.message);
      setTestResult({
        success: false,
        message: "Full query failed",
        endpoint: API_CONFIG.GRAPHQL_ENDPOINT,
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔌 Connection Test</h2>

      <div style={styles.infoBox}>
        <h3>Current Configuration:</h3>
        <p>
          <strong>Frontend:</strong> http://localhost:5173
        </p>
        <p>
          <strong>Spring Gateway:</strong> {API_CONFIG.GATEWAY_BASE_URL}
        </p>
        <p>
          <strong>GraphQL Endpoint:</strong> {API_CONFIG.GRAPHQL_ENDPOINT}
        </p>
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={testConnection}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Testing..." : "Test Basic Connection"}
        </button>

        <button
          onClick={testFullQuery}
          disabled={loading}
          style={{ ...styles.button, ...styles.buttonSecondary }}
        >
          {loading ? "Testing..." : "Test Full Query"}
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {testResult && (
        <div style={testResult.success ? styles.successBox : styles.errorBox}>
          <h3>{testResult.success ? "✅ Success" : "❌ Failed"}</h3>
          <p>
            <strong>Message:</strong> {testResult.message}
          </p>
          <p>
            <strong>Endpoint:</strong> {testResult.endpoint}
          </p>

          {testResult.response && (
            <div style={styles.responseBox}>
              <strong>Response:</strong>
              <pre style={styles.pre}>
                {JSON.stringify(testResult.response, null, 2)}
              </pre>
            </div>
          )}

          {testResult.error && (
            <div style={styles.errorDetail}>
              <strong>Error Detail:</strong>
              <pre style={styles.pre}>{testResult.error}</pre>
            </div>
          )}
        </div>
      )}

      <div style={styles.architectureBox}>
        <h3>Architecture Flow:</h3>
        <pre style={styles.pre}>
          {`Frontend (Port 5173)
    ↓
    POST ${API_CONFIG.GRAPHQL_ENDPOINT}
    ↓
Spring Gateway (Port 9091)
    ↓
    Routes to http://localhost:9000/graphql
    ↓
Node.js GraphQL (Port 9000)
    ↓
    ├─→ Spring Boot (Port 8081) - Students & Universities
    ├─→ Django (Port 9090) - Courses & Enrollments
    └─→ Chatbot (Port 8002) - Translation & Summarization`}
        </pre>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#333",
    borderBottom: "2px solid #4CAF50",
    paddingBottom: "10px",
  },
  infoBox: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    flex: 1,
  },
  buttonSecondary: {
    backgroundColor: "#2196F3",
  },
  successBox: {
    backgroundColor: "#d4edda",
    border: "1px solid #c3e6cb",
    color: "#155724",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  errorBox: {
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
    color: "#721c24",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  responseBox: {
    marginTop: "10px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "3px",
  },
  errorDetail: {
    marginTop: "10px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "3px",
  },
  architectureBox: {
    backgroundColor: "#e3f2fd",
    padding: "15px",
    borderRadius: "5px",
    marginTop: "20px",
  },
  pre: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "3px",
    overflow: "auto",
    fontSize: "12px",
  },
};

export default ConnectionTest;
