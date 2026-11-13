# LuxuryStay — Deployment Guide (GitHub + Vercel)

Yeh guide step-by-step hai. Order follow karo: **Atlas → Cloudinary → GitHub → Backend → Frontend → Test**.

---

## 0. Ek nazar project structure pe

```
LuxuryStay/
├── backend/          -> Vercel Project #1 (Root Directory = backend)
│   ├── api/index.js  -> serverless entry point
│   ├── app.js        -> express app (routes, middleware)
│   ├── server.js     -> sirf local dev ke liye (listen)
│   ├── config/db.js  -> cached MongoDB connection
│   ├── routes/ models/ middleware/
│   └── vercel.json
├── frontend/         -> Vercel Project #2 (Root Directory = frontend)
│   ├── src/
│   ├── vercel.json   -> SPA rewrite (React Router refresh fix)
│   └── vite.config.js
└── .gitignore        -> .env, node_modules, dist, uploads ignore
```

**Important:** Ek hi GitHub repo se **do alag Vercel projects** banenge. Dono ka "Root Directory" alag hoga.

---

## 1. MongoDB Atlas — Vercel ke liye IP allow karo

Vercel ke serverless functions ka IP fixed nahi hota, is liye Atlas me sab IPs allow karne padte hain.

1. https://cloud.mongodb.com kholo → apna cluster → **Network Access**
2. **Add IP Address** → **Allow Access from Anywhere**
3. Address me `0.0.0.0/0` daalo → **Confirm**

> Bina iske backend Vercel pe deploy hoga lekin har request pe `Database connection failed` / timeout aayega.

**Connection string** (Atlas → Connect → Drivers → Node.js):

```
mongodb+srv://<user>:<password>@mern.aw0ufwk.mongodb.net/luxurystay?retryWrites=true&w=majority
```

Password me special characters (`@ # ? /`) hon to URL-encode karna padta hai.

---

## 2. Cloudinary — production image upload

Vercel pe disk permanent nahi hota, is liye room/logo/favicon images Cloudinary pe jayengi.

1. https://cloudinary.com → free account banao
2. **Dashboard → API Keys** se ye 3 values copy karo:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

Ye 3 values backend ki environment variables me jayengi (Step 4).

> Agar Cloudinary set nahi karoge to site chalegi, lekin admin se image upload karne pe error aayega:
> "Vercel pe image upload ke liye Cloudinary env vars set karo..."

---

## 3. GitHub pe code push karo

Repo pehle se `git init` ho chuka hai. Bas remote add karke push karna hai.

### 3.1 GitHub pe naya repo banao

1. https://github.com/new
2. Name: `LuxuryStay` (ya jo pasand ho)
3. **Public** ya **Private** — dono chalenge
4. **README / .gitignore / license add mat karo** (repo empty chahiye)
5. **Create repository**

### 3.2 Local se push (PowerShell, `D:\LuxuryStay` me)

```powershell
cd D:\LuxuryStay

git add -A
git commit -m "LuxuryStay - MERN hotel management system"

git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/LuxuryStay.git
git push -u origin main
```

`<YOUR-USERNAME>` ki jagah apna GitHub username daalo.

Push pe browser window khul sakti hai — GitHub login karke authorize kar dena.

### 3.3 Check karo

GitHub pe repo refresh karo. Dikhega:
- `backend/` aur `frontend/` folders
- `.env` **nahi** dikhega (gitignored) — yehi sahi hai OK

> **Kabhi bhi** `.env` GitHub pe push mat karna. `MONGO_URI` aur `JWT_SECRET` sirf Vercel ke Environment Variables me jayenge.

---

## 4. Backend deploy — Vercel Project #1

1. https://vercel.com → **Add New... → Project**
2. GitHub connect karo → `LuxuryStay` repo → **Import**
3. Settings me:

| Field | Value |
|---|---|
| Project Name | `luxurystay-api` (ya jo chaho) |
| Framework Preset | **Other** |
| Root Directory | **`backend`** ← Edit karke select karo |
| Build Command | *(khaali chhodo)* |
| Output Directory | *(khaali chhodo)* |
| Install Command | *(khaali chhodo)* |

4. **Environment Variables** (Production + Preview + Development, sab tick):

