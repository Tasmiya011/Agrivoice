const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `API request failed: ${response.status}`);
  }
  return data;
}

export const api = {
  health: () => request("/health"),
  getSchemes: (q = "") => request(`/schemes${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getScheme: (id) => request(`/schemes/${encodeURIComponent(id)}`),
  getDocuments: (id) => request(`/schemes/${encodeURIComponent(id)}/documents`),
  checkEligibility: (profile) => request("/eligibility/check", {
    method: "POST",
    body: JSON.stringify(profile),
  }),
  recommendSchemes: (profile) => request("/schemes/recommend", {
    method: "POST",
    body: JSON.stringify(profile),
  }),
  getFaqs: (schemeId = "") => request(`/faqs${schemeId ? `?scheme_id=${encodeURIComponent(schemeId)}` : ""}`),

  // Voice/NLP integration
  processVoice: (text, language = "english") => request("/voice/process", {
    method: "POST",
    body: JSON.stringify({ text, language }),
  }),
  setVoiceLanguage: (language) => request("/voice/language", {
    method: "POST",
    body: JSON.stringify({ language }),
  }),
  resetVoice: () => request("/voice/reset", { method: "POST" }),
  getVoiceLanguages: () => request("/voice/languages"),
};
