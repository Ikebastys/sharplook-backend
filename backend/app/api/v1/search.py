from typing import List

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user_optional
from app.models.product import Product
from app.schemas.search import SearchResponse, SearchTextRequest
from app.semantic_search import semantic_search
from app.services.events import log_search_event


COLOR_KEYWORDS = {
    "red": ["red", "красн", "малин", "бордо", "алый"],
    "blue": ["blue", "син", "голуб"],
    "green": ["green", "зел"],
    "black": ["black", "черн"],
    "white": ["white", "бел"],
    "yellow": ["yellow", "желт"],
    "pink": ["pink", "розов"],
    "beige": ["beige", "беж"],
    "brown": ["brown", "коричн"],
    "grey": ["grey", "gray", "сер"],
    "purple": ["purple", "фиолет", "пурпур"],
    "orange": ["orange", "оранж"],
}


def detect_color(query: str) -> str | None:
    q = query.lower()
    for color, subs in COLOR_KEYWORDS.items():
        for s in subs:
            if s in q:
                return color
    return None

router = APIRouter(prefix="/search", tags=["search"])


@router.post("/text", response_model=SearchResponse)
def search_text(
    payload: SearchTextRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    query_text = payload.query.strip()
    if not query_text:
        return {"items": []}

    # логируем поиск
    user_id = current_user.id if current_user else None
    log_search_event(db, query_text, user_id)
    db.commit()

    # Берём чуть больше результатов, чтобы после фильтрации по цвету не потерять релевантные
    raw_limit = min(payload.limit * 5, 200)
    products: List[Product] = semantic_search(db, query_text, limit=raw_limit)

    desired_color = detect_color(query_text)
    if desired_color:
        def color_matches(p: Product) -> bool:
            c = (p.color or "").lower()
            return desired_color in c

        # Оставляем только товары с совпадающим цветом (если их мало — покажем столько, сколько есть)
        filtered = [p for p in products if color_matches(p)]
        products = filtered

    if current_user:
        fav_ids = {
            row[0]
            for row in db.execute(
                text("SELECT product_id FROM favorites WHERE user_id = :uid"), {"uid": current_user.id}
            )
        }
        # После сортировки по цвету, оставляем только нужное количество
        products = products[: payload.limit]
        for p in products:
            p.is_favorite = p.id in fav_ids

    # Если не было current_user, всё равно урезаем до лимита
    products = products[: payload.limit]
    return {"items": products}


@router.post("/image", response_model=SearchResponse)
async def search_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Заглушка: реальный поиск по изображению позже.
    Пока возвращаем первые 5 товаров.
    """
    stmt = select(Product).limit(5)
    products: List[Product] = db.execute(stmt).scalars().all()
    return {"items": products}
