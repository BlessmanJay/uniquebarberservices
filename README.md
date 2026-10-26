# Unique Barbershop

A modern salon landing page and booking platform built with React, Vite, and Supabase. The app presents a premium barbershop brand, highlights services, allows customers to request appointments, and gives the salon admin a secure dashboard to manage bookings and service pricing.

## Overview

This project is a polished marketing website for a barbershop business with a working appointment workflow. It combines a stylish landing page with a client booking form, payment flow, and an admin dashboard for managing bookings and pricing.

### Included features

- Responsive salon landing page with hero sections and service highlights
- About, contact, and service pages for the brand
- Book-visit form with validation for name, service, date, time, and phone number
- Appointment availability checks against booked slots
- 70% deposit and payment reference submission flow
- Admin dashboard for appointment management, filtering, and service price updates
- Supabase-backed data storage and authentication checks

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Supabase
- Heroicons and React Icons

## Project Structure

```text
salon-landing-page/
├── public/                     # Static salon images and branding assets
├── src/
│   ├── components/            # Shared page sections and UI pieces
│   ├── contexts/              # Navigation state context
│   ├── helpers/               # Payment token helper
│   ├── pages/                 # Home, About, Contact, Services, Booking pages
│   ├── services/              # Supabase client setup
│   ├── AdminDashboard.jsx     # Admin appointment management
│   ├── AdminLogin.jsx         # Admin authentication page
│   ├── App.jsx                # Routing and session logic
│   ├── database.json          # Database schema metadata
│   ├── index.css              # Global styling
│   └── main.jsx               # App entry
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── ...
```

## Prerequisites

Before running this project, install:

- Node.js 18+
- npm
- A Supabase project configured with the expected tables and auth setup

## Environment Variables

Create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

These are used in `src/services/supabase.js`.

## Supabase Requirements

This app expects Supabase tables such as:

- `services` with `id`, `name`, `price`, `is_active`, `created_at`, `updated_at`
- `appointments` with booking details, payment status, deposit/balance values, and payment reference data
- `admin_users` to restrict admin access to authorized users

The booking and payment flow may also rely on database functions such as `verify_appointment_payment` and `submit_payment_reference`.

## Installation

```bash
npm install
```

## Available Scripts

```bash
npm run dev
```

Run the local Vite development server.

```bash
npm run build
```

Create a production build.

```bash
npm run preview
```

Preview the production build locally.

```bash
npm run lint
```

Run ESLint checks for the project.

## Running the App

```bash
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

## Deployment

This project can be deployed as a static Vite app. After building it with:

```bash
npm run build
```

you can deploy the generated `dist` folder to Vercel, Netlify, Cloudflare Pages, or any static hosting platform.

## Notes

- The branding and styling are centered around a salon called “Unique Barbershop.”
- Service pricing is stored in Supabase and can be managed from the admin dashboard.
- The admin login route is protected by Supabase auth and a matching `admin_users` record.
- Assets such as salon photos and branding images are served from the `public` folder.

## License

This project is intended for portfolio or demo use unless otherwise stated by the owner.
