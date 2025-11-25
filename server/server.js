// server/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Minus$ecureAdmin1THz";


// Middleware
app.use(
  cors({
    origin: "https://manas-ranjan-das.vercel.app",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "x-admin-password"],
  })
); // Vite default port
app.use(express.json()); // Parse JSON bodies

// Path to CSV file (adjust if your structure is different)
const csvPath = path.join(__dirname,"./", "data", "response.csv");

// Ensure CSV file exists with header
function ensureCsvExists() {
  if (!fs.existsSync(csvPath)) {
    const header = "timestamp,name,email,message\n";
    fs.writeFileSync(csvPath, header, "utf8");
  }
}

// Helper to escape CSV values (basic)
function escapeCsv(value) {
  if (value == null) return "";
  const str = String(value).replace(/\r?\n|\r/g, " "); // remove newlines
  if (str.includes(",") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Append a new row to CSV
function appendToCsv({ name, email, message }) {
  ensureCsvExists();
  const timestamp = new Date().toISOString();
  const row = [
    escapeCsv(timestamp),
    escapeCsv(name),
    escapeCsv(email),
    escapeCsv(message),
  ].join(",") + "\n";

  fs.appendFileSync(csvPath, row, "utf8");
}

function readCsvAsJson() {
  ensureCsvExists();
  const content = fs.readFileSync(csvPath, "utf8");

  // Handle Windows & Unix newlines and remove trailing blank lines
  const lines = content.split(/\r?\n/).filter(Boolean);

  if (lines.length <= 1) return []; // only header or empty

  // Trim header cells to avoid "message\r"
  const header = lines[0]
    .split(",")
    .map((h) => h.trim());

  const rows = lines.slice(1);

  return rows.map((line) => {
    // Split on commas not inside quotes
    const cols = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

    const obj = {};
    header.forEach((key, idx) => {
      let value = cols[idx] || "";
      // Remove surrounding quotes and unescape "" -> "
      value = value.replace(/^"|"$/g, "").replace(/""/g, '"').trim();
      obj[key] = value;
    });
    return obj;
  });
}

// DELETE a message by timestamp (admin only)
app.delete("/api/admin/messages/:timestamp", (req, res) => {
  const password = req.headers["x-admin-password"];
  const timestampToDelete = req.params.timestamp;

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    ensureCsvExists();
    const content = fs.readFileSync(csvPath, "utf8");

    const lines = content.split(/\r?\n/).filter(Boolean);
    if (lines.length <= 1) {
      return res.json({ success: true, deleted: 0 });
    }

    const header = lines[0];
    const rows = lines.slice(1);

    // keep rows whose first column (timestamp) != timestampToDelete
    const keptRows = rows.filter((line) => {
      const cols = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      const ts = (cols[0] || "").replace(/^"|"$/g, "").trim();
      return ts !== timestampToDelete;
    });

    const newContent = [header, ...keptRows].join("\n") + "\n";
    fs.writeFileSync(csvPath, newContent, "utf8");

    return res.json({ success: true, deleted: rows.length - keptRows.length });
  } catch (err) {
    console.error("Error deleting from CSV:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});


// Route: handle contact form
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    appendToCsv({ name, email, message });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error writing to CSV:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

// Admin route: view all messages
app.get("/api/admin/messages", (req, res) => {
  const password = req.headers["x-admin-password"];

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const data = readCsvAsJson();
    return res.json({ success: true, messages: data });
  } catch (err) {
    console.error("Error reading CSV:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});


app.get("/", (req, res) => {
  res.send("Contact backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server listening on https://manas-ranjan-das-hcwj.vercel.app/`);
});
