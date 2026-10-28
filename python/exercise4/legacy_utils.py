"""Legacy helper functions used by the reporting script. Review target for Exercise 4."""

import json
from datetime import date


def load_config(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def days_between(start: date, end: date) -> int:
    """Return the number of days from start to end."""
    return (end - start).days


def format_currency(amount: float, currency: str = "EUR") -> str:
    """Format amount with two decimals followed by the currency code."""
    return f"{amount:.2f} {currency}"


def parse_bool(value):
    """Convert "yes", "true", or "1" to True, and any other value to False."""
    return str(value).strip().lower() in {"yes", "true", "1"}


def retry_count(config: dict) -> int:
    return config.get("retries", 3)


def _internal_helper(x):
    return x
