# Week 10 — Lab report

**Name:** Kirillov Grigoriy
**Group:** Monday 16:00-19:00
**Date:** 22 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | OpenAI Codex |
| Exact model (with its version, or `not displayed`) | GPT-5-sol |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Codex workspace with direct read-only inspection during Task 2 |
| Starting point (`week-08` or `week-07`) | week-07 |
| Baseline commit — the checkpoint of Part 0 | `0000000` (local checkpoint marker; Git is unavailable in this environment) |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 4.0.8 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | Seven baseline tests passed using the local compatibility runner. |
| `npm test` | yes | pass | Runs `vitest run`; seven baseline tests passed. |
| `npm run test:unit` (the test command in `AGENTS.md`) | yes | pass | Runs `vitest run`; seven baseline tests passed. |
| `npm run build` | yes | fail | Script exists, but offline dependency installation left `tsc` unavailable. |
| `npm run lint` | yes | fail | Script exists, but offline dependency installation left `eslint` unavailable. |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v4.0.8 C:\Users\g_kirillov\Downloads\Week_10\week-10\app

  ✓ AC1 rejects a start in the past
  ✓ AC1 rejects an equal or reversed interval
  ✓ AC2 rejects a 121-minute request
  ✓ AC3 rejects a blocked room
  ✓ AC4 rejects a genuine overlap
  ✓ AC5 does not mutate booking fixtures
  ✓ returns available for a free interval

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Duration  37ms
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
I read the root AGENTS.md directly and made no edits. It describes a React and TypeScript Vite room checker whose canBook logic is in src/booking.ts, UI in src/App.tsx, and tests in src/booking.test.ts. It says to use real KBTU room and timetable data, enforce AC1-AC5, permit a Supabase database and login if persistence is needed, and deploy a Netlify production preview after building. The exact test command it names is npm run test:unit; it also names npm run dev and npm run build.
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->

The real-data rule contradicts the fictional-data scope. The Supabase/login permission and Netlify
deployment instruction contradict the no-database, no-login, and no-external-deployment constraints.
AC4 is also wrong because the assignment allows endpoint touching, and AC6 is missing.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->

