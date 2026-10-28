# Copilot Basics: Python Exercise Assets

Starter code for Exercise 4 and the convention checker. The solution is not included.

## Setup

From this `python/` folder:

    python -m pip install -r requirements.txt

## Exercise

| Folder | Exercise | Starting state |
|--------|----------|----------------|
| exercise4/ | 4: Compare chat with skill or agent | `legacy_utils.py` is the review target for a docstring-checking skill or agent |

Score a file against the convention in Exercise 4:

    python tools/check_conventions.py exercise4/legacy_utils.py

The checker exits with 1 if any public function breaks the convention, and 0 otherwise.

## Warm-up challenge (before Exercise 4)

This 15-minute challenge practices the skill format used in Exercise 4. The starter file is in [challenges/](challenges/).

Work on a copy of `exercise4/legacy_utils.py` in a scratch folder, so the course files stay unchanged.

**Challenge A: write a skill.** Complete [challenges/skill-template/SKILL.md](challenges/skill-template/SKILL.md) as a `SKILL.md` with `name` and `description` frontmatter, numbered steps, and a result check. The skill should fix only the problems the checker reports, by adding docstrings and type hints.

- Check: the checker exits with 0 on your copy, and the diff contains only added docstrings and type hints.
- Think about: which words in the description would make an agent load the skill, and whether the description would trigger it when needed.

Reference solutions are not included. Compare your results with a classmate's before Exercise 4.
