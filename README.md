# Skyhoist Engineering Services

Corporate website for **Skyhoist Engineering Services** — a Next.js rebuild of the former Levagex Petroleum Services site with full rebranding, plus a private certificate registry portal.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- **Firebase Firestore + Storage** for the certificate registry (falls back to local JSON when Firebase env vars are unset)
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

- Login: `/certificate/login/`
- Default admin when env vars are unset:
  - Username: `admin`
  - Password: `SkyhoistAdmin1`

Roles:

- **Admin** — customers, certificates, settings, add/remove operators (password-based, no email invite)
- **Operator** — customers and certificates only

Public certificate verification (also unlisted): `/verify/<token>/`

## Firebase database (required for Vercel)

Local JSON under `/data` (or `/tmp` on serverless) does **not** survive across Vercel instances. Production must use Firebase.

### 1. Firebase project (one-time)

1. Open [Firebase Console → skyhoist-engineering](https://console.firebase.google.com/project/skyhoist-engineering)
2. **Build → Firestore Database → Create database** (Native mode) — required
3. **Build → Storage → Get started** (bucket like `skyhoist-engineering.firebasestorage.app`)
4. **Project settings → Service accounts → Generate new private key**

### 2. Env vars

Copy `.env.example` → `.env.local` and set:

```bash
FIREBASE_SERVICE_ACCOUNT_JSON='{...full service account JSON...}'
FIREBASE_STORAGE_BUCKET=skyhoist-engineering.firebasestorage.app
FIREBASE_UPLOAD_BACKEND=storage
CERT_ADMIN_USERNAME=admin
CERT_ADMIN_PASSWORD='your-strong-password'
CERT_SESSION_SECRET='long-random-secret'
```

On Vercel, add the same vars for **Production**, then Redeploy.

### 3. Seed collections + admin

```bash
npm run firebase:setup
```

This writes:

| Collection / path | Purpose |
| --- | --- |
| `certUsers` | Admins + operators |
| `certCustomers` | Customers |
| `certCertificates` | Certificates + verification tokens |
| `cert-uploads/` (Storage) | Certificate page PDFs/images (`FIREBASE_UPLOAD_BACKEND=storage`) |
| `certUploads` (Firestore) | Fallback file storage if Storage is unavailable |

Security rules deny all client SDK access; only the Next.js server (Admin SDK) reads/writes.

```bash
npm run firebase:rules   # after firebase login
```

## Scripts

- `npm run dev` — development server (port 3456)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run firebase:setup` — seed Firestore + Storage for the cert registry
- `npm run firebase:rules` — deploy Firestore/Storage security rules

## Deploy notes

Deploy with a Node host that supports Next.js Route Handlers (e.g. Vercel). Firebase Hosting static export is not used for the full app.
