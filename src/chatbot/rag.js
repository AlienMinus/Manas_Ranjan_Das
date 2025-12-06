// src/chatbot/rag.js
import about from "../data/about.json";
import experience from "../data/experience.json";
import projects from "../data/projects.json";
import skills from "../data/skills.json";
import hero from "../data/hero.json";
import contact from "../data/contact.json";

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

  if (/(hi|hii|hello|hey|namaste|yo)\b/.test(q)) return "greeting";
  if (/thank(s| you)?/.test(q)) return "thanks";

  // 👍 Acknowledge / okay type
  if (/\b(ok|okay|okey|fine|cool|great|sounds good|alright|all right)\b/.test(q))
    return "ack";

  // 🙅‍♂️ No / nothing / stop type
  if (/\b(no|nope|nah|nothing|not now|leave it|ignore)\b/.test(q))
    return "negative";

  if (/(skill|tech stack|technologies|tools|frameworks|languages)/.test(q))
    return "skills";

  if (/(project|portfolio|github|work you have done|show your work)/.test(q))
    return "projects";

  if (/(experience|intern(ship)?|work history|jobs|roles)/.test(q))
    return "experience";

  if (/(education|study|college|school|degree|b\.?tech)/.test(q))
    return "education";

  if (/(about you|who are you|introduce yourself|summary|profile)/.test(q))
    return "about";

  if (/(contact|email|phone|reach|connect|linkedin|github)/.test(q))
    return "contact";

  if (/(location|where.*from|based in|live)/.test(q)) return "location";

  return "search"; // generic semantic search
}

// ---------- Section-specific answers ----------

function answerGreeting() {
  return [
    "Hey there! 👋 I’m Minus Bot.",
    "You can ask me about Manas’s skills, projects, experience, education, or how to contact him.",
  ];
}

function answerThanks() {
  return ["You’re welcome! 😊 Anything else you’d like to know?"];
}

function answerAck() {
  return [
    "Got it! ✅",
    "If you want, you can ask about my skills, projects, experience, or how to contact me.",
  ];
}

function answerNegative() {
  return [
    "No problem. 😊",
    "If you don’t need anything else right now, you can close the chat. I’m here whenever you want to know more about my work.",
  ];
}


function answerAbout() {
  const lines = [];

  if (hero.name || hero.roles || hero.heroTagline) {
    lines.push(
      `I’m ${hero.name}, ${hero.roles.join(
        ", "
      )} based in ${hero.location}.`.trim()
    );
  }

  if (about.about) {
    lines.push("");
    lines.push(about.about.trim());
  }

  if (about.posts) {
    lines.push("");
    lines.push("Some of my positions and roles:");
    Object.entries(about.posts).forEach(([title, desc]) => {
      lines.push(`• ${title}: ${desc}`);
    });
  }

  if (about.achievements) {
    lines.push("");
    lines.push("Highlighted achievements:");
    Object.entries(about.achievements)
      .slice(0, 4)
      .forEach(([title, desc]) => {
        lines.push(`• ${title}: ${desc}`);
      });
  }

  return lines;
}

function answerSkills() {
  const lines = ["Here are my core skills, grouped by category:", ""];

  skills.forEach((categoryBlock) => {
    const names = (categoryBlock.items || []).map((i) => i.name).join(", ");
    if (!names) return;
    lines.push(`• ${categoryBlock.category}: ${names}`);
  });

  return lines;
}

function answerProjects(query) {
  const q = lc(query);
  const tokens = tokenize(query);

  // If they just said "projects" etc., show a curated set
  const isGeneric = tokens.every((t) =>
    ["project", "projects", "work", "portfolio"].includes(t)
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
    candidateProjects = projects.slice(0, 5); // fallback
  }

  const top = candidateProjects.slice(0, 6);

  const lines = ["Here are some of my projects:", ""];
  top.forEach((p, idx) => {
    lines.push(
      `${idx + 1}. ${p.title} — ${p.description}${
        p.techStack && p.techStack.length
          ? ` (Tech: ${p.techStack.join(", ")})`
          : ""
      }`
    );
    if (p.demo) {
      lines.push(`   Demo: ${p.demo}`);
    }
    if (p.github) {
      lines.push(`   GitHub: ${p.github}`);
    }
    lines.push(""); // spacing
  });

  return lines;
}

function answerExperience() {
  if (!Array.isArray(experience) || experience.length === 0) {
    return ["I don’t have experience data loaded yet."];
  }

  const lines = ["Here is a summary of my experience:", ""];

  experience.forEach((exp) => {
    lines.push(
      `• ${exp.role} at ${exp.company} (${exp.duration})`
    );
    (exp.details || []).forEach((d) => {
      lines.push(`   - ${d}`);
    });
    lines.push("");
  });

  return lines;
}

function answerEducation() {
  const lines = ["My education journey:", ""];
  (about.education || []).forEach((edu) => {
    lines.push(
      `• ${edu.degree} — ${edu.institution} (${edu.year})`
    );
  });
  return lines;
}

