from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "nyc-housing-intelligence-map" / "index.html"
FRAGMENT = Path(__file__).resolve().parent / "popup-five-covariates.html"

START = "<!-- FIVE_COVARIATE_POPUP_START -->"
END = "<!-- FIVE_COVARIATE_POPUP_END -->"


def main() -> None:
    text = PAGE.read_text(encoding="utf-8")
    fragment = FRAGMENT.read_text(encoding="utf-8").strip()

    text = re.sub(
        rf"\n?{re.escape(START)}.*?{re.escape(END)}\n?",
        "\n",
        text,
        flags=re.S,
    )

    text = text.replace(
        'aria-label="Close HPD violations card"',
        'aria-label="Close five housing covariates card"',
    )
    text = text.replace(
        "Drag to pan and zoom. Click a property point to open a mini HPD violations card; the complete property profile updates beside the map.",
        "Drag to pan and zoom. Click a property point to open a mini card summarizing the five housing covariates; the complete property profile updates beside the map.",
    )
    text = text.replace(
        "The mini map card reports open violations returned by NYC HPD at the time of the request.",
        "The full property profile reports open violations returned by NYC HPD at the time of the request.",
    )

    if "</body>" not in text:
        raise ValueError("Generated map does not contain a closing body tag")

    text = text.replace("</body>", f"{fragment}\n</body>", 1)
    PAGE.write_text(text, encoding="utf-8")

    if text.count(START) != 1 or text.count(END) != 1:
        raise ValueError("Five-covariate popup fragment was not inserted exactly once")
    if "Five housing covariates" not in text:
        raise ValueError("Five-covariate popup title is missing")

    print({"page": str(PAGE), "bytes": PAGE.stat().st_size})


if __name__ == "__main__":
    main()
