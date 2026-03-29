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

    products: List[Product] = semantic_search(db, query_text, limit=payload.limit)

    if current_user:
        fav_ids = {
            row[0]
            for row in db.execute(
                text("SELECT product_id FROM favorites WHERE user_id = :uid"), {"uid": current_user.id}
            )
        }
        for p in products:
            p.is_favorite = p.id in fav_ids

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
