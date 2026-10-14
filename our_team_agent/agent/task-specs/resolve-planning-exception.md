# Resolve Planning Exception Task Specification

## Basic Information

- **Task ID:** T6
- **Task name:** Resolve Planning Exception
- **Task type:** Human follow-up
- **Task owner:** Student or project operator

## 1. Task Description

Respond to a failed planning run. The app displays an error; a person corrects the issue and submits again if appropriate. This is a manual action, not an autonomous retry or a successful endpoint.

## 2. Inputs

### Input 1

- **Input name:** Error displayed by the app
- **Contents and format:** Validation, missing-key, API/account, timeout, or unusable-plan message. The API key itself is never displayed.
- **Source:** T1, T2, T3, or T4.

## 3. Outputs

### Output 1

- **Output name:** Corrected setup or study request
- **Contents and format:** Edited task text/time/energy, corrected key or account access, or a decision to retry after a temporary issue.
- **Next task or recipient:** A new workflow run starts at T1 when the student resubmits.
- **Complete when:** The person has identified a next action. The failed run remains unsuccessful.

## 4. Planned Tools

### Tool 1

- **Tool name:** Browser error display and local setup
- **Input:** Safe error returned by the server.
- **Output:** Human-readable direction for the student or operator.
- **Implementation route:** `app.js` displays the error; the person edits the form, key file, or API account as needed.
- **Integration approach:** Human action outside the automated planner.
- **Maximum retries:** No automatic retries.
- **On unresolved error:** Stop. Do not present a static mock plan as a live model result.
