// src/chatbot/rag.js
import about from "../data/about.json";
import experience from "../data/experience.json";
import projects from "../data/projects.json";
import skills from "../data/skills.json";
import hero from "../data/hero.json";
import contact from "../data/contact.json";
import resumePdf from "../data/resume.pdf";

// ---------- Helpers ----------

const safeString = (v) => (v == null ? "" : String(v));
const lc = (v) => safeString(v).toLowerCase();

const tokenize = (q) =>
  lc(q)
    .split(/[\s,.;!?]+/)
    .filter(Boolean);

// ---------- Intent detection ----------

function detectIntent(query) {
  const q = lc(query);

  if (!q.trim()) return "empty";

  if (/(resume|cv|biodata|document|pdf|curriculum vitae)/.test(q))
    return "resume";

  if (/(hi|hii|hello|hey|namaste|yo|greetings)\b/.test(q)) return "greeting";
  if (/thank(s| you)?/.test(q)) return "thanks";

  // Acknowledge
  if (/\b(ok|okay|okey|fine|cool|great|sounds good|alright|all right)\b/.test(q))
    return "ack";

  // Negative
  if (/\b(no|nope|nah|nothing|not now|leave it|ignore)\b/.test(q))
    return "negative";

  if (/(skill|tech stack|technologies|tools|frameworks|languages|what do you know)/.test(q))
    return "skills";

  if (/(project|portfolio|github|work you have done|show your work|apps)/.test(q))
    return "projects";

  if (/(experience|intern(ship)?|work history|jobs|roles|company)/.test(q))
    return "experience";

  if (/(education|study|college|school|degree|b\.?tech|academic)/.test(q))
    return "education";

  if (/(about you|who are you|introduce yourself|summary|profile|bio)/.test(q))
    return "about";

  if (/(contact|email|phone|reach|connect|linkedin|github|hire)/.test(q))
    return "contact";

  if (/(location|where.*from|based in|live|city|country)/.test(q))
    return "location";

  return "search"; // generic semantic search
}

// ---------- Section-specific answers with Structured Payloads ----------

function answerGreeting() {
  return {
    type: "text",
    text: "Hey there! 👋 I’m Minus Assistant, powered by AI.\nAsk me about Manas's projects, skills, research, experience, or resume!",
  };
}

function answerThanks() {
  return {
    type: "text",
    text: "You’re welcome! 😊 Let me know if you’d like to see any projects, skills, or download the resume.",
  };
}

function answerAck() {
  return {
    type: "text",
    text: "Understood! ✅ Feel free to ask for projects, skills, experience, or contact channels.",
  };
}

function answerNegative() {
  return {
    type: "text",
    text: "No problem at all. 😊 Feel free to explore the portfolio or ask questions anytime you're ready.",
  };
}

function answerResume() {
  return {
    type: "resume",
    text: "Here is Manas Ranjan Das's verified resume and academic credentials:",
    doc: {
      title: "Manas_Ranjan_Das_Resume.pdf",
      url: resumePdf,
      highlights: [
        "B.Tech in Electrical & Computer Engineering (BPUT, 2023 - 2027)",
        "GATE EE 2026 - AIR 4324 among 60,000+ national candidates",
        "2+ Research Papers (TIFR-HBCSE & IoT National Conclave)",
        "5+ Engineering Internships (Accenture UK, AWS, CTTC, OCAC, ABIT IoT CoE)"
      ],
    },
  };
}

function answerAbout() {
  const lines = [];

  if (hero.name || hero.roles || hero.heroTagline) {
    lines.push(
      `I’m ${hero.name}, ${hero.roles.join(", ")} based in ${hero.location}.`
    );
  }

  if (about.about) {
    lines.push("");
    lines.push(about.about.trim());
  }

  return {
    type: "text",
    text: lines.join("\n"),
  };
}

function answerSkills() {
  return {
    type: "skills",
    text: "Here are my core technical skills and tools categorized:",
    items: skills,
  };
}

