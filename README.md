# Skyhoist Engineering Services

Corporate website for **Skyhoist Engineering Services** — a Next.js rebuild of the former Levagex Petroleum Services site with full rebranding, plus a private certificate registry portal.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Local JSON store + file uploads for the certificate dashboard
- Brand assets from the Skyhoist logo pack and industrial photography

## Contact

- **Address:** Office 201, Building 38, Al-Multaqa Al-Arabi, Sheraton Airport, Cairo, Egypt
- **Phone:** +201275109220 · +201042851184
- **Email:** Info@skyhoistservices.com
- **Web:** skyhoistservices.com

## Run locally

This app needs the Next.js Node server (API routes + uploads). Static export is disabled.

```bash
npm install
npm run dev
```

Open [http://localhost:3456](http://localhost:3456).

### Certificate portal (unlisted)

Not linked from the marketing site. Open by URL only:

- Login: [http://localhost:3456/certificate/login/](http://localhost:3456/certificate/login/)
- Default admin (local seed):
  - Username: `admin`
  - Password: `SkyhoistAdmin1`

Override with env vars before first run:

```bash
CERT_ADMIN_USERNAME=admin
CERT_ADMIN_PASSWORD='your-strong-password'
CERT_ADMIN_EMAIL=admin@skyhoistservices.com
CERT_SESSION_SECRET='long-random-secret'
```

Roles:

- **Admin** — customers, certificates, settings, add/remove operators (password-based, no email invite)
- **Operator** — customers and certificates only

Public certificate verification (also unlisted): `/verify/<token>/`

Local data lives in `/data` (gitignored).

## Scripts

- `npm run dev` — development server (port 3456)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Deploy notes

Firebase Hosting static `out/` export is no longer used for the full app because the certificate portal requires server routes. Deploy with a Node host (`next start`) or an adapter that supports Next.js Route Handlers.
