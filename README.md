# 📌 Personal Portfolio Website – Full-Stack (React + Node.js)

A modern, fully responsive personal portfolio website showcasing skills, experience, projects, and contact details — integrated with a lightweight backend for message storage and an admin dashboard with authentication.

---

## 🚀 Tech Stack

### Frontend
- ⚛️ React + Vite
- React Router (Multipage navigation)
- Modern CSS — dark theme
- React Icons
- Fully responsive design

### Backend
- 🟩 Node.js + Express.js
- CSV storage (`src/data/response.csv`)
- Admin-protected route

---

## ✨ Features

### 🌟 Portfolio UI
- Dynamic hero section with rotating job titles
- Profile image inline with heading
- Skills listed with icons
- Projects card gallery
- Experience timeline
- Full contact form with validation

### 💬 Contact Functionality
- Saves submissions into CSV file
- No external database needed

### 🔐 Admin Dashboard
- Password-protected secure login
- View all messages in table format
- Auto-refresh every 2 seconds
- Delete individual messages
- Logout instantly clears access

---

## 📁 Folder Structure

```bash
.
├── src/
│   ├── assets/               # Images & icons
│   ├── components/           # Main UI components
│   ├── pages/                # Routes: Home + Admin
│   ├── data/
│   │   ├── response.csv      # Contact messages
│   │   ├── hero.json         # Hero section data
│   │   ├── skills.json       # Skills data
│   │   └── ...
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   └── server.js             # Backend server
│
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions
### 1️⃣ Install dependencies
```bash
npm install
cd server
npm install
cd ..
```

### 2️⃣ Ensure CSV file exists
```bash
mkdir -p src/data
echo "timestamp,name,email,message" > src/data/response.csv
```

### 3️⃣ Configure Admin Password
Inside `server/server.js`:
```bash
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";
```

### 4️⃣ Run the Project
Open two terminals:
#### Frontend
```bash
npm run dev
```
#### Backend
```bash
npm run server
```

## 🔗 API Endpoints
| Method  | Endpoint                                  | Description                     |
|---------|-------------------------------------------|---------------------------------|
| POST    | `/api/contact`                            | Store form message to CSV       |
| GET     | `/api/admin/messages`                     | Fetch all messages (admin only) |
| DELETE  | `/api/admin/messages/:timestamp`          | Delete specific message         |

### ➡ Required request header:
```http
x-admin-password: <your-password>
```

## 🔒 Security Notes
- Sensitive endpoints blocked without password
- Server-side field validation
- Recommended to store password in .env for deployment

## 🧩 Roadmap / Future Enhancements
- Nodemailer email notifications 📩
- Search + filter in Admin Panel
- Mark messages as read
- Deploy to Netlify + Render / Vercel
- Light/Dark theme toggle

## 🧑‍💻 Author
Manas Ranjan Das <br/>
Electrical & Computer Engineer <br/>
Cuttack, India <br/>

## 🏁 License
Issued under the Apache License. <br/>
Free to modify and use for learning and academic purposes. <br/>










