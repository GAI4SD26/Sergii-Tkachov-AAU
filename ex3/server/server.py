from pathlib import Path

from mcp.server.fastmcp import FastMCP

NOTES_DIR = Path(__file__).resolve().parent.parent / "sandbox" / "notes"

print("lab-notes server starting", flush=True)

mcp = FastMCP("lab-notes")


@mcp.resource("notes://summary")
def summary() -> str:
    files = sorted(p.name for p in NOTES_DIR.glob("*.txt"))
    return f"{len(files)} notes: " + ", ".join(files)


@mcp.tool()
def list_notes(path: str = ".") -> list[str]:
    """List the note files. path: subfolder of the notes folder to list."""
    return sorted(p.name for p in NOTES_DIR.glob("*.txt"))


@mcp.tool()
def read_note(name: str) -> str:
    """Return the text of one note by file name."""
    if Path(name).name != name:
        raise ValueError("name must be a file name, not a path")
    return (NOTES_DIR / name).read_text(encoding="utf-8")


@mcp.tool()
def count_words(text: str) -> int:
    """Count whitespace-separated words in text."""
    return len(text.split())


if __name__ == "__main__":
    mcp.run()
