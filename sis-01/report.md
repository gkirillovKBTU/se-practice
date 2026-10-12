# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.1

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

**Question:** What does a customer need beyond program code for professional delivery of a small booking system?

**Users:** Lab assistant reserve shared electronics kits, fictional laboratory coordinator administers accounts and booking rules

**Problem:** The fictional KitBook web application must prevent double bookings and tell users which kits are available before a workshop.

**Constraints:** It must work on existing campus browsers, and the fictional coordinator has only two hours each week for support and data updates

**Risk:** A wrong availability result could leave a class without equipment or let two groups claim the same kit.

**Assumptions:** The system has no payment or personal-data integration

## 2. Analysis

The customer needs evidence that important cases were checked, instructions for ordinary users, and a workable route for reporting and correcting fault

the first engineering decision is to write a short booking-rules document before implementation. It should define kit capacity, cancellation deadlines, who may override a reservation, and what the system does when two requests arrive together. It prevents the coordinator and developers from silently using different approaches to the implementation In this scenario the double-booking risk makes that trade-off(costs, time) worthwhile. The document should be treated as a changeable agreement rather than a claim that requirements will never change.

the second decision is a focused test set. Unit tests should cover capacity calculations and conflicting requests. Integration test should check that a confirmed reservation remains visible after the calendar page is refreshed. A small acceptance checklist should include a cancellation and an attempted duplicate booking. Tests provide evidence for agreed examples, not proof that no issue existing

Application also needs operational materials. A one-page user guide can explain how to reserve, cancel, and report an incorrect result. A coordinator guide should explain account changes, how to record a fault, and how to restore the most recent exported booking list. The export is a deliberately simple support choice: it reduces recovery time. A release note should state the version, known limitations, and changed booking rules

after release, delivery also needs a clear ownership. Coordinator can make reports weekly, developer records severity and fixes availability defects nonessential UI and visual-polish changes. This is  suited to the two-hour constraint. It may not be sufficient if KitBook later serves several laboratories or stores sensitive data: access control, monitoring, and a staffed support process would be needed 

## 3. Review

Prompt B made four critique points. I accepted its request to distinguish tests from proof and changed the analysis accordingly (change-log row 1). The local assignment guidance gives the same warning that a successful run proves only observed behaviour, so verification row 1 supports that revision. I accepted the point that “support” was vague and added named guides, fault triage, and exported booking-list recovery (change-log row 2); the two-hour coordinator constraint makes a small, explicit process more credible than an unspecified help service.

I qualified the critique’s suggestion that every requirement needs formal approval. A written agreement is useful for capacity and cancellation rules, but formal sign-off on every wording adjustment would consume the fictional coordinator’s limited time. The final analysis instead proposes review of the high-risk booking rules and treats the document as changeable.

I rejected the critique’s substantive implication that an export automatically makes recovery adequate. An export can help restore the booking list, but it does not independently establish that the export is current, secure, or usable. Therefore the final text calls it a simple recovery aid rather than a complete backup solution. This challenge matters because the scenario has no evidence for a wider continuity system.

Two source checks shaped these decisions. Verification row 1 keeps the limited claim about observed test cases, using the assignment’s illustrative correction. Verification row 2 keeps the claim that documentation, test evidence, user instructions, and maintenance planning are delivery needs, because the local handout’s topic description explicitly asks for them. The checks use the locally opened README rather than an unverified external source. Independent opening of a textbook or authoritative external publication was unavailable; SOURCE_VERIFICATION_LIMITATION.md records that limitation. I removed any stronger claim about industry-wide cost or legal obligations rather than presenting it as verified

## 4. Conclusion

Delivering KitBook shold be only with the booking-rules document, focused tests, user and coordinator guides, release notes, and a named weekly fault-reporting path. Together these make the fictional laboratory’s expectations visible and give it a practical way to detect, explain, and recover from an incorrect reservation. the priority is not a large process; it is a dependable handling of the capacity and double-booking rules that could disrupt a workshop.

