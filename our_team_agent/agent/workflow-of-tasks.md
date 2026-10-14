# Workflow of Tasks

## 1. Workflow Goal

This workflow supports the goal in the [NextStep project charter](../../README.md#team-charter). NextStep helps a student turn several overwhelming study tasks into a short plan with a clear first action and timed steps that fit the available study period.

## 2. Workflow Trigger

The workflow begins when a student submits study tasks, any known deadlines or blockers, available minutes, and an energy level in the local app.

## 3. Completion Condition at Runtime

One run completes successfully when the app displays an actionable first step and a timed checklist whose total is within the student's time budget. The result may also show deferred work and one clarifying question. Marking items complete happens after plan generation and is optional.

Invalid input, an unavailable API key, an API or account error, or an unusable model response are unsuccessful runs. The app displays an error and the student or project operator may correct the issue and resubmit. No automatic retry or plan storage is implemented.

## 4. General Workflow

T1 checks that the submitted task description, time budget, and energy level are usable. T2 checks for an API key in the environment or local key file. T3 sends the workload and constraints to the model, which proposes concrete, prioritized actions, a starting step, later work, and an optional clarification. T4 checks that the returned steps have usable durations and fit the submitted time budget. T5 displays the plan and a checklist in the browser.

If a check or API request fails, the app shows an error. T6 represents the manual follow-up: revise input, supply a key, resolve account access or credits, or retry after a temporary service problem. The app does not silently substitute a made-up plan.

## 5. Workflow Diagram

```mermaid
flowchart TD
    START([Student submits workload, time, and energy]) --> T1["T1: Validate Input"]
    T1 --> D1{"Input usable?"}
    D1 -->|No| T6["T6: Resolve Planning Exception"]
    D1 -->|Yes| T2["T2: Check API Key"]

    T2 --> D2{"Key available?"}
    D2 -->|No| T6
    D2 -->|Yes| T3["T3: Generate Study Plan with AI"]

    T3 --> D3{"API request succeeds?"}
    D3 -->|No| T6
    D3 -->|Yes| T4["T4: Check Plan and Time Budget"]

    T4 --> D4{"Plan usable and within budget?"}
    D4 -->|No| T6
    D4 -->|Yes| T5["T5: Display First Step and Timed Checklist"]

    T5 --> END([Complete: Actionable plan displayed])
    T6 --> HOLD([Paused until issue is corrected and student resubmits])
```

See the [task summary](task-summary.md) for each task's specification. The model is responsible for generating the study actions in T3; the other app tasks validate, route, and display the result.
