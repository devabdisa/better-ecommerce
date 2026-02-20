# 🚀 Professional Deployment Guide: Better Store

This guide details exactly how to deploy your E-Commerce application from local development to production using **MongoDB Atlas**, **Render**, **Vercel**, and **Chapa**.

---

## 🏗️ Phase 1: Database (MongoDB Atlas)

Since you are currently using a local MongoDB, you need to migrate to the cloud.

1.  **Sign Up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  **Create a Cluster**: Choose the **FREE (M0)** tier and select a region (e.g., AWS / N. Virginia).
3.  **Database User**: Create a user with a username and a strong password. **Save these credentials.**
4.  **IP Access List**:
    - Go to "Network Access".
    - Add IP: `0.0.0.0/0` (This allows traffic from Render/Vercel. _Note: Atlas security defaults to blocked, so this is required._).
5.  **Get Connection String**:
    - Click "Connect" -> "Drivers" -> "Node.js".
    - Copy the connection string (it looks like `mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`).
    - **Replace `<password>`** with your actual password. This will be your `MONGO_URI`.

---

## 📦 Phase 2: Backend API (Render)

Render will host your Express server.

1.  **Connect GitHub**: Create a [Render](https://render.com/) account and link your repository.
2.  **New Web Service**:
    - **Root Directory**: `backend`
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start`
3.  **Environment Variables (CRITICAL)**:
    - `PORT`: `5001`
    - `MONGO_URI`: (Your Atlas string from Phase 1)
    - `JWT_SECRET`: (Any long random string)
    - `CHAPA_SECRET_KEY`: (Your Chapa Live/Test Secret Key)
    - `FRONTEND_URL`: (Your future Vercel URL, e.g., `https://better-store.vercel.app`)
    - `NODE_ENV`: `production`

---

## 🎨 Phase 3: Frontend UI (Vercel)

Vercel is optimized for your Vite + React application.

1.  **Connect GitHub**: Sign in to [Vercel](https://vercel.com/) and import your project.
2.  **Settings**:
    - **Root Directory**: `frontend`
    - **Install Command**: `npm install`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
3.  **Environment Variables**:
    - `VITE_BACKEND_URL`: (Your Render API URL, e.g., `https://better-store-api.onrender.com`)
4.  **Deploy**: Vercel will automatically detect the Vite config and deploy.

---

## 💳 Phase 4: Payment (Chapa)

To make payments work in production:

1.  **Dashboard**: Go to your [Chapa Dashboard](https://dashboard.chapa.co/).
2.  **Webhook Setup**: In "Settings" -> "Webhooks", set the status to "Enabled".
3.  **Webhook URL**: Set it to `https://your-render-url.onrender.com/api/orders/chapa/webhook`.
4.  **Security**: Ensure your `CHAPA_SECRET_KEY` in Render matches your Chapa Dashboard key.

---

## 📝 Post-Deployment Checklist

- [ ] Update `FRONTEND_URL` in Render after Vercel gives you your final domain.
- [ ] Check `VITE_BACKEND_URL` in Vercel to ensure it doesn't have a trailing slash (e.g., `...onrender.com` NOT `...onrender.com/`).
- [ ] Try creating a dummy product and placing a test order to verify the full flow.

---

_Generated with ❤️ by Better Store Engineering_
