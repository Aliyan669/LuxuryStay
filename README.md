# LuxuryStay — Hotel Management System (MERN)

Ek complete hotel management system: guest website + admin dashboard.

**Stack:** React (Vite) + Node/Express + MongoDB Atlas + JWT auth + Cloudinary (image upload)

---

## Features

**Guest site**
- Luxury landing page, rooms listing, room details
- Booking form + my bookings
- Invoices, service requests, feedback
- Login / Register / Profile

**Admin dashboard**
- Dashboard with revenue + booking stats
- Rooms, Bookings, Invoices, Housekeeping, Users, Feedback, Notifications, Settings
- Image upload for rooms, logo and favicon
- Mobile responsive (off-canvas sidebar)

**Theme**
- Luxury Charcoal Black + Rose Gold
- SVG icons (no emoji), PKR currency, dynamic footer year

---

## Local development

```bash
# backend
cd backend
npm install
# .env banao (.env.example se copy karo)
npm start            # http://localhost:5000

# frontend (naya terminal)
cd frontend
npm install
npm run dev          # http://localhost:5173
```

`backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> Cloudinary optional hai. Local pe na ho to images `backend/uploads/` me save hoti hain.

---

## Deploy

GitHub + Vercel (backend aur frontend alag projects) ki poori guide: **[DEPLOY.md](./DEPLOY.md)**

---

## Project structure

```
backend/    Express API (serverless-ready for Vercel)
frontend/   React SPA (Vite)
```
