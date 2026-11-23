# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| OpenAI Codex | gpt-5.6-sol | 2026-11-23 | codebase analysis (Task 1) | `report.md` |
| OpenAI Codex | gpt-5.6-sol | 2026-11-23 | feature extension (Task 2) | `app/src/rooms.ts`, `app/src/filter.ts`, `app/src/App.tsx`, `app/src/index.css` |
| OpenAI Codex | gpt-5.6-sol | 2026-11-23 | tests (Task 4) | `app/src/rules.test.ts` |

<!-- Delete rows you did not use the assistant for; add rows for anything else. The optional
     extension (an existing skill or a read-only MCP server) goes here too, with its permissions. -->

**The assistant wrote, or helped write, tests in `app/`:** yes — 10 tests in `rules.test.ts`;
<!-- Either answer is allowed. If "yes": which tests, and how you checked that their EXPECTED values
     come from AC1–AC5 and F1–F5, not from what the code happens to return. -->

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**
None

Signed: Kirillov Grigoriy
Date: 2026-11-23