| Key | Value |
|---|---|
| `MONGO_URI` | `mongodb+srv://...` (Step 1 wala) |
| `JWT_SECRET` | koi lamba random string (e.g. `luxurystay_secret_key_2024`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary se |
| `CLOUDINARY_API_KEY` | Cloudinary se |
| `CLOUDINARY_API_SECRET` | Cloudinary se |

5. **Deploy** dabao.

### 4.1 Backend verify

Deploy ke baad URL milega, jaise `https://luxurystay-api.vercel.app`. Browser me kholo:

```
https://luxurystay-api.vercel.app/            -> "LuxuryStay HMS API is running..."
https://luxurystay-api.vercel.app/api/rooms   -> 7 rooms ka JSON
https://luxurystay-api.vercel.app/api/settings -> settings JSON
```

Teeno kaam karein to backend OK.

**Agar `/api/rooms` pe error aaye:** Vercel → Project → **Logs** kholo. Zyada tar `MONGO_URI` galat hota hai ya Atlas IP allow nahi hai.

---

## 5. Frontend deploy — Vercel Project #2

1. https://vercel.com → **Add New... → Project**
2. Wahi `LuxuryStay` repo dobara **Import** karo (haan, same repo)
3. Settings:

| Field | Value |
|---|---|
| Project Name | `luxurystay` (ya jo chaho) |
| Framework Preset | **Vite** (auto detect ho jayega) |
| Root Directory | **`frontend`** ← Edit karke select karo |
| Build Command | `npm run build` (default) |
| Output Directory | `dist` (default) |

4. **Environment Variables**:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://luxurystay-api.vercel.app/api` ← **apna** backend URL + `/api` |

> `VITE_API_URL` build ke waqt code me bake hoti hai. Agar baad me change karo to **Redeploy** zaroori hai.

5. **Deploy** dabao.

### 5.1 Frontend verify

`https://luxurystay.vercel.app` kholo:

- Home page pe 7 rooms dikhein
- Login karo → dashboard khule
- `/admin` pe refresh karo → 404 **nahi** aana chahiye (`vercel.json` rewrite ki wajah se)
- Admin → Settings me logo upload karke test karo (Cloudinary URL aana chahiye)

---

## 6. Deploy ke baad checklist

| # | Check | Kahan |
|---|---|---|
| 1 | Backend `/` health OK | backend URL |
| 2 | `/api/rooms` 7 rooms | backend URL |
| 3 | Frontend pe rooms load | frontend URL |
| 4 | Register / Login kaam kare | frontend |
| 5 | Booking create ho | guest account |
| 6 | Admin dashboard totals | `/admin` |
| 7 | Admin se room add + image upload | `/admin/rooms` |
| 8 | Logo / favicon upload | `/admin/settings` |
| 9 | Mobile pe sidebar drawer + close | phone / devtools |
| 10 | Page refresh pe 404 nahi | kisi bhi route pe |

---

## 7. Common problems (troubleshooting)

| Problem | Wajah | Fix |
|---|---|---|
| `Database connection failed` | Atlas IP allow nahi / MONGO_URI galat | `0.0.0.0/0` add karo, URI dobara copy karo, Redeploy |
| Frontend pe `Network Error` | `VITE_API_URL` set nahi ya galat | Env var check karo → **Redeploy** (build ke baad hi effect) |
| CORS error | Backend URL galat | `VITE_API_URL` me `https://` + `/api` hona chahiye, trailing slash nahi |
| Image upload 500 | Cloudinary keys missing | 3 Cloudinary env vars add karo → Redeploy |
| Purani images toot gayi | Local `uploads/` URLs DB me hain | Admin se image dobara upload karo (Cloudinary URL save hoga) |
| Route refresh pe 404 | SPA rewrite missing | `frontend/vercel.json` repo me hona chahiye |
| Login "Invalid email or password" | Password change hua hai / account deactivated | Atlas me password reset karo ya naya admin banao |
| Build fail: `vite: not found` | Root Directory galat | Root Directory = `frontend` |
| Backend 404 har route pe | Root Directory galat | Root Directory = `backend` |

---

## 8. Code update karne ka flow

```powershell
cd D:\LuxuryStay
git add -A
git commit -m "kya change kiya"
git push
```

Push hote hi **dono** Vercel projects auto-deploy ho jayenge (2-3 min).

Sirf backend ka env change kiya? → Vercel → Project → Settings → Environment Variables → **Redeploy**.
Sirf frontend ka `VITE_API_URL` change kiya? → **Redeploy** (zaroori hai).

---

## 9. Environment variables — quick reference

### Backend (`backend/`)

```env
MONGO_URI=mongodb+srv://user:pass@mern.aw0ufwk.mongodb.net/luxurystay?retryWrites=true&w=majority
JWT_SECRET=luxurystay_secret_key_2024
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

### Frontend (`frontend/`)

```env
VITE_API_URL=https://luxurystay-api.vercel.app/api
```

> Local development ke liye kuch change karne ki zaroorat nahi:
> - Backend: `cd backend && npm start` → `http://localhost:5000`
> - Frontend: `cd frontend && npm run dev` → `http://localhost:5173`
> - Local pe `VITE_API_URL` na ho to code khud `http://localhost:5000/api` use karta hai.

---

## 10. Custom domain (optional)

1. Vercel → frontend project → **Settings → Domains** → apna domain add karo
2. Domain provider (Namecheap/GoDaddy) me Vercel ke diye hue DNS records lagao
3. Domain add hone ke baad backend ka URL same rahega, frontend ka `VITE_API_URL` bhi same — kuch change nahi karna

Bas.
