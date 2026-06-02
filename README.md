# Canvas & Quill

A full-stack React + Supabase app with:
- **User Authentication** — sign up, log in, log out with user profiles
- **Drawing Tool** — freehand canvas with 6 brush shapes (circle, square, star, triangle, diamond, cross), adjustable size & color
- **Article Platform** — write, publish, browse, edit, and delete articles with author ownership

## Stack
- React 18 + Vite
- Tailwind CSS
- Supabase (auth + database)

---

## Setup

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the database schema
In your Supabase dashboard → SQL Editor, paste and run the contents of `supabase-schema.sql`.

### 3. Configure environment variables
Copy `.env.example` to `.env`:
```
cp .env.example .env
```
Then fill in your values from Supabase → Project Settings → API:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install and run
```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Features

### Auth
- Email/password sign up and log in
- Username set on registration (stored in user metadata)
- Persistent session via Supabase

### Drawing Tool
- HTML5 canvas with freehand drawing
- 6 brush shapes: Circle, Square, Star, Triangle, Diamond, Cross
- Adjustable brush size (4–80px) via slider
- 10 preset colors + custom color picker
- Smooth interpolated drawing between points
- Clear canvas and Save as PNG

### Articles
- Browse all published articles
- Filter to "My articles"
- Write new articles (title + body)
- Read full articles
- Edit and delete your own articles
- Row Level Security enforced server-side
