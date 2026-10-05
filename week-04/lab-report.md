# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Kirillov Grigoriy |
| Group | Monday 16:00-19:00 |
| AI assistant | Codex |
| Exact model | gpt-5.6-terra |
| Renderer | Kroki PlantUML renderer |
| Behaviour diagram | sequence |
| Stories used | the reference set from README §3 |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** Touching bookings do not overlap. Blocking keeps existing bookings.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `Student → Review usage` | The original linked Student to an administrator-only goal. | US-06 | Removed the association. |
| 2 | `Student → Send confirmation` | Confirmation is an outcome, not a goal initiated by Student. | R4; US-01 | Removed the actor association |
| 3 | `Book room .> Produce confirmation` | needed an explicit relationship justification. | R4 | Added the directly preceding why comment. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one student makes 0..* bookings | each booking belongs to exactly 1 student | 1 / 0..* |
| Room — Booking | one room hosts 0..* bookings | each booking is for exactly 1 room | 1 / 0..* |
| Booking — Confirmation | one booking produces exactly 1 confirmation | each confirmation belongs to exactly 1 booking | 1 / 1 |

### 4.2 Constraints the multiplicities cannot show

- R2: the note to the right of `Booking` states that active bookings for the same room must not overlap; it also states that touching time ranges do not overlap.
- R1 and R3: notes on `Booking` and `Room` state the time range and blocked-room constraints.

### 4.3 Assumptions

- A1: Touching bookings are allowed: an end at 12:00 and a start at 12:00 do not overlap.
- A2: Blocking a room prevents new bookings only; existing bookings remain active.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `Student "1" *-- "1..*" Booking` | Composition incorrectly made bookings unable to exist independently and `1..*` said every student must already have a booking. | US-01 and US-03 allow a student to have no bookings; Task 2 says avoid unjustified composition. | Replaced it with `Student "1" -- "0..*" Booking`. |
| 2 | `Booking "1" -- "0..1" Confirmation` | A successful booking must produce a confirmation, so optional confirmation contradicted R4. | R4; US-01 | Changed the Confirmation end to `1` and stated R4 in a note. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence, because it shows main processes: request, validation, repository calls, and replies.

**Design components added beyond the domain model:** `BookingService` validates R1–R3 and coordinates reservation; `BookingRepository` retrieves room and active-booking data and persists a booking only after success.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `alt success / else unavailable` | The original success branch did not identify R1, R3, or R2 validation | R1–R3; US-01 | Added labelled time-range, blocked-room, and overlap checks before the guarded creation branch. |
| 2 | `BookingService --> Student: confirmation` | The original reply was not tied to a persisted booking identifier. | R4; US-01 | Returned `bookingCreated(bookingId)` and then `confirmation(bookingId)` only in the creation branch. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1| The nested alternatives did not have a branch explicitly named `created`. | inner `alt` | reject | The revised guard is `no overlap (created)`, which identifies both the R2 condition and the creation result; the corresponding else is `overlap (unavailable)`. |
| 2 | The class diagram should contain `BookingService` and `BookingRepository` because the sequence uses them. | `BookingService`, `BookingRepository` | reject | They are design components used only in the sequence. Task 2 requires domain concepts only, and §5 explains their responsibilities. |
| 3 | R2 should be expressed with a Room-to-Booking multiplicity. | `Room — Booking` | reject | `0..*` states how many bookings a room can have, not whether their active time ranges overlap. R2 is correctly stated in the note on `Booking`. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | `Booking.startTime`, `Booking.endTime`, and the R1 note | `validateTimeRange(startTime, endTime) (R1)` and `invalid time range` guard |
| R2 | Book room | `Booking.status`, Room — Booking association, and the R2 note | `findActiveBookings(...)`, `checkNoOverlap(...) (R2)`, and `overlap (unavailable)` guard |
| R3 | Book room | `Room.blocked` and the R3 note | `findRoom(...)`, `checkRoomNotBlocked(room) (R3)`, and `room blocked` guard |
| R4 | Produce confirmation | `Booking` — `Confirmation` association and R4 note | `confirmation(bookingId)` in the `no overlap (created)` branch |
| US-01 | Book room | `Student`, `Room`, `Booking`, `Confirmation` | `requestBooking(...)` through `confirmation(bookingId)` |
| US-02 | View availability | `Room`, `Booking.status`, and Room — Booking association | `findActiveBookings(...)` supplies active booking data for an availability decision |
| US-03 | Cancel booking | `Student.cancel(booking)`, `Booking.cancel()`, and `Booking.status` | not part of the Book room sequence |
| US-04; US-05 | Block or unblock room | `Room.block()`, `Room.unblock()`, and `Room.blocked` | `checkRoomNotBlocked(room) (R3)` observes the blocked state |
| US-06 | Review usage | `Room` and its Booking association provide booking history | not part of the Book room sequence |
| US-01 | Produce confirmation | `Booking` — `Confirmation` association | `confirmation(bookingId)` |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Student was associated with `Review usage` and `Send confirmation`. | Only Administrator reviews usage; no actor is associated with confirmation. | usage review to administrators, and R4 makes confirmation a booking outcome. |
| 2 | class | Added `User` inheritance and composition from Student to mandatory bookings. | Used direct Student — Booking association with `1` and `0..*` multiplicities. | No requirement justifies inheritance or composition; US-01 and US-03 allow zero bookings. |
| 3 | sequence | Saved a booking immediately before the `alt` block. | Validated R1, R3, and R2 before `createBooking(...)` in the `no overlap (created)` branch. | R1–R3 require rejection without persistence; R4 confirms only after success. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus study room booking system"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (6 branches)
SQ3  PASS  validation happens before creation
SQ4  FAIL  a failure branch still creates/saves: createBooking(studentId, roomId, startTime, endTime); bookingCreated(bookingId)
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  3 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  2 behaviour-diagram findings in §5
LR6  PASS  3 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=36 fail=1 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** SQ4 to preserve original failure of the revision

---

## 10. Conclusion (120–180 words)

The original class diagram had the most serious defects. `Student "1" *-- "1..*" Booking` claimed that every student already owns at least one booking and that a booking cannot outlive the student as an independent record. It also used composition without a lifecycle requirement. The original Room association made every room have one or more bookings, contradicting US-02 because a room can be free. If these claims reached code, creation of a new student or room could be coupled to creating a booking, and cancellation history could be deleted with the student. The original sequence was also unsafe: it saved before testing the future-time, blocked-room, and overlap rules. The separate local critique found that `Booking — Confirmation` was optional, which contradicted R4, so I changed it to one confirmation per successful booking. I rejected the critique claims that services belong in the domain model and that R2 is a multiplicity.
