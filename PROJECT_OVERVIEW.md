# Project Overview

## Purpose
This repository contains the Cashigo customer frontend application built with React, TypeScript, Vite, Tailwind CSS, and Firebase. It serves as the web customer portal for booking services, tracking jobs, managing wallets, viewing notifications, and interacting with support.

## Key Technologies
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Firebase
- React Query
- Zustand
- Leaflet for maps
- Firebase Messaging and service workers
- Radix UI, Heroicons, Lucide, and other UI helpers

## Root Files
- `package.json` - project dependencies and scripts.
- `vite.config.ts` - Vite build and dev server configuration.
- `tsconfig.json` - TypeScript compiler settings and path aliases.
- `index.html` - application HTML entry point.
- `README.md` - project summary and usage guide.
- `.env` - local environment variables (not committed).
- `.env.example` - sample environment file with placeholder values.
- `.gitignore` - files ignored by git.
- `postcss.config.cjs` - PostCSS configuration.
- `tailwind.config.ts` - Tailwind CSS configuration.
- `vercel.json` - Vercel deployment settings.

## Public Folder
- `public/` - static assets and service worker scripts.
  - `service-worker.js` - PWA / caching service worker.
  - `firebase-messaging-sw.js` - Firebase push notifications.
  - `firebase-message-sw.js` - additional Firebase messaging support.
  - `sw.js` - secondary service worker file.

## Source Structure (`src/`)

### Main App Entry
- `src/main.tsx` - bootstraps the React app.
- `src/App.tsx` - root app component.
- `src/AppRoutes.tsx` - application routing and route configuration.

### Global UI & Utilities
- `src/components/` - reusable components and UI building blocks.
  - `common/` - shared common components used across features.
  - `firebase/` - Firebase helpers, notifications, and messaging utilities.
  - `icons/` - reusable icon components.
  - `input/` - shared input controls.
  - `lib/` - visual helpers or library abstractions.
  - `ui/` - generic UI components.
  - `utils/` - helper utilities used by the component layer.

### Feature Modules
- `src/features/` - feature-oriented modules that represent application pages and flows.
  - `Auth/` - authentication and login workflows.
  - `Bookings/` - booking history, booking listings, and booking-related pages.
  - `BookingDetail/` - detailed view for individual bookings.
  - `Home/` - main landing or dashboard experience.
  - `Payment/` - payment and wallet functionality.
  - `Profile/` - user profile and account management.
  - `Notifications/` - notification pages and settings.
  - `WorkerChat/` - customer-worker chat interactions.
  - `JobTracking/`, `JobProgress/`, `JobCompleted/` - live service tracking and progress experiences.
  - `ServiceDetails/`, `ServiceRating/`, `ServiceTierSelection/` - service browsing and selection workflows.
  - `Help/`, `Privacy/`, `CookiePolicy/`, `AboutUs/` - informational and support pages.

### Supporting Files
- `src/hooks/` - custom React hooks.
- `src/lib/` - shared library utilities and query helpers.
- `src/types/` - TypeScript type declarations.
- `src/index.css` and `src/App.css` - application styles.
- `src/ProtectedLayout.tsx` - layout wrapper for authenticated routes.
- `src/ScrollToTop.tsx` - scroll restoration helper.
- `src/ConfirmModal.tsx` - global confirmation modal component.
- `src/NavigationNotification.tsx` - navigation-related notifications helper.

## Recommended Reading Flow
1. Start at `src/main.tsx` to understand app initialization.
2. Review `src/App.tsx` for global providers and layout.
3. Open `src/AppRoutes.tsx` to see the route structure and feature entry points.
4. Inspect `src/components/common/` for shared UI patterns.
5. Explore `src/features/` modules to understand domain-specific pages and flows.

## Running Locally
- `npm install` - install dependencies.
- copy `./.env.example` to `./.env` and fill in environment values.
- `npm run dev` - start development server.
- `npm run build` - build production assets.
- `npm run preview` - preview the production build locally.
- `npm run lint` - run ESLint over the project.

## Notes
- The project uses a feature-first folder organization to keep pages and flows grouped together.
- Global shared components and utilities live under `src/components/`, `src/hooks/`, and `src/lib/`.
- Tailwind CSS is configured through Vite and `tailwind.config.ts`.
- Firebase is used for notifications and messaging, and the public folder contains service worker files required for that integration.
