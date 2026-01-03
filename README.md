# Manas Ranjan Das - Personal Portfolio & AI Chatbot

A modern, full-stack personal portfolio website built with the MERN stack (MongoDB, Express, React, Node.js). This project is designed not just as a static showcase of work, but as a dynamic, AI-integrated platform. It features a responsive UI, a secure admin dashboard for real-time message management, and an innovative RAG (Retrieval-Augmented Generation) chatbot designed to act as a digital twin, answering professional queries about the developer with high factual accuracy.

## 🚀 Key Features & Capabilities

- **Mobile-First Responsive Design**: The UI is engineered with a "mobile-first" philosophy, ensuring that performance and visual fidelity are maintained across the widest range of devices. By utilizing CSS Modules, the project achieves scoped styling, which eliminates global namespace pollution and allows for highly maintainable, component-specific design tokens.

- **State-of-the-Art RAG Chatbot**: Unlike generic chatbots that may hallucinate information, this implementation uses Retrieval-Augmented Generation (RAG). The system dynamically pulls context from local JSON data files (skills, projects, and professional experience). This ensures that every response provided by the AI is grounded in the actual facts of Manas's career, providing a reliable and professional interface for recruiters and collaborators.

- **Data-Driven Dynamic Showcase**: The portfolio uses a "headless" approach to content. The project gallery and experience timelines are dynamically rendered from a centralized JSON configuration located in `src/data/`. This architectural choice decouples the data layer from the presentation layer, allowing the developer to update their professional profile in seconds without writing a single line of JSX or redeploying the logic.

- **Interactive Professional Timeline**: A curated, interactive view of career milestones and educational background. This section is designed to provide a quick yet thorough overview of professional growth, utilizing clean typography and structured layouts to reduce cognitive load for the reader.

- **Secure Multi-User Admin Dashboard**: A dedicated, protected interface built for the owner to manage incoming inquiries. This dashboard goes beyond simple viewing; it provides a high-level overview of interaction trends, allowing for efficient management of the professional pipeline. Messages can be deleted, archived, or marked for follow-up directly through the UI.

- **Full PWA (Progressive Web App) Integration**: The application is optimized for the modern web environment. With a registered `service-worker.js` and a comprehensive `manifest.json`, the portfolio can be installed as a standalone app on mobile and desktop. This provides offline capabilities, faster load times through caching, and a more immersive user experience.

- **Enterprise-Ready Contact System**: A robust full-stack implementation. User inquiries undergo strict validation on the frontend before being transmitted via a secure API to an Express server. Data is then persisted in a MongoDB cluster, ensuring that no lead is ever lost due to transient network issues.

## 🛠️ Detailed Tech Stack

### Frontend Architecture

- **React.js (Vite)**: Leveraging Vite for a lightning-fast development cycle and highly optimized production builds. This setup ensures that the bundle size is minimized and assets are loaded efficiently.

- **Modern State Management**: The application relies on React Hooks (useState, useEffect, useContext) for a lean and predictable state flow. This avoids the overhead of large libraries like Redux while maintaining a clear data hierarchy.

- **Scalable Iconography**: Integrated with Lucide React, providing a consistent, lightweight, and customizable vector icon set that aligns with modern minimalist design trends.

### Backend & Persistent Storage

- **Node.js & Express**: The backend is built on an asynchronous, non-blocking event loop, providing a scalable foundation for handling concurrent API requests for the contact system and admin dashboard.

- **MongoDB & Mongoose**: A flexible NoSQL database chosen for its ability to handle evolving data structures. Mongoose provides a schema-based solution to model application data, including built-in type casting, validation, and query building.

- **Security-First Configuration**: Utilizing dotenv for environment variable management. Sensitive credentials, such as database connection strings and AI API keys, are strictly isolated from the codebase and never committed to version control.

### AI & Intelligent Retrieval (RAG)

- **Automated Context Injection**: On application load, the system's "Brain" parses the contents of the `src/data/` directory. This creates a temporary, in-memory knowledge base used to augment user prompts.

- **Intelligent Query Processing**: When a user interacts with the chatbot, their query is processed against the local knowledge base to extract relevant professional context. This context is then injected into the LLM prompt, ensuring the AI behaves as a specialized "Digital Persona" for the developer.

### Deployment & DevOps Lifecycle

- **Vercel Ecosystem**: Optimized for React and serverless functions. The custom `vercel.json` ensures that Single Page Application (SPA) routing is handled correctly, preventing 404 errors on browser refreshes.

