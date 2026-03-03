// src/api/apiUtils.js

const API_CONFIG = {
  localhost: {
    baseURL: 'http://localhost:8080',
    requiresAuth: false,
    requiresCSRF: false,
    username: '',
    password: ''
  },
  production: {
    baseURL: 'https://ktfrancesrv2.kalyanicorp.com',
    requiresAuth: true,
    requiresCSRF: true,
    username: 'caddok',
    password: ''
  }
};

// Auto-detect environment
const getEnvironment = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'localhost';
  }
  return 'production';
};

const ENV = getEnvironment();
const CONFIG = API_CONFIG[ENV];

// Get CSRF Token from cookies
const getCSRFTokenFromCookie = () => {
  const name = 'CSRFToken=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

// Get headers for API requests
const getHeaders = (method = 'GET', includeContentType = true) => {
  const headers = {};

  // Basic Auth
  if (CONFIG.requiresAuth) {
    headers['Authorization'] = 'Basic ' + btoa(`${CONFIG.username}:${CONFIG.password}`);
  }

  // Content Type
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  // CSRF Token for modifying requests - cookie se nikaal ke bhejo
  if (CONFIG.requiresCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())) {
    const csrfToken = getCSRFTokenFromCookie();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  return headers;
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const { method = 'GET', body = null } = options;

  const url = `${CONFIG.baseURL}${endpoint}`;
  const headers = getHeaders(method);

  const fetchOptions = {
    method,
    headers,
    credentials: CONFIG.requiresAuth ? 'include' : 'same-origin'
  };

  if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
};

// API Methods
export const api = {
  // GET request
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),

  // POST request
  post: (endpoint, body) => apiCall(endpoint, { method: 'POST', body }),

  // PUT request
  put: (endpoint, body) => apiCall(endpoint, { method: 'PUT', body }),

  // DELETE request
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),

  // Get base URL
  getBaseURL: () => CONFIG.baseURL,

  // Get environment
  getEnvironment: () => ENV
};

export default api;