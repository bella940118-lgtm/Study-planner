# Display Plan Task Specification

## Basic Information

- **Task ID:** T5
- **Task name:** Display First Step and Timed Checklist
- **Task type:** Present
- **Task owner:** NextStep browser interface

## 1. Task Description

Present the checked plan in a readable form so the student can begin studying. The first action is highlighted; subsequent steps have minute labels and checkboxes. This task does not save completion state or make calendar changes.

## 2. Inputs

### Input 1

- **Input name:** Checked plan
- **Contents and format:** JSON from T4 with a first step, headline, array of timed steps, later-work array, optional question, and total minutes.
- **Source:** `POST /api/plan` success response.
- **If missing or invalid:** Show an error through T6 rather than an empty success view.

## 3. Outputs

### Output 1

- **Output name:** Actionable browser plan
- **Contents and format:** Highlighted first action, timed checklist, total planned minutes, later work, and optional question.
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
