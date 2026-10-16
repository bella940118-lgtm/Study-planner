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

1. Install Node.js 18 or newer. Put a valid Claude API key in `api_keys/claude.txt.txt` as a bare key or `ANTHROPIC_API_KEY="..."` line, or set the `ANTHROPIC_API_KEY` environment variable. The `api_keys` folder is excluded by `.gitignore`; never commit API keys.
2. Run `node our_team_agent/agent/app/server.js` in this repository folder.
3. Open `http://127.0.0.1:3000`. Add each big study task, its estimated minutes, optional due date, urgency and importance category, and known work breakdown (one step per line). Tasks are color coded by category, with high urgency and high importance marked **Urgent**. Answer the willingness question on each task so the planner can make reluctant tasks easier to begin.
4. Choose a study day in the calendar, start time, available minutes, and energy level. The task draft and study block are saved in this browser.
5. Select **Generate with AI** and review the timed checklist, total planned time, study block length, unallocated time, and work saved for another session. Short breaks appear as separate timed steps when useful. If the planner asks a question, answer it and select **Refine plan** to update the plan within the same study block. Refining starts a fresh checklist. Check off study actions as you complete them; the progress bar fills and a brief celebration appears when every study action is checked. Breaks can be checked separately and do not prevent completion. The plan and progress are saved in this browser.

The running app uses `claude-haiku-5-5` through the Claude Messages API to create the plan. Set `ANTHROPIC_MODEL` to choose another Claude model. The Node.js server validates inputs and output and keeps the key out of the browser. A live AI plan requires internet and available API credits. The calendar, task draft, and a previously generated plan can be viewed without API access. Plans and checkbox progress are saved locally and cleared when the task draft or study block changes. The app does not automatically retry failed requests.

## Skill Decision

No reusable Skill is included for this single workflow. The server instruction and JSON output schema already keep the model's task and response format consistent.
