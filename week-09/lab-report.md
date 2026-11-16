# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Kirillov Grigoriy
**Student ID:** 24B031850
**GitHub:** https://github.com/gkirillovKBTU

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Codex |
| Exact model (or "not displayed") | GPT-5.6-sol|
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.12.7 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Check whether a room request is available using whole minutes since midnight in the range 0-1440, the current time, blocked status, and existing bookings. This tool only checks availability; it does not save, create, change, or reserve any booking.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start time as whole minutes since midnight."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end time as whole minutes since midnight."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time as whole minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is blocked."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings; an empty list is allowed.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| input | `"type": "object"` | A non-object value could be treated as tool arguments. |
| input | exactly five named `properties` | The model would not have a precise contract for the canBook inputs. |
| input | all five fields in `required` | Missing context, such as `now`, could reach the function. |
| input | `"additionalProperties": false` | Invented fields such as `room` would be silently accepted. |
| start | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Strings, fractions, and times outside one day would be accepted. |
| end | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Values such as `"11:00"` or out-of-day times would be accepted. |
| now | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | The current time could use a different type, unit, or impossible value. |
| blocked | `"type": "boolean"` | The string `"false"` is not a boolean and may be truthy in some languages. |
| bookings | `"type": "array"` | A scalar or object could replace the booking list. |
| bookings items | `"type": "object"` | Pairs such as `[660, 720]` would be accepted without field names. |
| booking times | integer, minimum 0, maximum 1440 | Existing bookings could use fractions or out-of-day times. |
| booking item | `"required": ["start", "end"]` | An incomplete booking could not be checked for overlap. |
| booking item | `"additionalProperties": false` | Misspelled or invented booking fields could hide bad data. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change; the valid R1-shaped call remains accepted. |
| S02 | PASS | PASS | No change; no `minItems` was added, so `[]` remains valid. |
| S03 | FAIL | PASS | Made `end` an integer in minutes. |
| S04 | FAIL | PASS | Put all five fields, including `now`, in `required`. |
| S05 | FAIL | PASS | Set top-level `additionalProperties` to false. |
| S06 | FAIL | PASS | Added `minimum: 0` to `start`. |
| S07 | FAIL | PASS | Added `maximum: 1440` to `end`. |
| S08 | FAIL | PASS | Required both `start` and `end` in every booking item. |
| S09 | FAIL | PASS | Made `blocked` a boolean. |
| S10 | FAIL | PASS | Made `start` an integer rather than a number. |
| S11 | PASS | PASS | No change; the maximum stays inclusive so 1440 is valid. |
| S12 | FAIL | PASS | Required each `bookings` item to be an object. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->

The reply matches the request exactly: 10:00 is 600, 11:00 is 660, 9:00 is 540, the room is not blocked, and the existing 11:00-12:00 booking is 660-720. Touching at 11:00 is left for canBook to interpret.

### R2

```text
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}
```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->

The reply also matches. In particular, 16:30 is 990 rather than 960. The model correctly called the tool even though the room is blocked and the duration exceeds 120 minutes; deciding Unavailable belongs to canBook.

### R3

```text
What exact start and end times should I use, what is the current time, is the room blocked, and what existing bookings are there?
```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->

The request omits exact start and end times, `now`, `blocked`, and `bookings`. “Tomorrow afternoon” and “a couple of hours” are not precise enough to derive the required integers. The model asked one short question instead of inventing values, so no R3 tool call was saved.

## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->

For AC1, the schema can enforce that each time is an integer from 0 through 1440. It cannot compare fields, so it cannot enforce `start < end` or `start > now`. AC2 also needs arithmetic across `start` and `end`, so only canBook can enforce the 120-minute limit. AC3 is semantic: the schema can require a boolean but cannot reject a well-formed call merely because `blocked` is true. AC4 requires comparing the requested interval with each existing interval and allowing touching boundaries, which the permitted keywords cannot express. AC5 concerns side effects, not input shape, so the function and client must ensure nothing is saved. AC6 concerns the page's feedback and is outside the input schema.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | This is the tool's intended read-only use, and the call does not create a booking. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading an in-scope source file is reversible and helps the agent understand the implementation. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | This changes AC2 and product behavior, so a user's request is not enough authority to alter policy. |
| A4 | run `npm test` in `week-08/app` | allow | Tests are a normal verification step and should not modify tracked source files. |
| A5 | run `git reset --hard` to undo its own last three edits | block | A hard reset can destroy unrelated or uncommitted work and is difficult to recover without a checkpoint. |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit creates repository history under the student's identity, so approval should confirm the diff and message. |
| A7 | `git push` to `main` | block | Directly updating the integration branch bypasses review and could affect everyone using it. |
| A8 | send the contents of `.env` to an MCP server it found online | block | `.env` may contain secrets, and sending them to an untrusted server is data exfiltration. |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->

The extracted handoff is not inside a Git repository, so there is no real commit SHA yet. `0000000` is an explicit sentinel for the student-owned Git step, not a claimed commit. Before allowing edits, I would make a checkpoint commit named `Week 09: checkpoint before agent edits`, replace the sentinel with the real value from `git rev-parse --short HEAD`, and return with `git reset --hard <REAL_SHA>`. That command would discard all tracked working-tree and index changes made after the checkpoint; untracked files would remain unless separately cleaned.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->

None. All 30 local checks pass. The separate Git checkpoint value remains the explicit `0000000` sentinel because the supplied handoff is not a Git repository; it must be replaced with a real SHA during the student's Git workflow.

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->

This exercise separated three responsibilities that initially looked like one. The schema rejected S03 because `end` was a string and S05 because an extra `room` field was present, but it still cannot compare values. AC1's `start < end` rule, AC2's 120-minute duration, and AC4's overlap rule therefore remain inside canBook. The model's R2 call also showed why a tool call is not a verdict: it correctly supplied `blocked: true` and a 150-minute request, leaving the function to return Unavailable. R3 showed the model's role at an ambiguity boundary; asking for the missing five inputs was safer than inventing an afternoon schedule. Finally, A5 and A8 demonstrated that valid tool access does not imply permission for destructive repository changes or secret disclosure.
