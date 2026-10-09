const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `API request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  health: () => request("/health"),
  translateBatch: (texts, target) => request("/translate/batch", { method: "POST", body: JSON.stringify({ texts, target }) }),
  getSchemes: (q = "") => request(`/schemes${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getScheme: (id) => request(`/schemes/${encodeURIComponent(id)}`),
  getDocuments: (id) => request(`/schemes/${encodeURIComponent(id)}/documents`),
  checkEligibility: (profile) => request("/eligibility/check", { method: "POST", body: JSON.stringify(profile) }),
  recommendSchemes: (profile) => request("/schemes/recommend", { method: "POST", body: JSON.stringify(profile) }),
  getFaqs: (schemeId = "") => request(`/faqs${schemeId ? `?scheme_id=${encodeURIComponent(schemeId)}` : ""}`),

  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (identifier, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ identifier, password }) }),
  logout: (token) => request("/auth/logout", { method: "POST", headers: authHeaders(token) }),
  me: (token) => request("/auth/me", { headers: authHeaders(token) }),
  updateProfile: (token, data) => request("/profile", { method: "PUT", headers: authHeaders(token), body: JSON.stringify(data) }),

  processVoice: (text, language = "english", sessionId = "browser-demo", profile = null, token = "") => request("/voice/process", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ text, language, session_id: sessionId, profile }),
  }),
  setVoiceLanguage: (language) => request("/voice/language", { method: "POST", body: JSON.stringify({ language }) }),
  resetVoice: (sessionId = "browser-demo", token = "") => request("/voice/reset", { method: "POST", headers: authHeaders(token), body: JSON.stringify({ session_id: sessionId }) }),
  getVoiceLanguages: () => request("/voice/languages"),
};
