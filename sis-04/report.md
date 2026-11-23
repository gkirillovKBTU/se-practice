# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

## 1. Setup and starting point

| Item | Value |
| --- | --- |
| Assistant (tool) | OpenAI Codex |
| Assistant model | gpt-5.6-sol |
| Starting point | starter |
| Baseline commit | `500c4f5` |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | Windows PowerShell in `result/app/` |

### 1.1 Baseline run

```text
 RUN  v3.2.4 C:/Users/g_kirillov/Downloads/SIS_04/result/app

No test files found, exiting with code 1

include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude: **/node_modules/**, **/.git/**
```

## 2. Context for the assistant

### 2.1 Repository map

```text
app/src/App.tsx — React page; starter room data, form state, and all availability decisions are together here.
app/src/main.tsx — mounts App and imports the global stylesheet.
app/src/index.css — starter desktop and mobile presentation.
app/package.json — Vite, React, TypeScript, and Vitest commands and versions.
diagrams/*.puml — required before and after component diagrams.
tests/check_sis.py — supplied static checker for project, report, evidence, and test shape.
```

### 2.2 The context message as sent

```text
Please analyse this starter without writing code yet. Repository map: App.tsx contains the React page, two rooms, form state and check(); main.tsx mounts it; index.css supplies responsive styles; package.json defines Vite, TypeScript and Vitest. Preserve AC1 reject invalid or past requests, AC2 maximum 120 minutes, AC3 blocked rooms, AC4 strict overlap while endpoint touching is allowed, AC5 no booking mutation, and AC6 clear responsive feedback. Add F1 capacity greater than or equal to attendees, F2 all selected equipment required, F3 blocked rooms never available, F4 a clear empty state, and F5 room switching refreshes the result using that room's bookings. Constraints: fictional data only; no login, payments, live APIs, database, storage, or backend. Give maintainability risks with file or function references and a small prioritised plan, not a rewrite and no code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Availability rules are coupled to rendering and cannot be tested independently. | `src/App.tsx`, `check()` | Time validation, duration, blocked status, and overlap checks are all branches inside the component event handler. | High |
| 2 | Blocked status is user-controlled instead of belonging to each room. | `src/App.tsx` | The `blocked` checkbox is one component state value, so it can contradict whichever room is selected and violates F3. | High |
| 3 | Room data is incomplete and embedded in the UI. | `src/App.tsx` | The two literals have no capacity or equipment, and the component directly maps the catalog, preventing F1 and F2. | High |
| 4 | The selected result can become stale after inputs change. | `src/App.tsx`, `check()` | `result` is set only by the button handler and is not cleared when room or time inputs change. | Medium |

### 3.2 Improvement plan — before editing

1. Extract the existing AC1–AC5 decision into `booking.ts`, add regression and boundary tests, and keep strict endpoint overlap behaviour.
2. Add the typed four-room catalog in `rooms.ts`, including per-room blocked status and bookings.
3. Add `filterRooms` in `filter.ts` with capacity and all-equipment tests before connecting it to the page.
4. Add `checkRoom` so the chosen room supplies its own blocked flag and bookings, including unknown-room and switching tests.
5. Replace embedded room data and validation in `App.tsx` with imports, clear stale results on changes, and add the responsive empty state.
6. Run the full suite and checker, inspect the final files, and record diagrams, evidence, and measured values.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Hide blocked rooms inside `filterRooms` to simplify the selection list. | Modified | `filterRooms` is limited to F1 and F2, while F3 belongs to `checkRoom`; keeping blocked Lab C-303 visible with a label makes the blocked-room behaviour demonstrable and keeps T05 focused. |

## 4. Feature extension (Task 2)

### 4.1 What I added

I added four fictional rooms with capacities from 8 to 40 and projector, whiteboard, and video-conferencing equipment. The page filters as the attendee number and equipment chips change. A matching room is selected from responsive cards; blocked rooms remain visible with a label. Impossible criteria show “No rooms match these requirements.” Changing a room, filter, or time clears the previous result, and the next check uses the selected room's own schedule.

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | 20 attendees plus video conferencing leaves only Room B-204 and Auditorium D-410. |
| `evidence/filter-empty.png` | 50 attendees plus projector returns zero matches and displays the explicit empty-state guidance. |
| `evidence/switch-a.png` | Room A-101 is selected for 10:00–11:00 and reports Unavailable because its booking overlaps exactly. |
| `evidence/switch-b.png` | The same 10:00–11:00 request on Room B-204 reports Available because its schedule is empty. |
| `evidence/narrow.png` | A 390-pixel portrait layout stacks filters, room cards, time fields, and readable feedback. |

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines `Room` and `Booking` types, equipment options, and the four-room data catalog. |
| `src/booking.ts` | Implements pure AC1–AC5 validation and `checkRoom` selection for F3 and F5. |
| `src/filter.ts` | Implements the pure capacity and all-required-equipment rules for F1 and F2. |
| `src/App.tsx` | Holds UI state, composes imported rules, resets stale feedback, and renders the responsive experience. |
| `src/rules.test.ts` | Exercises real rule modules with a fixed catalog independent of demo data. |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep blocked rooms in matching results and mark them clearly. | Remove blocked rooms in `filterRooms`. | F1 and F2 stay independent of F3, while T05 proves `checkRoom` can never report the blocked room as available. |
| Keep `checkRoom` as a small adapter that calls `canBook`. | Repeat the availability branches inside `checkRoom` or `App.tsx`. | A4 and AC1–AC5 require one source of truth, and T09 verifies F5 against each chosen room's data. |
| Clear results whenever selection or request inputs change. | Leave the previous result displayed until another button click. | The old result would describe different inputs, contradicting F5 and the clear-feedback requirement in AC6. |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/App.tsx` `check()` mixed bounds, duration, blocked, and overlap rules into the UI event flow. | `src/booking.ts` owns the complete reusable `canBook` decision. |
| `src/App.tsx` combined room lookup with direct access to the selected room's bookings. | `src/booking.ts` centralises lookup and delegation in `checkRoom`. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | T01 AC1: rejects start equal to end | 720–720 → false |
| AC2 | T03 B1 AC2: exactly 120 minutes is available | 720–840 → true |
| AC3 | T05 F3 AC3: a blocked room is unavailable | blocked room → false |
| AC4 | T06 B3 AC4: touching an existing booking is available | booking ends at request start → true |
| AC5 | T08 AC5: checking availability does not mutate bookings | before and after JSON snapshots → equal |
| F1 | T11 B5 F1: capacity exactly equal to attendees is included | capacity 8, attendees 8 → included |
| F2 | T13 F2: a room must contain all required equipment | projector plus video → only open room |
| F3 | T05 F3 AC3: a blocked room is unavailable | blocked ID → false |
| F4 | T15 F4: impossible criteria returns an empty list | attendees 31 → empty array |
| F5 | T09 F5: room switching uses each chosen room bookings | same time, exact then open → false then true |
| B1 | T03 B1 AC2: exactly 120 minutes is available | 120 minutes → true |
| B2 | T04 B2 AC2: 121 minutes is rejected | 121 minutes → false |
| B3 | T06 B3 AC4: touching an existing booking is available | endpoints touch → true |
| B4 | T07 B4 AC4: overlapping an existing booking is rejected | 10-minute overlap → false |
| B5 | T11 B5 F1: capacity exactly equal to attendees is included | capacity equal → included |
| B6 | T12 B6 F1: capacity one below attendees is excluded | capacity 7, attendees 8 → excluded |
| INT | T16 INT: filtered room can be checked with its own schedule | filter for video then check returned room → true |

