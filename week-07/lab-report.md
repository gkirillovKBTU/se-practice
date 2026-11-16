# Week 07 — Lab report

**Name:** Kirillov Grigoriy
**Group:** Monday 16:00-19:00
**Date:** 10 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | starter |
| Bolt project link (or `not shared`, and why) | none |
| Assistant that generated the tests (tool) | OpenAI Codex desktop |
| Exact model (with its version, or `not displayed`) | GPT-6.1-sol|
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer, Windows |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Test command | npm test (portable); local installed Vitest CLI used for recorded runs |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | starter/src/App.tsx, check inside App |
| Its inputs | s, e, n, blocked, room.bookings |
| What it returned | local boolean ok, passed to setResult |
| How the page used it | rendered Available or Unavailable from result |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->

I moved the numeric interval, future-time, duration, blocked-room, and strict overlap checks into app/src/booking.ts. The early returns preserve the original order and boolean decisions. App.tsx imports canBook and supplies the same converted times and selected room data. Time parsing, validation messages, and rendering remain in the page. Neither the original loop nor the extracted function changes bookings. No intentional behavioral correction was necessary. Unit evidence verifies the extracted rules. The built-in Browser now also verifies the available and blocked results, missing-input feedback, phone layout, and unchanged displayed bookings.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The request starts exactly where the existing booking ends; no time is shared. |
| T02 | 540–570 (starts now) | false | AC1 | Starting at 540 equals now rather than being strictly later. |
| T03 | 720–720 (zero duration) | false | AC1 | Equal endpoints contain no positive duration. |
| T04 | 750–720 (reversed) | false | AC1 | The end precedes the start, violating the ordering rule. |
| T05 | 1380–1441 (past day end) | false | AC1 | 1441 exceeds the inclusive day limit of 1440. |
| T06 | 720–840 (120 minutes) | true | AC2 | 840 minus 720 is exactly the allowed maximum, 120. |
| T07 | 720–841 (121 minutes) | false | AC2 | 841 minus 720 is 121, exceeding the maximum. |
| T08 | 570–600 (touching before) | true | AC4 | The request ends exactly where the existing booking starts. |
| T09 | 630–690 (partial overlap) | false | AC4 | 630 to 660 is shared with the existing booking. |
| T10 | 570–690 (contains booking) | false | AC4 | The request surrounds the existing booking and shares its whole interval. |
| T11 | 615–645 (inside booking) | false | AC4 | The entire request lies inside the existing booking. |
| T12 | 600–660 (identical interval) | false | AC4 | Identical intervals share every minute. |
| T13 | 660–720, blocked = true | false | AC3 | Blocking rejects even an otherwise valid touching request. |
| T14 | 630–690, bookings = [] | true | AC4 | With no bookings there is nothing to overlap. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | Availability checks must not add, remove, or edit a booking. |
| X1 | 1380-1440 | true | AC1 | 1440 is included in the permitted end range. |
| X2 | 660-720, bookings=[600-660,720-780] | true | AC4 | The request fits exactly between 600-660 and 720-780 without sharing time. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

| ID | Candidate / changed input | Expected | AC | Reason (in my words) |
| --- | --- | --- | --- | --- |
| T01 | 660-720 | true | AC4 | The request starts exactly where the existing booking ends; no time is shared. |
| T02 | 540-570 | false | AC1 | Starting at 540 equals now rather than being strictly later. |
| T03 | 720-720 | false | AC1 | Equal endpoints contain no positive duration. |
| T04 | 750-720 | false | AC1 | The end precedes the start, violating the ordering rule. |
| T05 | 1380-1441 | false | AC1 | 1441 exceeds the inclusive day limit of 1440. |
| T06 | 720-840 | true | AC2 | 840 minus 720 is exactly the allowed maximum, 120. |
| T07 | 720-841 | false | AC2 | 841 minus 720 is 121, exceeding the maximum. |
| T08 | 570-600 | true | AC4 | The request ends exactly where the existing booking starts. |
| T09 | 630-690 | false | AC4 | 630 to 660 is shared with the existing booking. |
| T10 | 570-690 | false | AC4 | The request surrounds the existing booking and shares its whole interval. |
| T11 | 615-645 | false | AC4 | The entire request lies inside the existing booking. |
| T12 | 600-660 | false | AC4 | Identical intervals share every minute. |
| T13 | 660-720, blocked=true | false | AC3 | Blocking rejects even an otherwise valid touching request. |
| T14 | 630-690, bookings=[] | true | AC4 | With no bookings there is nothing to overlap. |
| X1 | 1380-1440 | true | AC1 | 1440 is included in the permitted end range. |
| X2 | 660-720, bookings=[600-660,720-780] | true | AC4 | The request fits exactly between 600-660 and 720-780 without sharing time. |
| AC5 | 660-720, compare bookings with a prior clone | true, unchanged | AC5 | Availability checks must not add, remove, or edit a booking. |

