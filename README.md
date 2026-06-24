# LMS Monorepo

A full-featured Learning Management System built with Django, plus a MERN chatbot add-on.

## Project Structure

```
lms-monorepo/
├── lms-base/           Django LMS backend (port 8000)
└── add-ons/
    └── chatbot/
        ├── server/     Node.js + Express API (port 5002)
        └── client/     React + Vite frontend (port 5173)
```

## Prerequisites

Make sure these are installed before you begin:

- Python 3.11 or 3.12 (not 3.14)
- Node.js 18+
- MongoDB (running locally on port 27017)

---

## First-Time Setup

Run this once to install all dependencies, create `.env` files, and run Django migrations:

```powershell
cd "path\to\lms-monorepo"
.\setup.ps1
```

After setup, create your Django admin account:

```powershell
cd lms-base
.\venv\Scripts\python.exe manage.py createsuperuser
```

---

## Start All Services

```powershell
.\start.ps1
```

This opens 3 terminal windows automatically:

| Service | URL |
|---|---|
| Django LMS | http://localhost:8000 |
| Django Admin | http://localhost:8000/admin |
| Chatbot API | http://localhost:5002 |
| Chatbot UI | http://localhost:5173 |

> Make sure MongoDB is running before starting.

---

## Stop All Services

```powershell
.\stop.ps1
```

This kills Django, the chatbot server, and the chatbot client all at once.

---

## Manual Setup (without scripts)

### Django LMS

```powershell
cd lms-base
py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env and set DEBUG=True and a SECRET_KEY
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Chatbot Server

```powershell
cd add-ons\chatbot\server
npm install
# Create add-ons\chatbot\.env with:
# PORT=5002
# MONGODB_URI=mongodb://localhost:27017/chatbot_db
# CLIENT_URL=http://localhost:5173
node seedFaqs.js   # run once to seed FAQ data
npm run dev
```

### Chatbot Client

```powershell
cd add-ons\chatbot\client
npm install
npm run dev
```

---

## Pushing Changes to GitHub

```powershell
git add .
git commit -m "your message"
git push origin main
```

> If you get an SSH timeout error, switch to HTTPS first:
> ```powershell
> git remote set-url origin https://github.com/rohit17kashyap/lms-monorepo.git
> ```
> When prompted for a password, use a GitHub Personal Access Token (not your account password).
