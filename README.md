# SOULSYNC - Mental Health Wellness Dashboard

SoulSync is a role-based mental health platform built with **Next.js (TypeScript)**, **Express**, and **MongoDB**.  
It provides AI-driven journal analysis, weekly summaries using Gemini, and productivity tracking via a Pomodoro timer.

## Technologies Used

- Next.js (TypeScript)
- TailwindCSS
- Express.js
- MongoDB
- Gemini (LLM)
- Transformer-based Emotion Detection Model
- JWT Authentication (RBAC)

## Core Features

### RBAC (2 Roles)

**Student**

- Create journal entries
- Per-entry emotion analysis (Transformer model)
- Generate weekly summaries (Gemini LLM)
- View admin-uploaded resources
- Built-in Pomodoro timer

**Admin**

- Overall platform dashboard
- Aggregated emotional analytics
- Create/manage blog resources for students

## Architecture Diagram

```text
                ┌──────────────────────────────┐
                │        Next.js (Frontend)    │
                │   - TypeScript               │
                │   - RBAC (Student/Admin UI)  │
                │   - Pomodoro Timer           │
                └───────────────┬──────────────┘
                                │ REST API (JWT)
                                ▼
                ┌──────────────────────────────┐
                │        Express Backend       │
                │  - Authentication (JWT)      │
                │  - RBAC Middleware           │
                │  - Journal APIs              │
                │  - Admin Resource APIs       │
                │  - Analytics Layer           │
                └───────────────┬──────────────┘
                                │
                                ▼
                ┌──────────────────────────────┐
                │           MongoDB            │
                │  - Users                     │
                │  - Journals                  │
                │  - Weekly Reports            │
                │  - Resources (Blogs)         │
                └───────────────┬──────────────┘
                                │ (Fastify)
                                ▼
                ┌──────────────────────────────┐
                │           AI Layer           │
                │  - Transformer Model         │
                │    (Emotion Detection)       │
                │  - Gemini LLM                │
                │    (Weekly Summaries)        │
                └──────────────────────────────┘
```

## Getting Started

### Frontend

```bash
npm install
```

```bash
npm run dev
```

---

### Backend

```bash
npm install
```

```bash
node index.js
```

---

### Python

```
pip install -r requirements.txt
```

```
uvicorn app:app --reload
```
