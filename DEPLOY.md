# Ruhi Wellness — Deployment Guide

## Option 1: Deploy via Manus (Recommended — Instant)

1. Click the **Publish** button in the Manus Management UI (top-right header).
2. Your site will be live at a `*.manus.space` URL immediately.
3. You can add a custom domain (e.g. `ruhiwellness.com`) in **Settings → Domains**.

---

## Option 2: Export to GitHub + Deploy on Railway

### Step 1: Export to GitHub

1. In the Manus Management UI, click **⋯ (More)** → **Export to GitHub**.
2. Connect your GitHub account and choose a repo name (e.g. `ruhi-wellness`).
3. Click **Export** — all source code will be pushed to your repo.

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign in.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your `ruhi-wellness` repo.
4. Railway will auto-detect the Node.js project and build it.

### Step 3: Add Environment Variables on Railway

In your Railway project, go to **Variables** and add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your MySQL/TiDB connection string |
| `JWT_SECRET` | A random 32-char secret string |
| `NODE_ENV` | `production` |
| `VITE_APP_ID` | Your Manus OAuth App ID |
| `OAUTH_SERVER_URL` | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | `https://manus.im` |
| `OWNER_OPEN_ID` | Your Manus user open ID |
| `OWNER_NAME` | Your name |
| `BUILT_IN_FORGE_API_KEY` | Your Manus Forge API key |
| `BUILT_IN_FORGE_API_URL` | `https://api.manus.im` |

### Step 4: Set Up Database

Railway offers a free MySQL plugin:
1. In your Railway project, click **+ New** → **Database** → **MySQL**.
2. Copy the `DATABASE_URL` from the MySQL plugin and paste it into your Variables.

### Step 5: Set Admin Role

After first login, promote your account to admin via the Railway database console:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ruhi-wellness.git
cd ruhi-wellness

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The site will be available at `http://localhost:3000`.

---

## Admin Panel

Access the admin panel at `/admin`. You must be logged in with an account that has `role = 'admin'` in the database.

**Admin features:**
- Dashboard with booking stats
- Manage all bookings (view consent forms, update status, add notes)
- Edit services (add/edit/delete IV drip treatments)
- Manage testimonials
- View and respond to contact messages
- Edit site settings (brand, contact info, hours, images)
