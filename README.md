# 🚀 Mini SaaS Dashboard - AI-Enhanced Lead Tracker

## Url

https://assignment-stealth-digital.vercel.app/

## Demo User

- Email: test@gmail.com
- Password: Test@123

## ✨ Features

- 🔐 **Authentication**: Secure JWT-based authentication with signup/login
- 📊 **Dashboard**: Real-time statistics and lead analytics
- ✏️ **CRUD Operations**: Create, Read, Update, Delete leads
- 🤖 **AI Integration**: AI-powered follow-up message suggestions using GROQ
- 🔍 **Search & Filter**: Advanced lead filtering and search
- 🎨 **Modern UI**: Built with Shadcn UI and Tailwind CSS
- 🧪 **Testing**: Unit and integration tests included
- 🚀 **Performance**: Optimistic UI updates with Zustand

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT + bcryptjs
- **AI**: GROQ API

### Testing

- **Framework**: Jest
- **Testing Library**: React Testing Library

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- GROQ API key (optional, for AI features)

### Clone the Repository

```bash
git clone https://github.com/kunaldeshwal1/assignment_stealth_digital.git
cd mini-saas-dashboard
npm install
```

### MongoDB, JWT Secret, and GROQ API Key

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Run

```bash
npm run dev
```

### Test

```bash
npm test
```
