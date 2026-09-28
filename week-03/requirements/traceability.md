# Traceability — use cases → stories → criteria

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | AC-01, AC-02, AC-03 | none |
| UC-02 Book room | US-02 | AC-04, AC-05, AC-06, AC-07, AC-08 | none |
| UC-03 Cancel booking | US-03 | none | no acceptance criteria |
| UC-04 Block or unblock room | US-04, US-07 | AC-09, AC-10, AC-11 | none |
| UC-05 Review usage | US-05 | none | no acceptance criteria |
| UC-06 Send confirmation | US-06 | AC-04 | no acceptance criteria |

**Stories that belong to no use case:** none

**What the gaps tell you:**  cancellation and usage review still need testable criteria: UC-06 is only partially tested: because AC-04 covers booking confirmation, not cancellation confirmation.
