# Stop The Beans 🫘

A futuristic countdown landing page with email capture via Resend.

## Setup

1. Clone this repo
2. Copy `.env.local.example` to `.env.local` and fill in your values
3. `npm install`
4. `npm run dev`

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Add environment variables in Vercel dashboard:
   - RESEND_API_KEY
   - FROM_EMAIL
   - NOTIFY_EMAIL
4. Deploy!