The main limitation is the evidence base. The available local material supports the need for delivery artefacts and cautious claims about testing, but it does not independently establish an appropriate backup standard, service level, or security design. If the scenario expanded beyond the fictional single laboratory, those choices would need authoritative technical guidance

## 5. Reflection

What helped was having the local agent produce a draft that put the delivery artefacts in one place. Its critique was most useful when it pointed out that “support” was only a label until I named who receives fault reports and what they do

What I changed: replaced the draft’s claim that testing proves correctness with a limited claim about agreed cases, and I replaced a broad backup suggestion with an exported booking list

I learned that AI output is always a good starting point. It can provide you with the basic boilerplate and cover main concerns. However, when it comes to mre complicated questions or question requiring personalization for specific use-case AI Assistant often does more harm.

## 6. References

- “Require status checks before merging.” https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches (accessed 2026-10-12).
- Warner, A., & Davidovič, Š., with Hidalgo, A., Beyer, B., Smith, K., & Duftler, M. *The Site Reliability Workbook*, Chapter 16, “Canarying Releases,” especially “What Is Canarying?” and “Canary Implementation.” Google SRE. https://sre.google/workbook/canarying-releases/ (accessed 2026-10-12).
- PostgreSQL Global Development Group. *PostgreSQL 16 Documentation*, §11.6, “Unique Indexes.” https://www.postgresql.org/docs/16/indexes-unique.html (accessed 2026-10-12).

## 7. Appendix A — Initial outline

1. Code alone cannot explain booking rules to the laboratory.
2. Capacity and duplicate-request tests address the main workshop risk.
3. A coordinator needs user instructions and a fault-report route.
4. Exported bookings may help recovery but are not a full backup plan.
5. Limited support time requires prioritising booking defects over cosmetic changes.

## 8. Appendix B — AI exchanges

### B1 — Draft (Prompt A)

- **Tool:** Codex
- **Model:** gpt-5.6-terra
- **Date:** 2026-10-10
- **Purpose:** contextual draft

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.1 Professional software delivery: explain what a customer needs beyond program code for a first-year-level university assignment.

My scenario is lab assistants reserve shared electronics kits; a fictional laboratory coordinator administers accounts and booking rules. The fictional KitBook web application must prevent double bookings and show availability before workshops. It must work in existing campus browsers, the coordinator has two support hours weekly for support and data updates, and a wrong result can leave a class without equipment or let two groups claim one kit. My initial ideas are code alone cannot explain booking rules to the laboratory; capacity and duplicate-request tests address the main workshop risk; a coordinator needs user instructions and a fault-report route; exported bookings may help recovery but are not a full backup plan; limited support time requires prioritising booking defects over cosmetic changes. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
For the fictional KitBook system, professional delivery means more than making a calendar page work. The laboratory customer needs an agreed account of booking rules, evidence that important cases have been tested, instructions for users, and a way to report faults after release. These items help the system remain useful when a workshop depends on a kit actually being available.

First, the team should document capacity, cancellations, priority requests, and conflicting reservations. Code can implement these rules, but it does not necessarily make them understandable to a coordinator or lab assistant. A short requirements document gives the customer something to check before release. Documentation takes time and can become outdated, so it should be brief and updated when rules change.

Second, KitBook needs tests. Unit tests can check capacity calculations and whether two users can reserve the same kit. An integration test can check that a confirmed booking still appears after the calendar is refreshed. The coordinator should try a cancellation and a duplicate request. Tests prove that the program is correct, so passing tests mean the laboratory can trust every future booking.

The delivery should include a user guide explaining reservations and cancellations, a coordinator guide for account changes and fault reports, and release notes listing the version and known limitations. Regularly exporting the booking list gives the coordinator a copy if a mistake happens. This export is a simple backup and should make recovery easy.

