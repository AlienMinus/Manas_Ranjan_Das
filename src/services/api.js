// src/services/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FETCH_TIMEOUT_MS = 3500;

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
    throw err;
  }
}

// 📦 Fetch Aggregated All Portfolio Data from MongoDB
export async function getPortfolioData() {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/portfolio-data`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) {
      return {
        hero: json.data.hero || null,
        about: json.data.about || null,
        skills: json.data.skills || [],
        projects: json.data.projects || [],
        experience: json.data.experience || [],
        contact: json.data.contact || {},
        source: "mongodb",
      };
    }
  } catch (err) {
    console.warn("MongoDB API connection notice:", err.message);
  }

  return {
    hero: null,
    about: null,
    skills: [],
    projects: [],
    experience: [],
    contact: {},
    source: "offline",
  };
}

// 👤 Fetch Hero
export async function getHero() {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/hero`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.hero) return json.hero;
    }
  } catch {
    // offline
  }
  return null;
}

// 📖 Fetch About
export async function getAbout() {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/about`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.about) return json.about;
    }
  } catch {
    // offline
  }
  return null;
}

// ⚡ Fetch Skills
export async function getSkills() {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/skills`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.skills?.length) return json.skills;
    }
  } catch {
    // offline
  }
  return [];
}

// 🚀 Fetch Projects
export async function getProjects(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/projects${query ? `?${query}` : ""}`;
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.projects?.length) return json.projects;
    }
  } catch {
    // offline
  }
  return [];
}

// 💼 Fetch Experience
export async function getExperience(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/experience${query ? `?${query}` : ""}`;
    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.experience?.length) return json.experience;
    }
  } catch {
    // offline
  }
  return [];
}

// 📞 Fetch Contact Info
export async function getContactInfo() {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/contact-info`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.contact) return json.contact;
    }
  } catch {
    // offline
  }
  return {};
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
