# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use exactly one fictional room and fictional bookings; never use real room names or timetable data.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps; allow requests that only touch a booking at an endpoint.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI feedback on desktop and mobile.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm run test:unit`
- Build: `npm run build`

## You may

- Edit any file in the project.
- Add packages when a task needs them.
- Do not add a login, authentication, database, backend, or persistence.

## Before you finish

- Run `npm run test:unit` and `npm run build`; all tests must pass before proposing acceptance.
- Never add secrets, API keys, passwords, tokens, credentials, or `.env` files, and do not deploy or publish externally.