function answerContact() {
  const lines = ["Here’s how you can contact me:", ""];

  if (contact.email) lines.push(`• Email: ${contact.email}`);
  if (contact.phone) lines.push(`• Phone: ${contact.phone}`);
  if (contact.blog) lines.push(`• Blog: ${contact.blog}`);

  const gh = (hero.socialLinks || []).find(
    (s) => lc(s.platform) === "github"
  );
  const li = (hero.socialLinks || []).find(
    (s) => lc(s.platform) === "linkedin"
  );

  if (gh) lines.push(`• GitHub: ${gh.url}`);
  if (li) lines.push(`• LinkedIn: ${li.url}`);

  if (contact.message) {
    lines.push("");
    lines.push(contact.message);
  }

  return lines;
}

function answerLocation() {
  if (hero.location) {
    return [`I’m currently based in ${hero.location}.`];
  }
  return ["My location information is not available right now."];
}

// ---------- Generic semantic search across all data ----------

// Build document store from all sections
const allDocs = [];

// About main text
if (about.about) {
  allDocs.push({
    label: "About",
    text: about.about,
  });
}

// Education
(about.education || []).forEach((edu) => {
  allDocs.push({
    label: "Education",
    text: `${edu.degree} at ${edu.institution} (${edu.year})`,
  });
});

// Personal details
if (about.personal_details) {
  Object.entries(about.personal_details).forEach(([k, v]) => {
    allDocs.push({
      label: "Personal Detail",
      text: `${k}: ${v}`,
    });
  });
}

// Achievements
if (about.achievements) {
  Object.entries(about.achievements).forEach(([k, v]) => {
    allDocs.push({
      label: "Achievement",
      text: `${k}: ${v}`,
    });
  });
}

// Posts / roles
if (about.posts) {
  Object.entries(about.posts).forEach(([k, v]) => {
    allDocs.push({
      label: "Role / Post",
      text: `${k}: ${v}`,
    });
  });
}

// Experience
(experience || []).forEach((exp) => {
  allDocs.push({
    label: "Experience",
    text: `${exp.role} at ${exp.company} (${exp.duration}) — ${(exp.details || []).join(
      " "
    )}`,
  });
});

// Projects
(projects || []).forEach((p) => {
  allDocs.push({
    label: "Project",
    text: `${p.title}: ${p.description} (Tech: ${(p.techStack || []).join(
      ", "
    )}; Tags: ${(p.tags || []).join(", ")})`,
  });
});

// Skills
(skills || []).forEach((cat) => {
  const names = (cat.items || []).map((i) => i.name).join(", ");
  if (!names) return;
  allDocs.push({
    label: `Skills - ${cat.category}`,
    text: names,
  });
});

// Hero + contact
if (hero.heroTagline) {
  allDocs.push({
    label: "Hero Tagline",
    text: hero.heroTagline,
  });
}
if (hero.name) {
  allDocs.push({
    label: "Name",
    text: hero.name,
  });
}
if (contact.email) {
  allDocs.push({
    label: "Contact",
    text: `Email: ${contact.email}`,
  });
}
if (contact.phone) {
  allDocs.push({
    label: "Contact",
    text: `Phone: ${contact.phone}`,
  });
}
if (contact.blog) {
  allDocs.push({
    label: "Contact",
    text: `Blog: ${contact.blog}`,
  });
}

// Index with lowercase
const indexedDocs = allDocs
  .filter((d) => d && d.text)
  .map((d) => ({
    ...d,
    text: safeString(d.text).trim(),
    textLower: safeString(d.text).toLowerCase(),
  }));

function genericSearch(query, topK = 5) {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) {
    return ["Please type something to search."];
  }

  const scored = indexedDocs
    .map((doc) => {
      let score = 0;
      qTokens.forEach((t) => {
        if (doc.textLower.includes(t)) score += 1;
      });
      return { doc, score };
    })
    .filter((item) => item.score > 0);

  if (scored.length === 0) {
    return [
      "I’m not sure about that yet 🤔",
      "Try asking things like:",
      "• What are your skills?",
      "• Tell me about your projects.",
      "• What experience do you have?",
      "• How can I contact you?",
    ];
  }

  scored.sort(
    (a, b) => b.score - a.score || a.doc.text.length - b.doc.text.length
  );

  const top = scored.slice(0, topK).map((s) => s.doc);

  const lines = ["Here’s what I found:", ""];
  top.forEach((d, idx) => {
    lines.push(`${idx + 1}. (${d.label}) ${d.text}`);
    lines.push("");
  });

  return lines;
}

// ---------- Public API ----------

export const search = (query) => {
  const intent = detectIntent(query);

  switch (intent) {
    case "empty":
      return [
        "Ask me anything about Manas’s skills, projects, experience, education, or contact details.",
      ];
    case "greeting":
      return answerGreeting();
    case "thanks":
      return answerThanks();
    case "ack":
      return answerAck();
    case "negative":
      return answerNegative();
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
