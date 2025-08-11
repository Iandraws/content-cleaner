import re
from html import unescape

INVISIBLES = (
    "\u200b\u2002\u2003\u00a0\u202f\u2060"
    "\u200c\u200d\u200e\u200f\ufeff\u2061\u2062\u2063\u2064"
    "\u180e\u2001\u2008\u2009\u200a\u3164\u00ad\u202e\u2800"
)

RE_INVIS = re.compile(f"[{re.escape(INVISIBLES)}]")

# 2) Curly quotes → straight quotes
QUOTE_MAP = str.maketrans(
    {
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
    }
)

# 3) Any kind of dash (including runs) → single hyphen
DASH_CHARS = "-\u2012\u2013\u2014\u2015\u2212\u2e3b\u2011"
RE_DASH = re.compile(f"[{re.escape(DASH_CHARS)}]+")

# 4) Spaces
RE_SPACES = re.compile(r"[ \t]{2,}")

# --- Minimal HTML handling ---
RE_BR = re.compile(r"(?i)<br\s*/?>")  # <br>, <br/>, <BR>, ...
RE_TAGS = re.compile(r"<!--.*?-->|<[^>]+>", re.S)  # strip comments & any tag
RE_NEWLINES = re.compile(r"\n{3,}")  # collapse 3+ NL to 2


def strip_html_minimal(s: str) -> str:
    s = unescape(s)  # &nbsp; → \u00A0, &amp; → &
    s = RE_BR.sub("\n", s)  # keep visual line breaks
    s = RE_TAGS.sub("", s)  # drop all other tags
    s = RE_NEWLINES.sub("\n\n", s)  # keep paragraphs tidy
    return s


def clean(text: str) -> str:
    text = strip_html_minimal(text)

    text = RE_INVIS.sub("", text)  # remove invisible/space-like chars
    text = text.translate(QUOTE_MAP)  # normalize quotes
    text = RE_DASH.sub("-", text)  # normalize dashes/runs to "-"
    text = RE_SPACES.sub(" ", text)  # collapse multiple spaces
    return text.strip()