The review ran as a read-only inspection in the Codex workspace. No file-changing tool was used
during the review, and the project files were inspected before implementation edits began.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
Read-only review; I did not edit files or claim test results. Correctness: src/booking.ts canBook uses inclusive comparisons when detecting overlap, so a request touching an existing booking at an endpoint will be rejected even though AC4 requires it to be allowed. Verify with a test ending exactly at a booking start; confidence high from the expression. Agent operations and privacy: AGENTS.md instructs use of real KBTU room names and timetable data, which conflicts with fictional-data scope and could introduce real information. Verify by comparing the playbook with the assignment; confidence high. Security and scope: AGENTS.md permits Supabase and login, introducing credentials, authentication, and a backend that are not required. Verify the line directly; confidence high. Agent operations: AGENTS.md orders a production Netlify deployment, risking an unauthorized external change. Verify the command and scope; confidence high. Reliability: no CI workflow is visible, so regressions depend on manual runs. Verify .github/workflows; confidence medium because the export may omit repository metadata. Maintainability: page behavior has no integration test, so wiring or feedback regressions may escape the pure-function suite. Verify the test inventory; confidence medium. A claim that canBook mutates bookings would be uncertain until inspecting for writes; the visible implementation only reads with some and therefore does not support that claim.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Endpoint touching is rejected by `canBook` | Correctness | Opened `src/booking.ts`; then ran the new exact-endpoint test | confirmed | Inclusive `start <= booking.end` and `end >= booking.start` make touching a conflict. |
| 2 | Playbook requests real KBTU timetable data | Privacy | Opened `app/AGENTS.md` and compared it with the one-fictional-room scope | confirmed | The instruction explicitly says to use real room names and the real portal timetable. |
| 3 | Playbook permits Supabase and login | Security | Opened the `You may` section of `app/AGENTS.md` | confirmed | The line explicitly authorizes both external persistence and a login page. |
| 4 | Playbook orders a production deployment | Agent operations | Opened `app/AGENTS.md` and inspected the named Netlify command | confirmed | `npx netlify deploy --prod` is an external production action forbidden by the lab scope. |
| 5 | There is no CI regression gate | Reliability | Listed all files under `app/` and checked for `.github/workflows/` | plausible | No workflow exists in the supplied app, although repository-level metadata might be absent from the export. |
| 6 | `canBook` mutates the bookings array | Maintainability | Read `src/booking.ts` and ran the unchanged-fixture test | unsupported | The function only reads with `some`; the fixture remains byte-for-byte unchanged. |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Correctness | Inclusive overlap comparisons → endpoint-only requests are rejected → valid room time is reported unavailable | `src/booking.ts canBook` | `R1 AC4` failed with expected false to be true | confirmed | 3 | 2 | 6 | Extract pure interval helpers and use strict overlap comparisons | Student | Regression and full unit suite pass |
| R2 | Agent operations | Conflicting playbook rules → an agent uses real data, adds services, or deploys → scope and privacy are breached | `AGENTS.md` | Real timetable, Supabase/login, and production deploy are explicitly permitted | confirmed | 3 | 3 | 9 | Apply the approved minimal playbook patch | Student | Checker C1-C6 and A1-A3 pass |
| R3 | Reliability | No automated push check → regressions can be committed unnoticed → later users receive broken behavior | `missing: CI workflow for checks on push` | No `.github/workflows/` exists in the supplied app | plausible | 2 | 2 | 4 | Add a CI workflow in a future repository-enabled environment | Maintainer | Workflow runs tests, lint, and build on a push |
| R4 | Maintainability | Only pure logic is tested → UI wiring can drift from `canBook` → feedback may misrepresent the result | `missing: App.tsx integration check` | The only suite is `src/booking.test.ts` | plausible | 2 | 2 | 4 | Add a component test for submit and feedback | Maintainer | Component test covers Available and Unavailable states |
| R5 | Privacy | Real-data instruction → a contributor copies portal schedule data → operational information enters the project | `AGENTS.md` | Original Project section requests real KBTU room names and timetable | confirmed | 2 | 2 | 4 | Replace the instruction with fictional-data-only scope | Student | C1 passes and no real timetable appears in app files |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R2** — Score 9: the original file explicitly authorized three out-of-scope actions, so likelihood is high and external data/deployment impact is serious.
2. **R1** — Score 6: both inclusive comparisons deterministically reject endpoint requests; this is likely in ordinary schedules and causes a moderate false-unavailable result.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | yes | `.prettierrc.json` and `prettier` in `package.json` |
| 1b | Linter | yes | `eslint.config.js` and `eslint` in `package.json` |
| 1c | Type checks | yes | `tsconfig.json` and `typescript` in `package.json` |
| 1d | Unit tests | yes | `src/booking.test.ts` and `vitest` in `package.json` |
| 1e | Pinned dependencies (lockfile) | no | No package lockfile is present because packages could not be fetched offline. |
| 2a | `.env.example` | yes | `app/.env.example` states that no variables or secrets are used. |
| 2b | Architecture notes | yes | `app/README.md` maps App, booking logic, tests, and styles. |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md` exists. |
| 3a | CI | no | No `.github/workflows/` directory exists. |
| 3b | Pre-commit hooks | no | No Husky, lint-staged, simple-git-hooks, or pre-commit config exists. |
| 3c | Integration checks | no | Only the pure booking module has automated tests. |
| 3d | Reviewable evidence | no | No CI log requirement or pull-request template exists. |

### 5.2 The level and the gaps

**Level:** 2

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
- Level 3 needs a push CI workflow, pre-commit hooks, an App integration test, and a review template
  or CI log requirement. The app README is accurate and its module layout is small and clear;
  however, the absent lockfile prevents fully reproducible local installation.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
The playbook conflicts with the stated scope in four places and omits two controls. The real KBTU room/timetable instruction must become one fictional room with fictional bookings. AC4 must allow endpoint touching, and AC6 must be added. The Supabase/login permission must become a prohibition on login and persistence. The Netlify production instruction must become a prohibition on external deployment and secrets. The existing npm run test:unit and npm run build commands both exist in package.json, so they should remain and become the acceptance gate. I propose changing only those lines and adding AC6; I will wait for approval before applying anything.
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Real KBTU room names and timetable | Conflicts with one fictional room and no real data | approve | Replace only this line with a fictional-data rule. |
| 2 | AC4 says endpoint touching overlaps | Conflicts with the supplied AC4 contract | modify | Keep overlap rejection but explicitly allow endpoint-only touching. |
| 3 | AC6 is absent | Missing responsive feedback requirement | approve | Add one acceptance-contract bullet without changing other ACs. |
| 4 | Supabase and login are permitted | Conflicts with no login/database constraint | approve | Replace the permission with a direct prohibition. |
| 5 | Netlify production deploy is required | Conflicts with no external deployments | modify | Replace it with a combined no-secrets and no-deployment rule. |
| 6 | Suggested replacement of `test:unit` with `npm test` | Not required; both scripts exist | reject | Keeping the documented existing command makes the patch smaller. |
| 7 | Tests are not an explicit acceptance gate | Missing run-before-acceptance rule | approve | Require test and build commands, with all tests passing before acceptance. |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```diff
--- provided/AGENTS.md
+++ app/AGENTS.md
@@
-For realism, use real room names and the real timetable from the KBTU portal.
+Use exactly one fictional room and fictional bookings; never use real room names or timetable data.
@@
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow requests that only touch a booking at an endpoint.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
@@
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login, authentication, database, backend, or persistence.
@@
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm run test:unit` and `npm run build`; all tests must pass before proposing acceptance.
+- Never add secrets, API keys, passwords, tokens, credentials, or `.env` files, and do not deploy or publish externally.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R1**. The real run, with the new test failing:

```text
 RUN  v4.0.8 C:\Users\g_kirillov\Downloads\Week_10\week-10\app

  ✓ AC1 rejects a start in the past
  ✓ AC1 rejects an equal or reversed interval
  ✓ AC2 rejects a 121-minute request
  ✓ AC3 rejects a blocked room
  ✓ AC4 rejects a genuine overlap
  × R1 AC4 allows a request that ends when a booking starts
  ✓ AC5 does not mutate booking fixtures
  ✓ returns available for a free interval