- **Strict Quality Standards**: Pre-configured with ESLint, the project enforces a high bar for code quality and consistency, catching potential runtime errors and styling inconsistencies during the development phase.

## 📂 Project Architecture & Data Flow

```
├── public/                # Static assets (images, audio), PWA manifest, and SW
├── server/                # Express.js Backend Logic
│   ├── models/            # Mongoose Schemas (defining the data structure for Messages)
│   ├── server.js          # Main entry point: handles CORS, Middleware, and DB Connection
│   └── .env               # Private configuration (excluded from Git for security)
├── src/                   # React Frontend Source Code
│   ├── chatbot/           # RAG Engine: Logic for contextual retrieval and AI prompting
│   ├── components/        # Atomized UI components designed for maximum reusability
│   ├── data/              # The Source of Truth: JSON files driving the entire UI/AI
│   ├── pages/             # Route-level components for the primary navigation paths
│   ├── App.jsx            # Central routing, global context providers, and base styles
│   └── main.jsx           # Entry point for the Vite build and React DOM mounting
├── vercel.json            # Deployment config for URL rewrites and SPA support
└── vite.config.js         # Build tool configuration and plugin registration
```

## ⚙️ Comprehensive Setup & Development Guide

### Prerequisites

- **Node.js (v18.0 or higher)**: Required for compatibility with modern ESM modules.
- **MongoDB Instance**: A local installation or a MongoDB Atlas cloud cluster.
- **Git**: Necessary for cloning and version management.

### 1. Repository Initialization

Clone the source code and navigate to the project root:

```bash
git clone https://github.com/alienminus/manas_ranjan_das.git
cd manas_ranjan_das
```

### 2. Backend Environment Setup

The backend serves as the bridge between the UI and the database. Install dependencies and configure your secrets:

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio
# Note: Ensure your IP is whitelisted in MongoDB Atlas if using cloud storage.
```

Launch the backend server:

```bash
npm start
```

### 3. Frontend Implementation

Open a secondary terminal to run the client-side development server:

```bash
# From the project root
npm install
npm run dev
```

By default, the Vite dev server will host the application at `http://localhost:5173`.

## 🤖 Deep Dive: The RAG Implementation Logic

The centerpiece of this portfolio is the logic found in `src/chatbot/rag.js`. This is not a simple wrapper around an LLM; it is a custom orchestration layer that follows a specific pipeline:

- **Dynamic Data Ingestion**: The script scans all JSON files in the `data` directory at runtime, creating a map of "Context Blocks."

- **Semantic/Keyword Filtering**: When a user submits a query (e.g., "Tell me about your Python projects"), the engine identifies relevant Context Blocks from `projects.json` and `skills.json`.

- **Prompt Augmentation**: It constructs a "System Instruction" that provides the AI with these specific blocks. The prompt effectively says: "You are an AI assistant for Manas. Use ONLY the following facts to answer the question. If the answer isn't in the context, politely say you don't know."

- **Persona Management**: This ensures the AI maintains a consistent, humble, and professional tone, mimicking the developer's actual communication style.

## 🛡️ Security & Quality Assurance

- **Input Sanitization**: The contact form includes backend-level sanitization to prevent common vulnerabilities like Cross-Site Scripting (XSS).

- **CORS (Cross-Origin Resource Sharing)**: The server is configured to only accept requests from specific, trusted origins, preventing unauthorized API access.

- **Code Linting**: ESLint rules are strictly enforced to maintain a clean codebase, which is essential for scaling the project as more features are added.

## 🗺️ Future Roadmap & Enhancements

The development of this portfolio is ongoing, with several high-impact features planned:

- **Global Theme Engine**: Implementing a robust light/dark mode toggle using CSS Custom Properties and localStorage for persistence.

- **Category-Based Project Filtering**: Adding a sophisticated filtering system to the projects page (e.g., [Web], [Mobile], [AI/ML]).

- **Real-time Analytics Dashboard**: Expanding the Admin page with visual charts (using Recharts) to track visitor geography and chatbot query trends.

- **Automated Testing**: Integrating Vitest and React Testing Library to ensure component stability during future updates.

## 📜 License & Usage

This project is open-source and licensed under the Apache License. You are encouraged to fork this repository, adapt it for your own portfolio, and contribute back to the project. Please see the LICENSE file for the full text of the license.

Developed with ❤️ and precision by Manas Ranjan Das