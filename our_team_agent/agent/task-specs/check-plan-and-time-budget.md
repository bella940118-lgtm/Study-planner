# Check Plan and Time Budget Task Specification

## Basic Information

- **Task ID:** T4
- **Task name:** Check Plan and Time Budget
- **Task type:** Verify
- **Task owner:** NextStep local server

## 1. Task Description

Check that the model's structured response can be used by the app and that the proposed step durations fit the student's available minutes. This task does not judge whether the study advice is academically correct.

## 2. Inputs

### Input 1

- **Input name:** Model response
- **Contents and format:** Responses API output text intended to parse as JSON under the study-plan schema.
- **Source:** T3.
- **If missing or invalid:** Return a plan error for T6; do not display a fabricated or partial plan.

### Input 2

- **Input name:** Available minutes
- **Contents and format:** Validated integer from T1.
- **Source:** Student form.

## 3. Outputs

### Output 1

- **Output name:** Checked plan
- **Contents and format:** Parsed plan with `total` minutes and model name, or a safe error. The plan must have at least one step, each step must have an integer duration from 1 to 60 minutes, and the sum must not exceed the submitted budget.
- **Next task or recipient:** T5 when usable; T6 otherwise.
- **Complete when:** The server accepts or rejects the plan based on these checks.

## 4. Planned Tools

### Tool 1

- **Tool name:** `outputText`, JSON parser, and duration checks
- **Input:** API response and validated time budget.
- **Output:** Checked plan or error.
- **Implementation route:** Functions and logic in `server.js`.
- **Integration approach:** Direct local call after T3.
- **Maximum retries:** None. The student may submit again after a rejected plan.
- **On error:** Return an HTTP 502 error without sending an unchecked plan to the browser.
