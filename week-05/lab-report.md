# Week 05 — Lab report

**Name:** Kirillov Grigoriy
**Group:** Monday 16:00-19:00
**Date:** 11.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Codex |
| **Exact** model name | gpt-5.6-terra |
| Language and version | Python 3.12 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
1. Check AC1 first: require 0 <= start < end <= 1440 and start > now; return False when it does not hold.
2. Check AC2: reject a request when end - start is greater than 120 minutes.
3. Check AC3: reject the request when blocked is True.
4. Check AC4 against every tuple in existing. The request overlaps an existing interval when start < existing_end and end > existing_start; return False on any overlap.
5. Return True only after all preceding checks pass, as required by AC5.

Assumptions: times are integer minutes; now is valid; blocked is Boolean; and existing contains valid active-booking tuples, as stated in the contract. Existing is only read and is not sorted, changed, saved, or confirmed.

Boundary cases: start equal to now; start one minute after now; zero-length and reversed intervals; start at 0; end exactly at 1440 and after 1440; duration exactly 120 and 121 minutes; a blocked otherwise-valid request; overlap at either side, containment in either direction, and an identical interval; touching at either endpoint; an empty list and an unsorted list with several bookings; and checking that existing remains unchanged.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Checked steps 1–5 and the stated assumptions against AC1–AC5 and the contract. | AC1 gives the time order, bounds, and future start; AC2 the duration; AC3 the blocked-room rule; AC4 overlap and touching; AC5 the Boolean result and unchanged inputs. The assumptions only repeat contract guarantees. | Found no invented or changed rule, so I kept the plan. |

**Boundary cases the assistant suggested that I kept as tests:**

