NextStep — BUS4498 Option 2

Run locally:
1. Put an OpenAI API key in api_keys/openai.txt.txt (one line), or set OPENAI_API_KEY. Do not paste the key into the browser.
2. In this folder, run: node server.js
3. Open http://127.0.0.1:3000
4. Enter fictional tasks, known deadlines, time available, and energy level. Select Make my plan.

The API key file is currently empty. The app requires a valid API key and internet for live plans. API requests may incur usage charges. If your account lacks access to gpt-6-luna, set OPENAI_MODEL to an available Responses API text model.

Codex helped build the interface, server, and workflow. The model called by the running app analyzes each student's workload and generates the steps. WORKFLOW.txt contains the prep sketch and 3-minute demo outline.
