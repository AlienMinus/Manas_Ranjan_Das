// src/services/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FETCH_TIMEOUT_MS = 15000;

// Helper to fetch with timeout
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error(`Request timed out after ${FETCH_TIMEOUT_MS / 1000}s while contacting server`);
    }
    throw err;
  }
}

// 📦 Fetch Aggregated Portfolio Data directly from MongoDB
export async function getPortfolioData() {
  const res = await fetchWithTimeout(`${API_BASE_URL}/portfolio-data`);
  if (!res.ok) {
    throw new Error(`Failed to load portfolio data (HTTP ${res.status})`);
  }
  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error("Invalid response from portfolio API");
  }

  return {
    hero: json.data.hero || null,
    about: json.data.about || null,
    skills: json.data.skills || [],
    projects: json.data.projects || [],
    experience: json.data.experience || [],
    contact: json.data.contact || null,
    source: "mongodb",
  };
}

// 👤 Fetch Hero
export async function getHero() {
  const res = await fetchWithTimeout(`${API_BASE_URL}/hero`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const json = await res.json();
  return json.hero || null;
}

// 📖 Fetch About
export async function getAbout() {
  const res = await fetchWithTimeout(`${API_BASE_URL}/about`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const json = await res.json();
  return json.about || null;
}

// ⚡ Fetch Skills
export async function getSkills() {
  const res = await fetchWithTimeout(`${API_BASE_URL}/skills`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const json = await res.json();
  return json.skills || [];
}

// 🚀 Fetch Projects
export async function getProjects(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/projects${query ? `?${query}` : ""}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const json = await res.json();
  return json.projects || [];
}

// 💼 Fetch Experience
export async function getExperience(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/experience${query ? `?${query}` : ""}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const json = await res.json();
  return json.experience || [];
}

// 📞 Fetch Contact Info
export async function getContactInfo() {
  const res = await fetchWithTimeout(`${API_BASE_URL}/contact-info`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const json = await res.json();
  return json.contact || null;
}

// 📩 Send Contact Form
export async function sendContactMessage(payload) {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// 🏥 Fetch Health & Database Status
export async function getHealthStatus() {
  const res = await fetchWithTimeout(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed (HTTP ${res.status})`);
  return res.json();
}

// ==========================================================================
// 🔐 ADMIN CRUD API CLIENT METHODS
// ==========================================================================

function getAdminHeaders(password) {
  return {
    "Content-Type": "application/json",
    "x-admin-password": password,
  };
}

// --- Hero CRUD ---
export async function updateHeroApi(data, password) {
  const res = await fetch(`${API_BASE_URL}/admin/hero`, {
    method: "PUT",
    headers: getAdminHeaders(password),
    body: JSON.stringify(data),
  });
  return res.json();
}

// --- About CRUD ---
export async function updateAboutApi(data, password) {
  const res = await fetch(`${API_BASE_URL}/admin/about`, {
    method: "PUT",
    headers: getAdminHeaders(password),
    body: JSON.stringify(data),
  });
  return res.json();
}

// --- Skills CRUD ---
export async function createSkillApi(data, password) {
  const res = await fetch(`${API_BASE_URL}/admin/skills`, {
    method: "POST",
    headers: getAdminHeaders(password),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateSkillApi(id, data, password) {
  const res = await fetch(`${API_BASE_URL}/admin/skills/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(password),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSkillApi(id, password) {
  const res = await fetch(`${API_BASE_URL}/admin/skills/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(password),
  });
  return res.json();
}

// --- Projects CRUD ---
export async function createProjectApi(data, password) {
  const res = await fetch(`${API_BASE_URL}/admin/projects`, {
    method: "POST",
    headers: getAdminHeaders(password),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProjectApi(id, data, password) {
  const res = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(password),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProjectApi(id, password) {
  const res = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(password),
  });
  return res.json();
}

// --- Experience CRUD ---
export async function createExperienceApi(data, password) {
  const res = await fetch(`${API_BASE_URL}/admin/experience`, {
    method: "POST",
    headers: getAdminHeaders(password),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateExperienceApi(id, data, password) {
  const res = await fetch(`${API_BASE_URL}/admin/experience/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(password),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteExperienceApi(id, password) {
  const res = await fetch(`${API_BASE_URL}/admin/experience/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(password),
  });
  return res.json();
}

// --- Contact Info CRUD ---
export async function updateContactInfoApi(data, password) {
  const res = await fetch(`${API_BASE_URL}/admin/contact-info`, {
    method: "PUT",
    headers: getAdminHeaders(password),
    body: JSON.stringify(data),
  });
  return res.json();
}

// --- Messages Inbox ---
export async function getAdminMessagesApi(password) {
  const res = await fetch(`${API_BASE_URL}/admin/messages`, {
    method: "GET",
    headers: getAdminHeaders(password),
  });
  return res.json();
}

export async function deleteAdminMessageApi(id, password) {
  const res = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(password),
  });
  return res.json();
}