120 versus 121 minutes; both touching directions; overlap relationships; empty and multiple bookings; and unchanged `existing`.

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not 0 <= start < end <= 1440 or start <= now:` | AC1 | Correct: it rejects out-of-bound or unordered intervals, plus starts that are not in the future. |
| 2 | `if end - start > 120 or blocked:` | AC2 | Correct: a duration of exactly 120 is still allowed. |
| 3 | `if end - start > 120 or blocked:` | AC3 | Correct for the Boolean input guaranteed by the contract. |
| 4 | `if start < existing_end and end > existing_start:` | AC4 | Correct: strict comparisons reject intersections and allow endpoint touching. |
| 5 | `return True` | AC5 | Correct: execution reaches it only after every earlier check passes. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- None

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `test_touching_end_is_allowed` | `(660, 720)` | None | True | AC4 | Pass | Pass |
| 2 | `test_overlap_is_rejected` | `(630, 690)` | None | False | AC4 | Pass | Pass |
| 3 | `test_blocked_room_is_rejected` | `(660, 720)` | `blocked=True` | False | AC3 | Pass | Pass |
| 4 | `test_exactly_two_hours_is_allowed` | `(720, 840)` | None | True | AC2 | Pass | Pass |
| 5 | `test_over_two_hours_is_rejected` | `(720, 841)` | None | False | AC2 | Pass | Pass |
| 6 | `test_starting_now_is_rejected` | `(540, 570)` | None | False | AC1 | Pass | Pass |
| 7 | `test_starting_one_minute_after_now_is_allowed` | `(541, 571)` | `existing=[]` | True | AC1 | Pass | Pass |
| 8 | `test_past_request_is_rejected` | `(500, 530)` | None | False | AC1 | Pass | Pass |
| 9 | `test_zero_length_is_rejected` | `(700, 700)` | None | False | AC1 | Pass | Pass |
| 10 | `test_reversed_times_are_rejected` | `(720, 700)` | None | False | AC1 | Pass | Pass |
| 11 | `test_end_at_day_bound_is_allowed` | `(1320, 1440)` | None | True | AC1 | Pass | Pass |
| 12 | `test_end_after_day_bound_is_rejected` | `(1380, 1441)` | None | False | AC1 | Pass | Pass |
| 13 | `test_empty_existing_allows_valid_request` | `(600, 660)` | `existing=[]` | True | AC4 | Pass | Pass |
| 14 | `test_overlap_with_later_existing_booking_is_rejected` | `(720, 780)` | two existing bookings | False | AC4 | Pass | Pass |
| 15 | `test_existing_list_is_unchanged` | `(780, 840)` | unsorted three-item list | True; list unchanged | AC5 | Pass | Pass |
| 16 | `test_inside_existing_booking_is_rejected` | `(615, 645)` | None | False | AC4 | Pass | Pass |
| 17 | `test_containing_existing_booking_is_rejected` | `(570, 690)` | None | False | AC4 | Pass | Pass |
| 18 | `test_touching_start_is_allowed` | `(570, 600)` | None | True | AC4 | Pass | Pass |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(541, 571, now=540, blocked=False, existing=[])` | True | True | No defect: `if not 0 <= start < end <= 1440 or start <= now:` permits this AC1 boundary. | No change needed. | Not applicable |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
1. Potential issue: `if not 0 <= start < end <= 1440 or start <= now:` does not explicitly reject non-integer `start` or `end`; this concerns the contract sentence that times are integer minutes.
2. Potential issue: `if end - start > 120 or blocked:` accepts any truthy or falsy object rather than checking a Boolean; this concerns the contract sentence that `blocked` is a Boolean.
3. Potential issue: `for existing_start, existing_end in existing:` assumes valid unpackable booking tuples; this concerns the contract sentence that `existing` contains valid `(start, end)` tuples.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Add explicit integer validation. | reject | The contract declares integer times and does not set behavior outside that precondition. | No change; 18 tests green. |
| 2 | Validate `blocked` as an exact Boolean. | reject | The contract guarantees that `blocked` is Boolean; AC3 is met for valid inputs. | No change; 18 tests green. |
| 3 | Validate entries before unpacking in the `for` line. | reject | The contract guarantees valid tuples in `existing`; AC4 only asks that those bookings are checked. | No change; 18 tests green. |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | No change; `code/booking.py` is identical to v1 | v1 passed the suite and F1–F10 | F1–F10 passed |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_containing_existing_booking_is_rejected (test_booking.BookingTests.test_containing_existing_booking_is_rejected) ... ok
test_empty_existing_allows_valid_request (test_booking.BookingTests.test_empty_existing_allows_valid_request) ... ok
test_end_after_day_bound_is_rejected (test_booking.BookingTests.test_end_after_day_bound_is_rejected) ... ok
test_end_at_day_bound_is_allowed (test_booking.BookingTests.test_end_at_day_bound_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_list_is_unchanged (test_booking.BookingTests.test_existing_list_is_unchanged) ... ok
test_inside_existing_booking_is_rejected (test_booking.BookingTests.test_inside_existing_booking_is_rejected) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_overlap_with_later_existing_booking_is_rejected (test_booking.BookingTests.test_overlap_with_later_existing_booking_is_rejected) ... ok
test_past_request_is_rejected (test_booking.BookingTests.test_past_request_is_rejected) ... ok
test_reversed_times_are_rejected (test_booking.BookingTests.test_reversed_times_are_rejected) ... ok
test_starting_now_is_rejected (test_booking.BookingTests.test_starting_now_is_rejected) ... ok
test_starting_one_minute_after_now_is_allowed (test_booking.BookingTests.test_starting_one_minute_after_now_is_allowed) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 18 tests in 0.000s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (9 lines)
PASS   S1   your suite has at least 11 tests            18 tests
PASS   S2   your suite is green on your own code        18 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starting_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_day_bound_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_end_at_day_bound_is_allowed, test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_overlap_with_later_existing_booking_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_containing_existing_booking_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_list_is_unchanged
PASS   M10  your tests catch a fault in AC5             caught by test_existing_list_is_unchanged
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              5 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  18 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 3 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      168 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | No FAIL or ERROR remained in the final checker run. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- Non-integer times are not handled. Floats take part in Python comparisons(contract assumed integer as only inputs), while a string comparison raises `TypeError`

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- The lower bound `0 <= start` cannot be the only reason: valid `now` is non-negative

---

## 10. Conclusion (120–180 words)

The final overlap check is `start < existing_end and end > existing_start`. the request starts before the booking ends, and it ends after the booking starts. Strict comparisons make contact safe, so interval ending at 600 or starting at 660 does not overlap `(600, 660)`. The upper day bound was the fault my tests missed longest. My first out-of-range case, `(1320, 1441)`, was also over 120 minutes, so it could not isolate AC1. Changing it to `(1380, 1441)` kept the duration valid and caught the missing bound by itself. Original version passed every observed contract test, so no code change was justified. I had to decide how to handle non-integer Python values because the contract only promises integers
