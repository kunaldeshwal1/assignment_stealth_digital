# 🚀 Mini SaaS Dashboard - AI-Enhanced Lead Tracker

## ✅ Candidate Checklist

- ✅ **Public GitHub Repository**: [https://github.com/kunaldeshwal1/assignment_stealth_digital](https://github.com/kunaldeshwal1/assignment_stealth_digital)
- ✅ **Incremental Commits**: Check commit history for detailed development progress
- ✅ **Live Frontend URL**: [Deployed on Vercel](https://assignment-stealth-digital.vercel.app/)
- ✅ **Live Backend/API URL**: API routes integrated with frontend (Next.js API routes)
- ✅ **Free Services Used**:
  - MongoDB Atlas (Free Tier)
  - Vercel Hosting (Free)
  - GROQ AI API (Free Tier)
  - GitHub (Free)
- ✅ **Steps to Run Locally**: Detailed installation guide provided below
- ✅ **Environment Variables**: Complete `.env.local` setup documented
- ✅ **Time Taken**: ~5-6 hours
  - Authentication & DB setup: 1 hours
  - Dashboard & CRUD operations: 1 hours
  - AI integration: 1 hours
  - UI/UX & Responsive design: 2 hours
  - Testing & bug fixes: 1 hours
- ✅ **Authentication Implemented**:
  - JWT-based authentication
  - **Demo Credentials**:
    - Email: `test@gmail.com`
    - Password: `Test@123`
  - Or create your own account via signup
- ✅ **Jest Tests Included**:
  - Unit tests for components
  - Integration tests for API routes
  - Run with `npm test`
- ✅ **Proof No Paid Billing Needed**:
  - MongoDB Atlas Free Tier (M0 Cluster - 512 MB storage)
  - Vercel Free Plan (Unlimited hobby projects)
  - GROQ API Free Tier (Generous free quota)
  - All services operational without credit card

### Development Notes

**Key Decisions Made:**

- Used Next.js 14 App Router for modern React Server Components
- Implemented Zustand for lightweight state management
- Chose Shadcn UI for consistent, accessible components
- MongoDB for flexible schema and easy scaling
- GROQ AI for cost-effective AI features

**Challenges Faced:**

1. **AI Integration**: Initial issues with API rate limits, resolved with error handling
2. **Responsive Design**: Ensured mobile-first approach for all components
3. **State Management**: Balanced between server state and client state
4. **Authentication**: Implemented secure JWT with proper expiration handling

**Future Improvements:**

- Add email notifications for lead updates
- Implement export to CSV functionality
- Add team collaboration features
- Enhance analytics with charts and graphs
- Add dark mode support

### Deployment Verification

**Frontend (Vercel):**

```bash
# Deployment URL
https://assignment-stealth-digital.vercel.app/

# Environment Variables Set:
- MONGODB_URI ✅
- JWT_SECRET ✅
- GROQ_API_KEY ✅
```

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
