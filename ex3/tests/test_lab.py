import json
import subprocess
import sys
from pathlib import Path

LAB = Path(__file__).resolve().parent.parent
SERVER_DIR = LAB / "server"
sys.path.insert(0, str(SERVER_DIR))

import server  # noqa: E402


def test_agent_tools_match_instructions():
    text = (LAB / "agent" / "reviewer.agent.md").read_text(encoding="utf-8")
    tools_line = next(line for line in text.splitlines() if line.startswith("tools:"))
    assert "edit" not in tools_line, "instructions say report only, but the tool list allows edit"


def test_server_import_writes_nothing_to_stdout():
    result = subprocess.run(
        [sys.executable, "-c", f"import sys; sys.path.insert(0, {str(SERVER_DIR)!r}); import server"],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr
    assert result.stdout == "", "stdout is reserved for protocol messages"


def test_list_notes_honours_path_argument():
    assert server.list_notes(path="archive") == ["old.txt"]


def test_hook_allows_tool_calls():
    result = subprocess.run(
        [sys.executable, str(LAB / "hooks" / "log_events.py")],
        input=json.dumps({"event": "PreToolUse"}),
        capture_output=True,
        text=True,
        cwd=LAB,
    )
    assert result.returncode == 0, "a non-zero exit blocks the tool call"