export type Interval = { start: number; end: number };
export type BookingRequest = { start: number; end: number; now: number; blocked: boolean; bookings: Interval[] };

export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Run command: cd app && npm test
AC1: T02-T05, X1. AC2: T06-T07. AC3: T13. AC4: T01, T08-T12, T14, X2. AC5: preservation test.
AC6 is a browser concern and has no unit-test coverage here.
Unclear: no required policy for malformed existing bookings; nonfinite numeric inputs are also unspecified.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T06 and T07 | No error found; inclusive maximum reviewed independently | accept | AC2 permits exactly 120 and rejects 121 |
| 2 | AC5 | Only the successful path checks data preservation | revise | AC5 also requires unchanged data after rejection; add a separate check |
| 3 | AC1 lower bound | No independent negative-start case | revise | Add negative start with an earlier supplied now so the lower bound decides |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text

 RUN  v3.2.4 C:/Users/user/Downloads/Week_07/.work/app

 ✓ src/booking.test.ts (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  22:44:41
   Duration  390ms (transform 38ms, setup 0ms, collect 57ms, tests 3ms, environment 0ms, prepare 141ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | 17 passed | Expected values reviewed against ACs | Neither | Extend coverage without changing correct expectations |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.


 RUN  v3.2.4 C:/Users/user/Downloads/Week_07/.work/app

 ✓ src/booking.test.ts (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  22:44:41
   Duration  390ms (transform 38ms, setup 0ms, collect 57ms, tests 3ms, environment 0ms, prepare 141ms)
```

```text
No incorrect boolean expectations were found. Keep the real import, fresh arrays, fixed now, and all 17 cases.
Add a rejected-request preservation test: AC5 applies to unsuccessful checks too; it catches mutation on an overlap path.
Add a negative-start test with now=-2: AC1 independently forbids a negative start; this detects removal of the lower-bound check without the future-time rule masking it.
X1 covers exactly 1440 and X2 covers two touching bookings. These are complementary boundaries, not duplicates.
Test repairs: none. Test extensions: two. Implementation fixes: none. Browser behavior still requires separate evidence.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text

 RUN  v3.2.4 C:/Users/user/Downloads/Week_07/.work/app

 ✓ src/booking.test.ts (19 tests) 3ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  22:44:47
   Duration  391ms (transform 39ms, setup 0ms, collect 57ms, tests 3ms, environment 0ms, prepare 138ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | Not applicable |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, X2, AC5 | Not applicable |
| M3 | Remove the blocked-room rejection | Detected | T13 | Not applicable |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text

 RUN  v3.2.4 C:/Users/user/Downloads/Week_07/.work/app

 ❯ src/booking.test.ts (19 tests | 1 failed) 8ms
   ✓ T01 AC4: touching after 1ms
   ✓ T02 AC1: starts now 0ms
   ✓ T03 AC1: zero duration 0ms
   ✓ T04 AC1: reversed 0ms
   ✓ T05 AC1: past day end 0ms
   × T06 AC2: exactly 120 minutes 5ms
     → expected false to be true // Object.is equality
   ✓ T07 AC2: 121 minutes 0ms
   ✓ T08 AC4: touching before 0ms
   ✓ T09 AC4: partial overlap 0ms
   ✓ T10 AC4: contains booking 0ms
   ✓ T11 AC4: inside booking 0ms
   ✓ T12 AC4: identical interval 0ms
   ✓ T13 AC3: blocked room 0ms
   ✓ T14 AC4: empty bookings 0ms
   ✓ X1 AC1: exact day end 0ms
   ✓ X2 AC4: touches two bookings 0ms
   ✓ AC5: available request preserves bookings 0ms
   ✓ AC5: rejection preserves bookings 0ms
   ✓ AC1: negative start is invalid even before the supplied time 0ms

 Test Files  1 failed (1)
      Tests  1 failed | 18 passed (19)
   Start at  22:44:43
   Duration  448ms (transform 62ms, setup 0ms, collect 106ms, tests 8ms, environment 0ms, prepare 136ms)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T06 AC2: exactly 120 minutes
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:31:81
     29| test('T06 AC2: exactly 120 minutes', () => {
     30|   const bookings = [{ start: 600, end: 660 }];
     31|   expect(canBook({ start: 720, end: 840, now: 540, blocked: false, boo…
       |                                                                                 ^
     32| });
     33| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
```

```text

 RUN  v3.2.4 C:/Users/user/Downloads/Week_07/.work/app

 ❯ src/booking.test.ts (19 tests | 4 failed) 10ms
   × T01 AC4: touching after 7ms
     → expected false to be true // Object.is equality
   ✓ T02 AC1: starts now 0ms
   ✓ T03 AC1: zero duration 0ms
   ✓ T04 AC1: reversed 0ms
   ✓ T05 AC1: past day end 0ms
   ✓ T06 AC2: exactly 120 minutes 0ms
   ✓ T07 AC2: 121 minutes 0ms
   × T08 AC4: touching before 0ms
     → expected false to be true // Object.is equality
   ✓ T09 AC4: partial overlap 0ms
   ✓ T10 AC4: contains booking 0ms
   ✓ T11 AC4: inside booking 0ms
   ✓ T12 AC4: identical interval 0ms
   ✓ T13 AC3: blocked room 0ms
   ✓ T14 AC4: empty bookings 0ms
   ✓ X1 AC1: exact day end 0ms
   × X2 AC4: touches two bookings 0ms
     → expected false to be true // Object.is equality
   × AC5: available request preserves bookings 0ms
     → expected false to be true // Object.is equality
   ✓ AC5: rejection preserves bookings 0ms
   ✓ AC1: negative start is invalid even before the supplied time 0ms

 Test Files  1 failed (1)
      Tests  4 failed | 15 passed (19)
   Start at  22:44:44
   Duration  449ms (transform 64ms, setup 0ms, collect 104ms, tests 10ms, environment 0ms, prepare 135ms)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01 AC4: touching after
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:6:81
      4| test('T01 AC4: touching after', () => {
      5|   const bookings = [{ start: 600, end: 660 }];
      6|   expect(canBook({ start: 660, end: 720, now: 540, blocked: false, boo…
       |                                                                                 ^
      7| });
      8| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/booking.test.ts > T08 AC4: touching before
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:41:81
     39| test('T08 AC4: touching before', () => {
     40|   const bookings = [{ start: 600, end: 660 }];
     41|   expect(canBook({ start: 570, end: 600, now: 540, blocked: false, boo…
       |                                                                                 ^
     42| });
     43| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/booking.test.ts > X2 AC4: touches two bookings
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:81:81
     79| test('X2 AC4: touches two bookings', () => {
     80|   const bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }…
     81|   expect(canBook({ start: 660, end: 720, now: 540, blocked: false, boo…
       |                                                                                 ^
     82| });
     83| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/booking.test.ts > AC5: available request preserves bookings
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:87:81
     85|   const bookings = [{ start: 600, end: 660 }];
     86|   const before = structuredClone(bookings);
     87|   expect(canBook({ start: 660, end: 720, now: 540, blocked: false, boo…
       |                                                                                 ^
     88|   expect(bookings).toEqual(before);
     89| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯
```

```text

 RUN  v3.2.4 C:/Users/user/Downloads/Week_07/.work/app

 ❯ src/booking.test.ts (19 tests | 1 failed) 8ms
   ✓ T01 AC4: touching after 1ms
   ✓ T02 AC1: starts now 0ms
   ✓ T03 AC1: zero duration 0ms
   ✓ T04 AC1: reversed 0ms
   ✓ T05 AC1: past day end 0ms
   ✓ T06 AC2: exactly 120 minutes 0ms
   ✓ T07 AC2: 121 minutes 0ms
   ✓ T08 AC4: touching before 0ms
   ✓ T09 AC4: partial overlap 0ms
   ✓ T10 AC4: contains booking 0ms
   ✓ T11 AC4: inside booking 0ms
   ✓ T12 AC4: identical interval 0ms
   × T13 AC3: blocked room 5ms
     → expected true to be false // Object.is equality
   ✓ T14 AC4: empty bookings 0ms
   ✓ X1 AC1: exact day end 0ms
   ✓ X2 AC4: touches two bookings 0ms
   ✓ AC5: available request preserves bookings 0ms
   ✓ AC5: rejection preserves bookings 0ms
   ✓ AC1: negative start is invalid even before the supplied time 0ms

 Test Files  1 failed (1)
      Tests  1 failed | 18 passed (19)
   Start at  22:44:46
   Duration  426ms (transform 48ms, setup 0ms, collect 90ms, tests 8ms, environment 0ms, prepare 136ms)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T13 AC3: blocked room
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:66:80
     64| test('T13 AC3: blocked room', () => {
     65|   const bookings = [{ start: 600, end: 660 }];
     66|   expect(canBook({ start: 660, end: 720, now: 540, blocked: true, book…
       |                                                                                ^
     67| });
     68| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Available shown; Existing bookings still lists 10:00-11:00. evidence/ui-1.jpg | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | Unavailable replaces Available; booking remains 10:00-11:00. evidence/ui-2.jpg | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Clearing the Start hour with Backspace and submitting shows: Fill in the current time, the start and the end. Previous decision disappears. evidence/ui-3.jpg | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | Single-column controls, button, Available result, and existing booking fit within the portrait viewport. evidence/ui-4.jpg | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Repeated available and blocked checks retain 10:00-11:00. An additional end-at-24:00 check returns Unavailable for excessive duration, still with the same booking. evidence/ui-5.jpg | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All 33 checker checks pass after completing browser screenshots |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 19 / 19 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1-AC5; AC6 is separate from the unit suite | AC1-AC5 with extra lower-bound and rejection-preservation coverage; AC6 checked separately in Browser |
| Selected mutants detected | Not experimentally run on first suite | 3 of 3, assertion failures |
| Accepted / revised / rejected tests | 17 retained; no incorrect expectations | 17 retained, 2 additional tests; 3 review decisions |
| Remaining limitations | Malformed bookings unspecified; browser checks not part of unit suite | Same policy gap; five browser checks pass, but no exhaustive or property-based coverage |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

- The actual supplementary Node call returned true for request 660-720 and bookings=[{start:700,end:650}], now=540 and blocked=false. The overlap predicate is false because 660 < 650 is false. No AC defines validation of existing bookings. I preserve the starter behavior and declare returns-true, rather than silently adding a policy. Production code should specify whether malformed data is rejected or filtered and test that policy. See evidence/node-checks.txt.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->

The first suite contained no incorrect expected decision in the reviewed cases. Its weakness was narrower evidence: data preservation was checked only after an available request, and the negative start boundary was not isolated. I found these gaps by comparing each assertion with the criteria rather than treating a green run as proof of completeness. The improved suite adds checks for rejected-request preservation and a negative start with an earlier supplied current time.

The final green run establishes that the extracted function satisfies nineteen concrete assertions with fixed inputs. Mutation trials add evidence that the suite distinguishes exactly 120 minutes from longer requests, allows touching endpoints, and enforces blocking. They do not prove every possible defect is detectable. Separate Browser checks confirmed understandable missing-input feedback, usable controls at 375 pixels, and unchanged displayed bookings after repeated decisions. Another limitation is malformed existing bookings: their required handling is unspecified, and the current function accepts the examined reversed-booking case.
