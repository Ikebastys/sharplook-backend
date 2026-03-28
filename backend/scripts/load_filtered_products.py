"""Load filtered_products.csv into the products table."""

from __future__ import annotations

import csv
import sys
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path
from typing import Iterable, Optional

# Path to CSV (можно поменять на нужный)
PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = PROJECT_ROOT / "backend"
CSV_PATH = PROJECT_ROOT / "filtered_products.csv"
BATCH_SIZE = 500

# Ensure backend dir is on sys.path so we can import app.*
if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))

from app.db import SessionLocal  # noqa: E402
from app.models.product import Product  # noqa: E402


@dataclass
class ProductRow:
    id: int
    title: str
    description: str
    image_path: Optional[str]
    price: Optional[Decimal]
    category: Optional[str]
    color: Optional[str]


def parse_price(raw: str | None) -> Optional[Decimal]:
    if raw is None:
        return None
    raw = raw.strip()
    if not raw:
        return None
    try:
        return Decimal(raw)
    except Exception:
        return None


def read_csv(csv_path: Path) -> Iterable[ProductRow]:
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            title = (row.get("title") or "").strip()
            description = (row.get("description") or "").strip()
            if not title or not description:
                continue

            try:
                row_id = int(row.get("id", "").strip())
            except Exception:
                continue

            yield ProductRow(
                id=row_id,
                title=title,
                description=description,
                image_path=(row.get("image_path") or "").strip() or None,
                price=parse_price(row.get("price")),
                category=(row.get("category") or "").strip() or None,
                color=(row.get("color") or "").strip() or None,
            )


def upsert_products(rows: Iterable[ProductRow], batch_size: int = BATCH_SIZE) -> None:
    db = SessionLocal()
    try:
        batch = 0
        total = 0
        for row in rows:
            product = db.get(Product, row.id)
            if not product:
                product = Product(id=row.id)
                db.add(product)

            product.title = row.title
            product.description = row.description
            product.image_path = row.image_path
            product.price = row.price
            product.category = row.category
            product.color = row.color

            batch += 1
            total += 1

            if batch >= batch_size:
                db.commit()
                print(f"Committed {total} rows...")
                batch = 0

        if batch:
            db.commit()
            print(f"Committed final {total} rows.")
    finally:
        db.close()


def main(csv_path: Path = CSV_PATH) -> None:
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV not found: {csv_path}")

    print(f"Loading products from: {csv_path}")
    rows = read_csv(csv_path)
    upsert_products(rows)
    print("Done.")


if __name__ == "__main__":
    # Миграции запускаем отдельно: alembic upgrade head
    main()
