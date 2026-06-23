# 💰 Expense Tracker Backend

A secure REST API for the Student Expense Tracker app with user authentication and MongoDB database.

## 🔗 Frontend
https://harshithadonthireddy07-rgb.github.io/Expense-Tracker

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication
- bcryptjs

## 🔐 API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/expenses | Get all expenses |
| POST | /api/expenses | Add expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET | /api/expenses/summary | Get summary |

## ▶️ Run Locally
npm install
node server.js