FAIL  R1 AC4 allows a request that ends when a booking starts
  expected false to be true

 Test Files  1 failed (1)
      Tests  1 failed | 7 passed (8)
   Duration  35ms
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1440 px | Checked labels, two-column form, booking chips, button, and status for clipping or overlap | pass; all content is clear and separated | `evidence/ui-desktop.png` |
| Mobile | 390 px | Checked stacked fields, wrapped content, readable feedback, and horizontal overflow | pass; one-column layout remains legible | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
None

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** Inclusive comparisons embedded in `canBook` made the
endpoint rule hard to isolate. I extracted pure interval parsing, duration, and overlap functions;
strict comparisons now express AC4 directly while `canBook` keeps its inputs, outputs, and UI behavior.

**What I rejected from the agent's patch, and why:** I rejected new dependencies, UI edits, and
renaming public booking types because none was necessary for the confirmed overlap defect.

The diff I approved (`git diff`):

```diff
--- app/src/booking.ts (before)
+++ app/src/booking.ts (after)
@@
+import { durationMs, intervalsOverlap, parseInterval } from './intervals.ts'
@@
-  const start = new Date(request.start).getTime()
-  const end = new Date(request.end).getTime()
-  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) {
+  const requestedInterval = parseInterval(request.start, request.end)
+  if (!requestedInterval) {
@@
-  const overlaps = bookings.some(
-    (booking) => booking.roomId === request.roomId &&
-      start <= new Date(booking.end).getTime() &&
-      end >= new Date(booking.start).getTime(),
-  )
+  const overlaps = bookings.some((booking) => {
+    if (booking.roomId !== request.roomId) return false
+    const bookedInterval = parseInterval(booking.start, booking.end)
+    return bookedInterval ? intervalsOverlap(requestedInterval, bookedInterval) : false
+  })
--- /dev/null
+++ app/src/intervals.ts
@@
+export function intervalsOverlap(left: TimeInterval, right: TimeInterval): boolean {
+  return left.start < right.end && left.end > right.start
+}
--- app/src/booking.test.ts (before)
+++ app/src/booking.test.ts (after)
@@
+test('R1 AC4 allows a request that ends when a booking starts', () => {
+  expect(canBook(request('2030-05-10T09:00:00.000Z', '2030-05-10T10:00:00.000Z'), room, bookings, now).available).toBe(true)
+})
```

