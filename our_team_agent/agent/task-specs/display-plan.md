# Display Plan Task Specification

## Basic Information

- **Task ID:** T5
- **Task name:** Display First Step and Timed Checklist
- **Task type:** Present
- **Task owner:** NextStep browser interface

## 1. Task Description

Present the checked plan in a readable form so the student can begin studying. The first action is highlighted. A color-coded study breakdown chart shows how the available time is divided, and a larger timed checklist shows each action's minutes and clock window. Checklist progress is saved in the student's browser; the app does not make calendar changes.

## 2. Inputs

### Input 1

- **Input name:** Checked plan
- **Contents and format:** JSON from T4 with a first step, headline, array of timed steps, later-work array, optional question, and total minutes.
- **Source:** `POST /api/plan` success response.
- **If missing or invalid:** Show an error through T6 rather than an empty success view.

## 3. Outputs

### Output 1

- **Output name:** Actionable browser plan
- **Contents and format:** Highlighted first action, study breakdown chart, timed checklist and progress bar, total planned minutes, a list of later work, and an optional question with an answer field and Refine plan action.
- **Next task or recipient:** Student begins studying and may check off displayed steps.
- **Complete when:** The plan is visible in the browser after a successful response.

## 4. Planned Tools

### Tool 1

- **Tool name:** `render`
- **Input:** Checked plan JSON.
- **Output:** Browser DOM elements created with text content.
- **Implementation route:** JavaScript in `app.js`.
- **Integration approach:** Direct browser rendering; no external app.
- **Maximum retries:** None.
- **On error:** Show an error message; do not claim the plan was delivered.
