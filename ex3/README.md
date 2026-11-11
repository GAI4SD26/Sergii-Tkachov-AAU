# Lab: Find the Seeded Defects

Companion lab for the lecture on agent definitions, hooks, and MCP debugging.

## Goal

Find and fix four seeded defects across one agent file, one hook, and one Python MCP server. Each defect sits at a different layer. The lecture's triage order (configuration, handshake, discovery, invocation) helps you locate them.

## Setup

Use Python 3.12 (tested with 3.12.10). No network access and no API keys are needed.

```powershell
cd lab
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m pytest tests -q
```

On a fresh copy, the test run shows **4 failures**. Each failing test names one defect. Your job is to make them pass with minimal fixes.

## What is in this folder

| Path | What it is |
|---|---|
| `agent/reviewer.agent.md` | An agent definition. Check its instructions against its tool list. |
| `hooks/hooks.json`, `hooks/log_events.py` | A hook that logs each event to `sandbox/hook_events.log`. |
| `server/server.py` | A stdio MCP server with one resource and three tools. |
| `sandbox/notes/` | Sample text notes the server reads. |
| `tests/test_lab.py` | One test per defect. |
| `report_template.md` | The report format for your deliverable. |

## Deliverables

1. A bug report using `report_template.md`, with a trace for each defect. A finding without a trace is a hypothesis, not a defect.
2. A minimal fix for each defect.
3. One regression test per fix, added to `tests/`.
4. A list of every changed file in the report.

## Rules

- Run hooks only in this folder. Do not point a hook at files outside `sandbox/`.
- Do not add real credentials, tokens, or network calls.
- Keep fixes minimal. Do not refactor unrelated code.
- List every change in the report, including changes to tests.

## Before you start

The hook config keys, the event name in `hooks.json`, and the agent file location follow the lecture's examples. Your lecturer confirms the exact host version and format on the lab machines before the lab starts.
