# Check API Key Task Specification

## Basic Information

- **Task ID:** T2
- **Task name:** Check API Key
- **Task type:** Verify
- **Task owner:** NextStep local server

## 1. Task Description

Confirm that a key is available before the model request. Keep the key on the server; never send it to the browser or commit it to GitHub. This check confirms presence, not account validity or available credits.

## 2. Inputs

### Input 1

- **Input name:** API key configuration
- **Contents and format:** `OPENAI_API_KEY` environment variable, or text in `api_keys/openai.txt.txt` as a bare key or `OPENAI_API_KEY="..."` line.
- **Source:** Local project setup.
- **If a required input is missing or invalid:** If no nonblank value is found, return an HTTP 503 setup error for T6. Account validity is checked by the API in T3.

## 3. Outputs

### Output 1

- **Output name:** Server-side key availability
- **Contents and format:** A key string retained in server memory for T3, or a setup error shown without the key.
- **Next task or recipient:** T3 when present; T6 when absent.
- **Complete when:** The server has selected a key source or returned the missing-key error.

## 4. Planned Tools

### Tool 1

- **Tool name:** `parseKey` and `apiKey`
- **Input:** Environment value or local key-file text.
- **Output:** Parsed key or empty string.
- **Implementation route:** Functions in `server.js` using Node.js filesystem access.
- **Integration approach:** Direct local call.
- **Maximum retries:** None.
- **On error:** Stop before T3 and show a setup error. Do not log or display the key.
