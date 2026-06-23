# LMS Chatbot Service

A standalone MERN chatbot for the E-Learning Platform.  
It runs independently — its own Node/Express server on **port 5002** and a Vite React frontend on **port 5173**.

## What it does

- Accepts user questions via a floating chat widget
- Matches questions against a MongoDB FAQ database using a keyword + token scoring algorithm
- Returns the best-matching answer with a confidence score and category
- Falls back to a human-escalation prompt when no match is found
- Logs every conversation turn to MongoDB (`ChatMessage` collection)

---

## Folder Structure

```
chat-bot/
├── server/
│   ├── models/
│   │   ├── Faq.js           — FAQ schema
│   │   └── ChatMessage.js   — conversation log schema
│   ├── services/
│   │   └── faqMatcher.js    — keyword + token scoring algorithm
│   ├── controllers/
│   │   └── chatController.js
│   ├── routes/
│   │   └── chatRoutes.js
│   ├── seedFaqs.js          — seeds 29 FAQs into chatbot_db
│   └── server.js            — Express entry point (port 5002)
├── client/                  — Vite React app (port 5173)
│   └── src/
│       ├── App.jsx
│       └── components/Chatbot/
│           ├── ChatWidget.jsx
│           ├── ChatWidget.css
│           └── useChat.js
├── .env
└── README.md
```

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017`

### 1. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Seed the FAQ database

```bash
cd server
npm run seed
# ✅ Seeded 29 FAQs into chatbot_db
```

### 3. Run both servers

**Terminal 1 — API server (port 5002):**
```bash
cd server
npm run dev
```

**Terminal 2 — React frontend (port 5173):**
```bash
cd client
npm run dev
```

Open `http://localhost:5173` — the 💬 button appears in the bottom-right corner.

---

## API Endpoints

| Method | Path                  | Description                     |
|--------|-----------------------|---------------------------------|
| POST   | `/api/chat/message`   | Send a message, get a reply     |
| GET    | `/api/chat/faqs`      | List all active FAQs            |

### POST `/api/chat/message` — request body
```json
{
  "message": "how to enroll in a course",
  "sessionId": "1717000000000",
  "userId": "optional-user-id"
}
```

### Response
```json
{
  "success": true,
  "reply": "Browse the course catalog...",
  "source": "faq",
  "confidence": 0.75,
  "category": "courses",
  "canEscalate": true
}
```

---

## Django Integration

Add this button anywhere in your Django templates to open the chatbot:

```html
<a href="http://localhost:5173?userId={{ request.user.id }}&role={{ request.user.role }}" target="_blank">
  <button>💬 Get Help</button>
</a>
```

The React app reads `userId` and `role` from the URL query string and passes them to the server with each message for future personalization.

---

## Environment Variables (`.env`)

```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/chatbot_db
CLIENT_URL=http://localhost:5173
```