function answerProjects(query) {
  const tokens = tokenize(query);

  const isGeneric = tokens.every((t) =>
    ["project", "projects", "work", "portfolio", "show", "me", "what"].includes(t)
  );

  let candidateProjects = projects;

  if (!isGeneric) {
    candidateProjects = projects.filter((proj) => {
      const blob = [
        proj.title,
        proj.description,
        ...(proj.techStack || []),
        ...(proj.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return tokens.some((t) => blob.includes(t));
    });
  }

  if (candidateProjects.length === 0) {
    candidateProjects = projects.slice(0, 6);
  }

  const top = candidateProjects.slice(0, 6);

  return {
    type: "projects",
    text: `Here are ${top.length} highlighted projects:`,
    items: top,
  };
}

function answerExperience() {
  return {
    type: "experience",
    text: "Here is my career experience, research internships, and appointments:",
    items: experience.slice(0, 6),
  };
}

function answerEducation() {
  const lines = ["Academic Background & Education:", ""];
  if (Array.isArray(about.education)) {
    about.education.forEach((edu, idx) => {
      lines.push(`${idx + 1}. ${edu.degree}`);
      lines.push(`   ${edu.institution} (${edu.year})`);
      lines.push("");
    });
  }
  return {
    type: "text",
    text: lines.join("\n"),
  };
}

function answerContact() {
  return {
    type: "contact",
    text: "Here is how you can connect with Manas:",
    contact: contact,
    socials: hero.socialLinks,
  };
}

function answerLocation() {
  return {
    type: "text",
    text: `📍 Manas is based in ${hero.location || "Cuttack, Odisha, India"}. Open to global remote and relocation opportunities!`,
  };
}

// ---------- Generic fallback semantic search ----------

function buildSearchIndex() {
  const docs = [];

  if (about.about) {
    docs.push({ label: "About", text: about.about });
  }

  if (Array.isArray(about.education)) {
    about.education.forEach((edu) => {
      docs.push({
        label: "Education",
        text: `${edu.degree} at ${edu.institution} (${edu.year})`,
      });
    });
  }

  if (about.achievements) {
    Object.entries(about.achievements).forEach(([title, desc]) => {
      docs.push({
        label: `Achievement: ${title}`,
        text: `${title} — ${desc}`,
      });
    });
  }

  if (about.posts) {
    Object.entries(about.posts).forEach(([role, desc]) => {
      docs.push({
        label: `Role: ${role}`,
        text: `${role} — ${desc}`,
      });
    });
  }

  if (Array.isArray(skills)) {
    skills.forEach((cat) => {
      const names = (cat.items || []).map((i) => i.name).join(", ");
      docs.push({
        label: `Skills: ${cat.category}`,
        text: `${cat.category}: ${names}`,
      });
    });
  }

  if (Array.isArray(projects)) {
    projects.forEach((p) => {
      docs.push({
        label: `Project: ${p.title}`,
        text: `${p.title}: ${p.description}. Tech: ${(p.techStack || []).join(", ")}. Tags: ${(p.tags || []).join(", ")}`,
      });
    });
  }

  if (Array.isArray(experience)) {
    experience.forEach((e) => {
      docs.push({
        label: `Experience: ${e.role} @ ${e.company}`,
        text: `${e.role} at ${e.company} (${e.duration}). Details: ${(e.details || []).join(" ")}`,
      });
    });
  }

  return docs.map((d) => ({
    ...d,
    textLower: lc(d.text),
  }));
}

const SEARCH_INDEX = buildSearchIndex();

function genericSearch(query, topK = 4) {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) {
    return {
      type: "text",
      text: "Please type a question about Manas's projects, skills, experience, or resume.",
    };
  }

  const scored = SEARCH_INDEX.map((doc) => {
    let score = 0;
    qTokens.forEach((t) => {
      if (doc.textLower.includes(t)) score += 1;
    });
    return { doc, score };
  }).filter((item) => item.score > 0);

  if (scored.length === 0) {
    return {
      type: "text",
      text: "I’m not sure about that specific query 🤔\nTry asking:\n• Show me your projects\n• What are your technical skills?\n• Can I see your resume?\n• How can I contact you?",
    };
  }

  scored.sort((a, b) => b.score - a.score || a.doc.text.length - b.doc.text.length);

  const top = scored.slice(0, topK).map((s) => s.doc);
  const lines = ["Here is what I found:", ""];
  top.forEach((d, idx) => {
    lines.push(`${idx + 1}. [${d.label}]\n${d.text}`);
    lines.push("");
  });

  return {
    type: "text",
    text: lines.join("\n"),
  };
}

// ---------- Public API ----------

export const search = (query) => {
  const intent = detectIntent(query);

  switch (intent) {
    case "empty":
      return {
        type: "text",
        text: "Ask me anything about Manas’s skills, projects, experience, education, or resume!",
      };
    case "greeting":
      return answerGreeting();
    case "thanks":
      return answerThanks();
    case "ack":
      return answerAck();
    case "negative":
      return answerNegative();
    case "resume":
      return answerResume();
    case "about":
      return answerAbout();
    case "skills":
      return answerSkills();
    case "projects":
      return answerProjects(query);
    case "experience":
      return answerExperience();
    case "education":
      return answerEducation();
    case "contact":
      return answerContact();
    case "location":
      return answerLocation();
    case "search":
    default:
      return genericSearch(query);
  }
};
