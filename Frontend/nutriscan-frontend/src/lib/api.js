const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Core request helper. Uses httpOnly cookies for auth (credentials: 'include'),
 * matching the NutriScan backend's cookie-based JWT setup.
 */
export async function apiRequest(endpoint, method = 'GET', body = null) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : null,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// ---------- Auth ----------
export const authApi = {
  signup: (payload) => apiRequest('/auth/signup', 'POST', payload),
  login: (payload) => apiRequest('/auth/login', 'POST', payload),
  logout: () => apiRequest('/auth/logout', 'POST'),
  me: () => apiRequest('/auth/me', 'GET'),
  updateHealthProfile: (payload) => apiRequest('/auth/health-profile', 'PUT', payload),
};

// ---------- Food entries ----------
export const foodApi = {
  getEntries: () => apiRequest('/food', 'GET'),
  createEntry: (payload) => apiRequest('/food', 'POST', payload),
  deleteEntry: (id) => apiRequest(`/food/${id}`, 'DELETE'),
  getStats: () => apiRequest('/food/stats', 'GET'),
};

// ---------- AI ----------
export const aiApi = {
  analyzeFood: (payload) => apiRequest('/ai/analyze', 'POST', payload),
  getCravingAlternatives: (craving) => apiRequest('/ai/craving', 'POST', { craving }),
  scanLabel: (imageBase64, mimeType) =>
    apiRequest('/ai/scan-label', 'POST', { imageBase64, mimeType }),
};