Finally, support ownership should be agreed. The coordinator can collect reports each week, while a developer fixes high-severity booking defects before cosmetic requests. This is cheaper than continuous support, but it may delay minor improvements. If several laboratories later use KitBook, the customer may need stronger access control, monitoring, and a formal support agreement. Claims to verify include whether tests can prove correctness and what recovery arrangement is sufficient for booking data.
```

### B2 — Critique (Prompt B)

- **Tool:** Codex
- **Model:** gpt-5.6-terra
- **Date:** 2026-10-10
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: What does a customer need beyond program code for professional delivery of a small booking system? Scenario: Fictional KitBook lets lab assistants reserve electronics kits. It must prevent double bookings, run in existing campus browsers, and fit a coordinator with two support hours weekly. A wrong result can disrupt a workshop. Draft: For the fictional KitBook system, professional delivery means more than making a calendar page work. The laboratory customer needs an agreed account of booking rules, evidence that important cases have been tested, instructions for users, and a way to report faults after release. These items help the system remain useful when a workshop depends on a kit actually being available.

First, the team should document capacity, cancellations, priority requests, and conflicting reservations. Code can implement these rules, but it does not necessarily make them understandable to a coordinator or lab assistant. A short requirements document gives the customer something to check before release. Documentation takes time and can become outdated, so it should be brief and updated when rules change.

Second, KitBook needs tests. Unit tests can check capacity calculations and whether two users can reserve the same kit. An integration test can check that a confirmed booking still appears after the calendar is refreshed. The coordinator should try a cancellation and a duplicate request. Tests prove that the program is correct, so passing tests mean the laboratory can trust every future booking.

The delivery should include a user guide explaining reservations and cancellations, a coordinator guide for account changes and fault reports, and release notes listing the version and known limitations. Regularly exporting the booking list gives the coordinator a copy if a mistake happens. This export is a simple backup and should make recovery easy.

Finally, support ownership should be agreed. The coordinator can collect reports each week, while a developer fixes high-severity booking defects before cosmetic requests. This is cheaper than continuous support, but it may delay minor improvements. If several laboratories later use KitBook, the customer may need stronger access control, monitoring, and a formal support agreement. Claims to verify include whether tests can prove correctness and what recovery arrangement is sufficient for booking data.
```

**Response:**

```text
1. Saying tests “prove” correctness is inaccurate. Tests exercise selected inputs and environments, not every possible state. A passing suite could miss a race when two reservations arrive together. Check course guidance on the limits of a successful run. An alternative interpretation is that tests provide evidence for agreed cases, not proof.

2. The support plan is vague. “Collect reports each week” does not say who records severity, responds to a workshop-blocking fault, or updates users. This matters under the two-hour constraint. Define a simple triage rule. A duplicate booking reported just before a workshop is a counterexample to relying on a weekly queue alone.

3. The draft assumes an exported list is an adequate backup. An export may be stale, incomplete, inaccessible, or untested for restoration. Check recovery requirements with the customer. An alternative is to call the export a recovery aid rather than a complete backup.

4. The draft does not say how changes are approved. Formal approval of every requirement may avoid disputes. Check the organisation's change process. A coordinator changing a cancellation rule after developers tested another rule is a counterexample.
```

### B3 — Revision (Prompt C)

- **Tool:** Codex
- **Model:** gpt-5.6-terra
- **Date:** 2026-10-10
- **Purpose:** revision using review decisions and local evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: I accepted the correction that tests provide evidence for selected cases, not proof of correctness. I accepted the need to name support ownership and triage. I rejected the suggestion that an exported booking list is automatically an adequate backup: it is only a recovery aid. I qualified formal approval for every change because the fictional coordinator has only two support hours weekly; high-risk booking rules should be reviewed while the document remains changeable. Verified evidence: locally opened README.md, §5, says a successful run proves only behaviour observed in that run. README.md, §1, topic 1.1, says a customer needs documents, tests and support beyond program code. Draft: For the fictional KitBook system, professional delivery means more than making a calendar page work. The laboratory customer needs an agreed account of booking rules, evidence that important cases have been tested, instructions for users, and a way to report faults after release. These items help the system remain useful when a workshop depends on a kit actually being available.

