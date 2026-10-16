# Three-Minute Local Showcase

## Before the Showcase 

- Confirm the local API key is present and the account has available API credits. The key must stay out of GitHub and screen sharing.
- Start the server with `node our_team_agent/agent/app/server.js` from the repository root and open `http://127.0.0.1:3000`.
- Test a fictional workload and keep a backup screenshot of a successful result for explanation only. The graded demonstration should show the connected workflow live.

## Showcase Sequence

| Time | Presenter | What to show |
| --- | --- | --- |
| 0:00–0:45 | Partner A | State the Option 2 problem and show the [workflow diagram](../agent/workflow-of-tasks.md#5-workflow-diagram). |
| 0:45–1:30 | Partner A | Enter fictional assignments with deadlines, 60 available minutes, and an energy level. |
| 1:30–2:30 | Partner B | Generate a plan, explain its first step, timed checklist, and deferred work. If the planner asks a question, answer it and refine the plan. Mark a step complete. |
| 2:30–3:00 | Both | Explain the model and local server, the no-Skill decision, and the need to verify deadlines and assignment details. |

## Readiness Check

NextStep uses the Claude Messages API with `claude-haiku-5-5` by default. Before class, verify that the local API key and credits are available, the app generates a real study plan within the available time, and deferred work is specific. If a question appears, verify that answering it refines the plan.