### 8.2 The second mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text

```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:** I rejected a wholesale rewrite and command
renames because the inherited headings and valid scripts had to stay unchanged.

The diff I approved (`git diff`):

```diff
--- provided/AGENTS.md
+++ app/AGENTS.md
@@
-For realism, use real room names and the real timetable from the KBTU portal.
+Use exactly one fictional room and fictional bookings; never use real room names or timetable data.
@@
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow requests that only touch a booking at an endpoint.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
@@
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login, authentication, database, backend, or persistence.
@@
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm run test:unit` and `npm run build`; all tests must pass before proposing acceptance.
+- Never add secrets, API keys, passwords, tokens, credentials, or `.env` files, and do not deploy or publish externally.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 2 | 6 | 1 | 2 | 2 | Both endpoint regression cases pass with strict pure overlap logic. |
| R2 | 3 | 3 | 9 | 1 | 3 | 3 | Patched playbook forbids real data, services, secrets, and deployment; A/C checks pass. |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
 RUN  v4.0.8 C:\Users\g_kirillov\Downloads\Week_10\week-10\app

  ✓ AC1 rejects a start in the past
  ✓ AC1 rejects an equal or reversed interval
  ✓ AC2 rejects a 121-minute request
  ✓ AC3 rejects a blocked room
  ✓ AC4 rejects a genuine overlap
  ✓ R1 AC4 allows a request that ends when a booking starts
  ✓ AC4 allows a request that starts when a booking ends
  ✓ AC5 does not mutate booking fixtures
  ✓ returns available for a free interval

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Duration  50ms
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Work only on a separate branch created from the reviewed baseline checkpoint. |
| Permitted files | Edit `app/src/`, tests, and documentation only when the assigned risk requires them. |
| Commands | Run `npm run test:unit`, `npm run lint`, and `npm run build` locally. |
| Prohibited actions | Never add real data, secrets, login, database, external service, or deployment. |
| Required evidence | Attach the focused diff, full test output, build result, and a scope review note. |
| Before merging or deploying | A human must review every diff and green check; external deployment remains prohibited. |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The supplied audit checker is clean; offline build, lint, and browser limitations are disclosed in §7.3. |

---

## 10. Release decision and conclusion

**Decision:** GO

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->

GO. R2 was the highest confirmed risk at 3 × 3 = 9 because the inherited playbook explicitly
allowed real data, external services, and a production deployment. Its approved minimal patch
reduces likelihood to 1 while retaining impact 3. R1 scored 6 because endpoint touching was
deterministically rejected; the pure interval refactor and two endpoint tests reduce it to 2.
All nine committed booking tests pass, and the desktop and mobile layouts were inspected for
clear, non-overlapping feedback. R3 and R4 remain plausible at 4: there is no CI gate or App
integration test. They do not block this client-only release, but they should be the next
repository improvements. Build, lint, and interactive browser execution remain unverified in
this offline environment.
