// services/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage or sessionStorage
  getAuthToken() {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      );
    }
    return null;
  }

  // Set auth token (with storage type option)
  setAuthToken(token, rememberMe = true) {
    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("authToken", token);
        // Clear session storage if exists
        sessionStorage.removeItem("authToken");
      } else {
        sessionStorage.setItem("authToken", token);
        // Clear local storage if exists
        localStorage.removeItem("authToken");
      }
    }
  }

  // Remove auth token from both storage types
  removeAuthToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
    }
  }

  // Check if token exists in localStorage (for rememberMe)
  isTokenPersistent() {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("authToken");
    }
    return false;
  }

  isPublicEndpoint(endpoint) {
    return (
      endpoint.includes("/2fa") ||
      endpoint.includes("/auth/login") ||
      endpoint.includes("/auth/register") ||
      endpoint.includes("/auth/forgot-password") ||
      endpoint.includes("/auth/reset-password") ||
      endpoint.includes("/auth/verify") ||
      endpoint.includes("/contact")
    );
  }

  // HTTP errors we handle in the UI — don't log these as unexpected errors
  isHandledError(status) {
    return [400, 401, 403, 404, 422, 429].includes(status);
  }

  // Generic request handler
  async request(endpoint, options = {}) {
    const token = this.getAuthToken();

    // Don't set Content-Type for FormData
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    // Only set Content-Type to application/json if body is NOT FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const config = {
      ...options,
      headers,
    };

    try {
      

      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Handle unauthorized
      if (response.status === 401) {
        if (!this.isPublicEndpoint(endpoint)) {
          this.removeAuthToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
      }

      // Try to parse JSON response
      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If not JSON, get text
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error(
          `Server returned non-JSON response: ${response.status}`,
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  // POST request
  post(endpoint, data) {
    const options = {
      method: "POST",
    };

    // If data is FormData, don't stringify
    if (data instanceof FormData) {
      options.body = data;
      // Don't set Content-Type - browser will set it with boundary
    } else {
      options.body = JSON.stringify(data);
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    return this.request(endpoint, options);
  }

  // PUT request
  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // PATCH request
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}



export default new ApiService();
