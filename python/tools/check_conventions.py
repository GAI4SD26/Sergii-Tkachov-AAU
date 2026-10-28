"""Check public top-level functions for a docstring and full type annotations.

Usage (from the python/ folder):
    python tools/check_conventions.py <file.py> [more files ...]

Prints one line per function that breaks the convention, then a summary of
compliant functions. Exits with 1 if any function fails, otherwise 0.
Used in Exercise 3 to score Copilot output and in Exercise 4 as a review target.
"""

import ast
import sys
from pathlib import Path


def check_file(path: Path) -> tuple[int, list[str]]:
    """Return (number of public functions, list of problem descriptions)."""
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    total = 0
    problems: list[str] = []
    for node in tree.body:
        if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue
        if node.name.startswith("_"):
            continue
        total += 1
        issues = []
        if ast.get_docstring(node) is None:
            issues.append("missing docstring")
        missing_params = [a.arg for a in _all_params(node) if a.annotation is None]
        if missing_params:
            issues.append("missing type hints for " + ", ".join(missing_params))
        if node.returns is None:
            issues.append("missing return type")
        if issues:
            problems.append(f"{path}:{node.lineno}: {node.name}: {'; '.join(issues)}")
    return total, problems


def _all_params(node: ast.FunctionDef | ast.AsyncFunctionDef) -> list[ast.arg]:
    """Return every parameter of a function, including *args and **kwargs."""
    args = node.args
    params = args.posonlyargs + args.args + args.kwonlyargs
    if args.vararg:
        params.append(args.vararg)
    if args.kwarg:
        params.append(args.kwarg)
    return params


def main(argv: list[str]) -> int:
    """Run the check on each file named in argv and print a summary."""
    if not argv:
        print(__doc__)
        return 2
    grand_total = 0
    grand_problems = 0
    for name in argv:
        total, problems = check_file(Path(name))
        for line in problems:
            print(line)
        compliant = total - len(problems)
        print(f"{name}: {compliant}/{total} public functions compliant")
        grand_total += total
        grand_problems += len(problems)
    print(f"TOTAL: {grand_total - grand_problems}/{grand_total} compliant")
    return 1 if grand_problems else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
