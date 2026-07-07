#!/usr/bin/env python3
"""
Gemini Vision Tool — standalone image analysis via Google Gemini REST API.
No SDK dependency — pure httpx/requests.

Usage:
    from gemini_vision import analyze_image
    result = analyze_image("path/to/image.jpg")
    result = analyze_image("path/to/image.jpg", prompt="Apa yang ada di gambar ini?")

Env:
    GEMINI_API_KEY — API key from Google AI Studio (starts with "AIza" or "AQ.")
"""
import base64
import json
import mimetypes
import os
import sys
from pathlib import Path
from typing import Optional

GEMINI_API_KEY_ENV = "GEMINI_API_KEY"
DEFAULT_MODEL = "gemini-1.5-flash"
DEFAULT_PROMPT = "Deskripsikan gambar ini secara detail."


def _get_api_key() -> str:
    key = os.environ.get(GEMINI_API_KEY_ENV)
    if not key:
        raise EnvironmentError(
            f"{GEMINI_API_KEY_ENV} tidak ditemukan. "
            f"Set dengan: export {GEMINI_API_KEY_ENV}=<your_key>"
        )
    return key


def _detect_mime(data: bytes, path: Optional[Path] = None) -> str:
    if data[:4] == b"\x89PNG":
        return "image/png"
    if data[:2] == b"\xff\xd8":
        return "image/jpeg"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    if data[:2] == b"BM":
        return "image/bmp"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    if path:
        ext = path.suffix.lower()
        return mimetypes.types_map.get(ext, "image/jpeg")
    return "image/jpeg"


def _read_image(image_source: str) -> tuple[bytes, str]:
    """Read image from file path or base64 data URL. Returns (bytes, mime)."""
    if image_source.startswith("data:"):
        header, _, b64data = image_source.partition(",")
        mime = header.split(":")[1].split(";")[0] if ":" in header else "image/jpeg"
        return base64.b64decode(b64data), mime

    path = Path(image_source)
    if not path.exists():
        raise FileNotFoundError(f"Gambar tidak ditemukan: {image_source}")
    data = path.read_bytes()
    mime = _detect_mime(data, path)
    return data, mime


def analyze_image(
    image_source: str,
    prompt: str = DEFAULT_PROMPT,
    model: str = DEFAULT_MODEL,
) -> str:
    """
    Analyze an image using Google Gemini REST API.

    Args:
        image_source: File path or base64 data URL.
        prompt: Text prompt (default: deskripsi detail).
        model: Gemini model name (default: gemini-1.5-flash).

    Returns:
        str: Text description from Gemini.
    """
    api_key = _get_api_key()
    image_data, mime_type = _read_image(image_source)

    # Encode to base64
    b64 = base64.b64encode(image_data).decode("ascii")

    # Build Gemini API request body
    request_body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": b64,
                        }
                    },
                ]
            }
        ]
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    # Try httpx first, fallback to urllib
    try:
        import httpx
        resp = httpx.post(url, json=request_body, timeout=60)
        resp.raise_for_status()
        data = resp.json()
    except ImportError:
        import urllib.request
        req = urllib.request.Request(
            url,
            data=json.dumps(request_body).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))

    # Parse response
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return text
    except (KeyError, IndexError) as e:
        error_msg = data.get("error", {}).get("message", str(data))
        raise RuntimeError(f"Gemini API error: {error_msg}") from e


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} <image_path> [prompt]")
        sys.exit(1)

    image_path = sys.argv[1]
    user_prompt = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_PROMPT

    try:
        result = analyze_image(image_path, prompt=user_prompt)
        print(result)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
