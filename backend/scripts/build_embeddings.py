"""CLI: пересчитать эмбеддинги для всех товаров."""

from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = PROJECT_ROOT / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))

from app.db import SessionLocal  # noqa: E402
from app.semantic_search import index_products  # noqa: E402


def main() -> None:
    db = SessionLocal()
    try:
        total = index_products(db)
        print(f"Indexed embeddings for {total} products.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
