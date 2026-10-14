# About the Agentic System

BUS4498 Mini AI Build-a-thon — Option 2

**Problem to be solved:** A student may have several assignments and study tasks but feel unsure where to begin or how much can fit into the time available. NextStep turns that workload into a short, actionable study plan.

## Team Charter

### System Name

NextStep

### System Goal

Help a student choose a practical first action, break larger assignments into manageable timed steps, and identify work that should wait until later. The plan should respect the time and information the student provides.

### Who Is Better Off When This Works?

Students with competing study priorities can begin work sooner and see a realistic set of actions for their available study period.

## Agent Documentation

| Document | Purpose |
| --- | --- |
| [Workflow of Tasks](our_team_agent/agent/workflow-of-tasks.md) | Trigger, completion condition, runtime sequence, and Mermaid diagram |
| [Task Summary](our_team_agent/agent/task-summary.md) | Index of T1–T6 and their specification files |
| [Task Specifications](our_team_agent/agent/task-specs) | Inputs, outputs, tools, boundaries, and failure handling for each task |
| [Demo Plan](our_team_agent/docs/demo-plan.md) | Three-minute showcase outline and readiness check |

The repository follows the team template: `our_team_agent/` contains `agent/`, `docs/`, and `.gitkeep`; the root contains this README and an MIT `LICENSE`. The running app lives in `our_team_agent/agent/app/`. The root `.gitignore` excludes the local API key.

## Run Locally

1. Put a valid OpenAI API key in `api_keys/openai.txt.txt` as a bare key or `OPENAI_API_KEY="..."` line, or set the `OPENAI_API_KEY` environment variable. The `api_keys` folder is excluded by `.gitignore`.
2. Run `node our_team_agent/agent/app/server.js` in this repository folder.
3. Open `http://127.0.0.1:3000`. Add each big study task, its estimated minutes, optional due date, and known work breakdown (one step per line).
4. Choose a study day in the calendar, start time, available minutes, and energy level. The task draft and study block are saved in this browser.
5. Select **Generate with AI** and review the proposed timed steps.

The running app uses `gpt-6-luna` through the OpenAI Responses API to create the plan. The Node.js server validates inputs and output and keeps the key out of the browser. A live AI plan requires internet and available API credits. The calendar and task draft can be edited without API access; no generated plan is saved or silently substituted when an API call fails. The app does not automatically retry failed requests.

## Skill Decision

No reusable Skill is included for this single workflow. The server instruction and JSON output schema already keep the model's task and response format consistent.