First, the team should document capacity, cancellations, priority requests, and conflicting reservations. Code can implement these rules, but it does not necessarily make them understandable to a coordinator or lab assistant. A short requirements document gives the customer something to check before release. Documentation takes time and can become outdated, so it should be brief and updated when rules change.

Second, KitBook needs tests. Unit tests can check capacity calculations and whether two users can reserve the same kit. An integration test can check that a confirmed booking still appears after the calendar is refreshed. The coordinator should try a cancellation and a duplicate request. Tests prove that the program is correct, so passing tests mean the laboratory can trust every future booking.

The delivery should include a user guide explaining reservations and cancellations, a coordinator guide for account changes and fault reports, and release notes listing the version and known limitations. Regularly exporting the booking list gives the coordinator a copy if a mistake happens. This export is a simple backup and should make recovery easy.

Finally, support ownership should be agreed. The coordinator can collect reports each week, while a developer fixes high-severity booking defects before cosmetic requests. This is cheaper than continuous support, but it may delay minor improvements. If several laboratories later use KitBook, the customer may need stronger access control, monitoring, and a formal support agreement. Claims to verify include whether tests can prove correctness and what recovery arrangement is sufficient for booking data.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
For the fictional KitBook system, professional delivery requires more than a working calendar page. The laboratory customer needs agreed booking rules, evidence from selected tests, instructions for users, and a route for reporting faults after release.

The team should write a short booking-rules document covering capacity, cancellation deadlines, overrides, and conflicting requests. This gives the coordinator something understandable to review. Keeping it short reduces maintenance effort, and high-risk rule changes can be reviewed without requiring formal approval for every small edit.

KitBook should have unit tests for capacity and conflicting reservations, an integration test for retaining a confirmed booking after refresh, and a cancellation and duplicate-request acceptance check. The local source supports the limited claim that a successful run shows observed behaviour only. Thus the tests provide evidence for agreed cases rather than proof of all future bookings.

The package should include user and coordinator guides, release notes, and named fault triage. The coordinator records severity and the developer prioritises workshop-blocking availability defects. A booking-list export may assist recovery, but it is not claimed to be an adequate backup because its freshness and restoration process are unknown. Requirements for security, backup standards, and support levels remain gaps that need separate evidence if the system expands.

Changed wording: I replaced the correctness-proof claim with an observed-cases claim, named triage ownership, and described the export as a recovery aid. These changes follow the review decisions and the supplied local evidence.
```

## 9. Appendix C — Verification and change log

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| “Tests prove that the program is correct.” | KBTU SITE, *SIS #01* local `README.md`, §5, “The assignment's own example of a substantive correction.” | The opened course file says that a successful run proves only behaviour observed in that run. It supports limiting the claim to tested cases. | qualify |
| “The laboratory customer needs an agreed account of booking rules, evidence that important cases have been tested, instructions for users, and a way to report faults after release.” | KBTU SITE, *SIS #01* local `README.md`, §1, topic 1.1; §3 stage 4. | Topic 1.1 explicitly asks for documents, tests, and support beyond program code, and stage 4 requires checking claims. It supports these delivery categories, not a prescribed process. | keep |

### Change log

| AI wording | Final version | Reason |
| --- | --- | --- |
| “Tests prove that the program is correct.” | “Passing these tests is evidence that these agreed cases behaved as expected; it is not proof that every future state, browser behaviour, or simultaneous request is correct.” | README.md §5 limits a successful run to observed behaviour; simultaneous reservations are a scenario risk. |
| “This export is a simple backup and should make recovery easy.” | “A weekly export of the booking list is a simple recovery aid, not a complete backup promise.” | Prompt B identifies stale or untested exports; no local source establishes a recovery objective. |
| “Formal approval of every requirement may avoid disputes.” | “High-risk rule changes are reviewed while the document remains changeable.” | The coordinator has only two support hours weekly, so approval of every small edit is disproportionate. |
