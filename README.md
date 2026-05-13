# Full-Stack CRM Application

A complete full-stack web application built with React, Node.js, Express, and Supabase.

## Features

- **Authentication**: Secure signup and login using Supabase Auth.
- **Dashboard**: Overview of project statistics and recent activity.
- **Project Management**: Full CRUD operations (Create, Read, Update, Delete) for projects.
- **Real-time Updates**: Live updates using Supabase PostgreSQL subscriptions.
- **Dark/Light Mode**: Premium UI with theme switching support.
- **Responsive Design**: Fully mobile-responsive layout using Tailwind CSS.
- **Protected Routes**: Secure access control for authenticated users.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, React Hot Toast.
- **Backend**: Node.js, Express, Supabase JS SDK.
- **Database**: Supabase PostgreSQL.
- **Auth**: Supabase Auth (Email + Password).

## Getting Started

### 1. Supabase Setup

1. Create a new project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** and run the following schema:

```sql
-- Create Projects Table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own projects" 
ON projects FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects" 
ON projects FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON projects FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON projects FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
```

### 2. Environment Variables

Create `.env` files in both `client/` and `server/` directories using the provided `.env.example` templates.

**Server (.env):**
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLIENT_URL=http://localhost:5173
```

**Client (.env):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation

From the root directory, run:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 4. Running the App

To run both the client and server together:

```bash
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Project Structure

```
root/
 ├── client/             # React (Vite) Frontend
 │    ├── src/
 │    │    ├── components/
 │    │    ├── context/
 │    │    ├── layouts/
 │    │    ├── pages/
 │    │    └── services/
 ├── server/             # Node.js Express Backend
 │    ├── config/
 │    ├── controllers/
 │    ├── middleware/
 │    ├── routes/
 │    └── index.js
```