### 6.2 Commands

```text
npm install
npx vitest run
npm run build
python tests/check_sis.py
python tests/validate_submission.py
```

### 6.3 Final run

```text
 RUN  v3.2.4 C:/Users/g_kirillov/Downloads/SIS_04/result/app

 ✓ src/rules.test.ts (16 tests) 12ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  17:08:14
   Duration  421ms (transform 63ms, setup 0ms, collect 48ms, tests 12ms, environment 0ms, prepare 91ms)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 0/0 | 16/16 | Read the baseline and final `Tests` results in sections 1.1 and 6.3. |
| Duplicated logic locations removed | 0 | 2 | Counted the two concrete before/after rows in section 5.3. |
| Code structure: modules and their responsibilities | One `App.tsx` held data, rules, and UI | `rooms.ts`, `booking.ts`, `filter.ts`, `App.tsx`, and `rules.test.ts` have separate roles | Listed `app/src` and checked each file against the responsibilities in section 5.1. |
| Remaining limitation | Only two fixed rooms and no capacity or equipment filters | Four fixed fictional rooms; still no cross-day requests or live campus data | Inspected the `ROOMS` constant and the 0–1440 validation in `canBook`; live data is intentionally outside scope. |

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** OpenAI Codex, gpt-5.6-sol
**Date:** 2026-11-23
**Purpose:** Analyse the starter and identify located maintainability risks before editing.

**Prompt:**

```text
Analyse the mapped starter against AC1–AC6 and F1–F5. Point to files or functions, prioritise maintainability risks, and give no code. Preserve fictional local data and the no-backend scope.
```

**Output used:**

```text
High: App.tsx/check() owns validation and presentation, so AC rules cannot be tested independently. High: blocked is component state rather than room data, so F3 can contradict the selected room. High: ROOMS is incomplete and embedded in App.tsx, preventing isolated F1/F2 logic. Medium: result is not reset when the selected room or times change, which can leave stale F5 feedback.
```

**Problems found:** The suggestion to hide every blocked room combined F3 with F1 and F2.
**Changes made:** I recorded four risks and kept blocked status as catalog data while leaving visibility as a UI decision.
**Verified by:** The starter `src/App.tsx`, report section 3.1, and the final T05 F3 test.

### 8.2 Exchange 2

**Tool and model:** OpenAI Codex, gpt-5.6-sol
**Date:** 2026-11-23
**Purpose:** Convert the analysis into a small, regression-safe implementation plan.

**Prompt:**

```text
Using those confirmed risks, produce the smallest safe sequence of changes. Tests must precede rules, canBook must remain the AC1–AC5 source of truth, checkRoom must call it, and the page must only compose imported logic.
```

**Output used:**

```text
First extract canBook and lock its boundaries with AC and B tests. Add the typed room catalog next. Implement filterRooms with equality and all-equipment cases. Add checkRoom with blocked, unknown-ID, and room-switch cases. Finally connect App.tsx, reset stale results, add responsive feedback, then run the complete suite and checker.
```

**Problems found:** The original plan grouped catalog, filtering, and UI into one change that was too broad to inspect safely.
**Changes made:** I split the plan into six ordered steps in section 3.2 and separated pure-rule work from UI composition.
**Verified by:** `rooms.ts`, `filter.ts`, `booking.ts`, `rules.test.ts`, and the after diagram show the planned boundaries.

### 8.3 Exchange 3

**Tool and model:** OpenAI Codex, gpt-5.6-sol
**Date:** 2026-11-23
**Purpose:** Review feature, boundary, and integration tests against the written rules.

**Prompt:**

```text
Review the proposed Vitest cases against AC1–AC5, F1–F5, B1–B6, and INT. Expected values must come from the requirements. Flag weak cases, accidental reliance on demo ROOMS, or any missing call to a real module.
```

**Output used:**

```text
Use a fixed local room array in rules.test.ts. Make B5 include capacity exactly equal to attendees and B6 exclude one below. F2 must require every selected item. Pair B3 touching with true and B4 overlap with false. INT should call filterRooms and then checkRoom on the returned room. Also assert that AC5 leaves the bookings array unchanged.
```

**Problems found:** An early F2 expectation checked only one selected item and therefore did not distinguish all-items from any-item matching.
**Changes made:** T13 requires projector and video together, T16 composes both real modules, and T08 snapshots the input bookings.
**Verified by:** The 16-test final run, the provided checker's S1–S7 checks, and direct inspection of `rules.test.ts`.

## 9. Checker results and known fails

| Check | Why it still fails |
| --- | --- |
| none | All 33 supplied checker checks pass. |

## 10. AI reflection (Task 6)

I gave the assistant a compact repository map, the complete AC1–AC6 and F1–F5 requirements, and the explicit constraints that the data must remain fictional and local. That context was enough to keep the work focused on evolution rather than adding unrelated infrastructure. The most useful suggestions were to make `canBook` the single source of truth, keep the catalog independent from the UI, and test room switching with identical times. Those suggestions map directly to `booking.ts`, `rooms.ts`, and T09.

One suggestion needed correction: hiding blocked rooms in `filterRooms` would mix F3 into a function whose stated responsibility is only F1 and F2. I kept the blocked room visible with a label and verified that `checkRoom` always rejects it. I personally checked every expected value against the handout, inspected the strict overlap expression, confirmed that `checkRoom` passes the chosen room's own data, and compared every screenshot with its report description.

Tests influenced the design before the UI did. B3 and B4 made the endpoint rule explicit, while B5 and B6 protected the capacity boundary. The fixed test catalog also prevents demo-data edits from silently changing expectations. The integration test forced the two pure modules to work together without mocks.

Next I would add rendered accessibility tests for keyboard room selection and live status announcements. I would also extract the time conversion helpers into a small tested module if the form grew, but the current version keeps that presentation-only conversion close to the page without duplicating business rules.
