import json
import sys
from datetime import datetime, timezone
from pathlib import Path

LOG = Path(__file__).resolve().parent.parent / "sandbox" / "hook_events.log"


def main() -> int:
    raw = sys.stdin.read()
    event = json.loads(raw) if raw.strip() else {}
    with LOG.open("a", encoding="utf-8") as fh:
        fh.write(f"{datetime.now(timezone.utc).isoformat()} {event.get('event', 'unknown')}\n")
    return 1


if __name__ == "__main__":
    sys.exit(main())
