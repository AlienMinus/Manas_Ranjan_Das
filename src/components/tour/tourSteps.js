// src/components/tour/tourSteps.js

/**
 * Full Website Tour Itinerary across all 7 portfolio pages:
 * 1. Home (/)
 * 2. About (/about)
 * 3. Skills (/skills)
 * 4. Projects (/projects)
 * 5. Experience (/experience)
 * 6. Certifications (/certifications)
 * 7. Contact (/contact)
 */

export const TOUR_PAGES = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "skills", label: "Skills", path: "/skills" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "experience", label: "Experience", path: "/experience" },
  { id: "certifications", label: "Certifications", path: "/certifications" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export const TOUR_STEPS = [
  // ==========================================
  // PAGE 1: HOME (/)
  // ==========================================
  {
    id: "home-hero",
    page: "/",
    pageTitle: "Home",
    selector: ".hero__title",
    title: "Welcome to Manas's Portfolio",
    description: "Meet Manas Ranjan Das — Electrical & Computer Engineer, AI Researcher, and Full-Stack Systems Builder dedicated to solving real-world engineering challenges.",
    action: "glide",
  },
  {
    id: "home-roles",
    page: "/",
    pageTitle: "Home",
    selector: ".hero__roles",
    title: "Multi-Disciplinary Engineering Stack",
    description: "Specializing across Full-Stack development, Machine Learning, Embedded Robotics, and Microgrid Power Systems.",
    action: "glide",
  },
  {
    id: "home-theme-dropdown",
    page: "/",
    pageTitle: "Home",
    selector: ".navbar__theme-btn",
    title: "8 Distinct Visual Aesthetics",
    description: "Explore eight handcrafted themes including Pixelatte, Glassmorphism, Cyberpunk, and Skeuomorphism with liquid blur effects.",
    action: "toggleThemeMenu",
  },
  {
    id: "home-mode-toggle",
    page: "/",
    pageTitle: "Home",
    selector: ".navbar__mode-btn",
    title: "Hand-Tuned Light & Dark Modes",
    description: "Every aesthetic features calibrated Dark and Light mode counterparts engineered for optimal visual contrast.",
    action: "hover",
  },
  {
    id: "home-split-row",
    page: "/",
    pageTitle: "Home",
    selector: ".home-split-row",
    title: "Biography & Official ATS Resume",
    description: "Side-by-side overview showcasing verified credentials including GATE AIR 4324 and an interactive ATS-compliant PDF resume viewer.",
    action: "scrollOnly",
  },
  {
    id: "home-chatbot-orb",
    page: "/",
    pageTitle: "Home",
    selector: ".chatbot-toggler",
    title: "Minus Assistant AI",
    description: "An integrated AI assistant grounded in portfolio records to answer questions about projects, research, and technical background.",
    action: "previewChatbot",
  },
  {
    id: "home-theme-audio",
    page: "/",
    pageTitle: "Home",
    selector: ".music-toggle",
    title: "Immersive Soundscape",
    description: "Custom ambient soundtrack paired with real-time audio visualizers matching each visual theme.",
    action: "hover",
  },

  // ==========================================
  // PAGE 2: ABOUT (/about)
  // ==========================================
  {
    id: "about-bio",
    page: "/about",
    pageTitle: "About Me",
    selector: ".about-bio-card",
    title: "Engineering Biography & Philosophy",
    description: "Passionate about innovation at the intersection of electrical hardware, intelligent computing, and sustainable solutions.",
    action: "scrollOnly",
  },
  {
    id: "about-education",
    page: "/about",
    pageTitle: "About Me",
    selector: ".education-grid",
    title: "Academic Background & Degree",
    description: "Pursuing B.Tech in Electrical & Computer Engineering at BPUT with a strong foundation in digital systems, IoT, and power electronics.",
    action: "scrollOnly",
  },
  {
    id: "about-achievements",
    page: "/about",
    pageTitle: "About Me",
    selector: ".achievements-grid",
    title: "National Milestones & Scientific Research",
    description: "GATE EE AIR 4324, NIUS Physics Summer Program at HBCSE-TIFR Mumbai, and publications in Engineering Research Express.",
    action: "scrollOnly",
  },
  {
    id: "about-posts",
    page: "/about",
    pageTitle: "About Me",
    selector: ".posts-grid",
    title: "Leadership & Enterprise Ventures",
    description: "CEO of Aerial.Vue Corporation, Director of R&D at InceptriX, Smart India Hackathon Lead, and IEEE / ISTE Member.",
    action: "scrollOnly",
  },

  // ==========================================
  // PAGE 3: SKILLS (/skills)
  // ==========================================
  {
    id: "skills-overview",
    page: "/skills",
    pageTitle: "Skills",
    selector: ".section__header",
    title: "Technical Skills Overview",
    description: "Core technical competencies, developer tooling, hardware architectures, and domain proficiencies.",
    action: "scrollOnly",
  },
  {
    id: "skills-card-1",
    page: "/skills",
    pageTitle: "Skills",
    selector: ".skills__grid .skills__card:nth-child(1), .skills__card:first-child",
    title: "Software & Programming Stack",
    description: "Comprehensive mastery of modern programming languages, algorithmic design, and full-stack frameworks.",
    action: "scrollOnly",
    dynamicExtract: true,
  },
  {
    id: "skills-card-2",
    page: "/skills",
    pageTitle: "Skills",
    selector: ".skills__grid .skills__card:nth-child(2)",
    title: "Electrical & Hardware Engineering",
    description: "Hands-on expertise with embedded microcontrollers, power electronics, IoT architectures, and sensor integration.",
    action: "scrollOnly",
    dynamicExtract: true,
  },
  {
    id: "skills-card-3",
    page: "/skills",
    pageTitle: "Skills",
    selector: ".skills__grid .skills__card:nth-child(3)",
    title: "Developer Tooling & Cloud AI",
    description: "Professional workflow tools including Docker, Git, Linux environments, machine learning libraries, and deployment pipelines.",
    action: "scrollOnly",
    dynamicExtract: true,
  },

  // ==========================================
  // PAGE 4: PROJECTS (/projects)
  // ==========================================
  {
    id: "projects-filters",
    page: "/projects",
    pageTitle: "Projects",
    selector: ".projects__filters",
    title: "Interactive Category Filtering",
    description: "Instantly filter deployed projects across AI and Machine Learning, Full-Stack applications, and Embedded IoT systems.",
    action: "filterDemo",
  },
  {
    id: "projects-showcase-1",
    page: "/projects",
    pageTitle: "Projects",
    selector: ".projects__grid article.project-card:first-child, .project-card:first-child",
    title: "Featured Engineering Project",
    description: "Explore the live demo, GitHub source code repository, and core architectural features of this deployed project.",
    action: "scrollOnly",
    dynamicExtract: true,
  },
  {
    id: "projects-showcase-2",
    page: "/projects",
    pageTitle: "Projects",
    selector: ".projects__grid article.project-card:nth-child(2), .project-card:nth-child(2)",
    title: "Innovative Hardware & AI Prototype",
    description: "Combining custom hardware sensor integration, intelligent algorithms, and responsive user interfaces.",
    action: "scrollOnly",
    dynamicExtract: true,
  },

  // ==========================================
  // PAGE 5: EXPERIENCE (/experience)
  // ==========================================
  {
    id: "experience-timeline",
    page: "/experience",
    pageTitle: "Experience",
    selector: ".experience__timeline",
    title: "Career & Research Trajectory",
    description: "A chronological timeline of industry internships, government appointments, and academic research fellowships.",
    action: "scrollOnly",
  },
  {
    id: "experience-card-1",
    page: "/experience",
    pageTitle: "Experience",
    selector: ".experience-card:first-child",
    title: "Professional Appointment",
    description: "Reviewing key responsibilities, delivered milestones, technologies leveraged, and verifiable documentation.",
    action: "scrollOnly",
    dynamicExtract: true,
  },
  {
    id: "experience-lightbox",
    page: "/experience",
    pageTitle: "Experience",
    selector: ".experience-card:first-child .btn.outline, .experience-card__media-box",
    title: "Verifiable Credential Lightbox",
    description: "Opening the full-screen liquid glass lightbox to inspect high-resolution verification documents.",
    action: "previewLightbox",
  },

  // ==========================================
  // PAGE 6: CERTIFICATIONS (/certifications)
  // ==========================================
  {
    id: "certs-search",
    page: "/certifications",
    pageTitle: "Certifications",
    selector: ".cert-search-input",
    title: "Search & Credential Filtering",
    description: "Search certifications by technical domain or filter by accredited issuers such as Google Cloud, Swayam Plus, and Vertiv.",
    action: "scrollOnly",
  },
  {
    id: "certs-cards",
    page: "/certifications",
    pageTitle: "Certifications",
    selector: ".cert-card--specialization, .cert-card:first-child",
    title: "Accredited Certifications",
    description: "Verified certificates featuring interactive multi-card carousels and direct verification links.",
    action: "scrollOnly",
    dynamicExtract: true,
  },

  // ==========================================
  // PAGE 7: CONTACT (/contact) & FINALE
  // ==========================================
  {
    id: "contact-channels",
    page: "/contact",
    pageTitle: "Contact",
    selector: ".contact__info-col",
    title: "Direct Communication Channels",
    description: "Connect directly via Email, Phone, LinkedIn, GitHub, or the Spectacular Minus engineering blog.",
    action: "scrollOnly",
  },
  {
    id: "contact-type-message",
    page: "/contact",
    pageTitle: "Contact",
    selector: "#contact-message",
    title: "Auto-Composing Inquiry",
    description: "Watch the cursor focus and automatically type a greeting into the message input field.",
    action: "autoTypeMessage",
  },
  {
    id: "contact-user-inputs",
    page: "/contact",
    pageTitle: "Contact",
    selector: "#contact-name",
    title: "Your Turn to Connect",
    description: "Please enter your name and email address here to send a direct message to Manas.",
    action: "focusUserInputs",
  },
  {
    id: "contact-submit-btn",
    page: "/contact",
    pageTitle: "Contact",
    selector: ".contact__form button[type='submit']",
    title: "Submitting Inquiry",
    description: "Ready to send! The cursor now clicks on the submit button to route your inquiry.",
    action: "clickSubmit",
  },
  {
    id: "tour-return-home",
    page: "/contact",
    pageTitle: "Tour Complete",
    selector: ".navbar__logo",
    title: "Tour Complete — Returning Home",
    description: "You have completed the full walkthrough! Feel free to explore freely or test the AI assistant.",
    action: "returnHome",
  },
];
