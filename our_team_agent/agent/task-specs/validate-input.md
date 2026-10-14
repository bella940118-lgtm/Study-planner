# Validate Input Task Specification

## Basic Information

- **Task ID:** T1
- **Task name:** Validate Input
- **Task type:** Verify
- **Task owner:** NextStep local server

## 1. Task Description

Check the student's submitted workload before making an API request. This is deterministic validation; it does not interpret assignments or choose priorities.

## 2. Inputs

### Input 1

- **Input name:** Student study request
- **Contents and format:** JSON with `tasks` as text, `minutes` as an integer, and `energy` as `low`, `medium`, or `high`.
- **Source:** Browser form sent to `POST /api/plan`.
- **If a required input is missing or invalid:** Return an HTTP 400 error for display by T6. Do not call the model.

## 3. Outputs

### Output 1

- **Output name:** Validation result
- **Contents and format:** Either a usable request or a short error message. Task text must contain at least eight characters after trimming and no more than 6,000 characters; minutes must be 10–480.
- **Next task or recipient:** T2 when valid; T6 when invalid.
- **Complete when:** Every required field has passed the server checks or the error has been returned.

## 4. Planned Tools

### Tool 1

- **Tool name:** `validate`
- **Input:** Parsed request JSON.
- **Output:** `null` when valid; an error message otherwise.
- **Implementation route:** Function in `server.js`.
- **Integration approach:** Direct local call.
- **Maximum retries:** None. The student must correct invalid input.
- **On error:** Stop the planning request and display the validation error.
