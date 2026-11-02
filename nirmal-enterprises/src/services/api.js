/**
 * Nirmal Enterprises - Central API Client
 * Connects the React Frontend to the Express + Supabase Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper to get stored auth token from browser localStorage
export function getStoredToken() {
  return localStorage.getItem("nirmal_token");
}

// Helper to store login session
export function setStoredSession(token, user) {
  if (token) localStorage.setItem("nirmal_token", token);
  if (user) localStorage.setItem("nirmal_user", JSON.stringify(user));
}

// Helper to clear session on logout
export function clearStoredSession() {
  localStorage.removeItem("nirmal_token");
  localStorage.removeItem("nirmal_user");
}

// Helper to get stored user
export function getStoredUser() {
  const user = localStorage.getItem("nirmal_user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/**
 * Generic request wrapper around browser fetch()
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // ===================== AUTHENTICATION =====================
  auth: {
    login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
    register: (userData) => request("/auth/register", { method: "POST", body: userData }),
    getMe: () => request("/auth/me", { method: "GET" }),
    updateProfile: (profileData) => request("/auth/profile", { method: "PATCH", body: profileData }),
    getCustomers: () => request("/auth/customers", { method: "GET" }),
  },

  // ===================== PRODUCTS =====================
  products: {
    getAll: () => request("/products", { method: "GET" }),
    getById: (id) => request(`/products/${id}`, { method: "GET" }),
  },

  // ===================== RO SERVICES =====================
  services: {
    book: (serviceData) => request("/services", { method: "POST", body: serviceData }),
    getAll: (params = "") => request(`/services${params}`, { method: "GET" }),
    getMyServices: () => request("/services/my-services", { method: "GET" }),
    update: (id, updates) => request(`/services/${id}`, { method: "PATCH", body: updates }),
  },

  // ===================== ORDERS =====================
  orders: {
    create: (orderData) => request("/orders", { method: "POST", body: orderData }),
    getAll: () => request("/orders", { method: "GET" }),
    getMyOrders: () => request("/orders/my-orders", { method: "GET" }),
    getById: (id) => request(`/orders/${id}`, { method: "GET" }),
    updateStatus: (id, updates) => request(`/orders/${id}`, { method: "PATCH", body: updates }),
  },

  // ===================== INVENTORY =====================
  inventory: {
    getAll: () => request("/inventory", { method: "GET" }),
    updateStock: (id, updates) => request(`/inventory/${id}`, { method: "PATCH", body: updates }),
  },
};

export default api;
