from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user
from app.models.favorite import Favorite
from app.models.product import Product
from app.models.user import User
from app.schemas.favorites import FavoriteToggleRequest, FavoriteToggleResponse
from app.schemas.product import ProductOut

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.post("/toggle", response_model=FavoriteToggleResponse)
def toggle_favorite(
    payload: FavoriteToggleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.get(Product, payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    stmt = select(Favorite).where(
        and_(Favorite.user_id == current_user.id, Favorite.product_id == payload.product_id)
    )
    existing = db.execute(stmt).scalar_one_or_none()

    if existing:
        db.delete(existing)
        db.commit()
        return FavoriteToggleResponse(product_id=payload.product_id, is_favorite=False)

    fav = Favorite(user_id=current_user.id, product_id=payload.product_id)
    db.add(fav)
    db.commit()
    return FavoriteToggleResponse(product_id=payload.product_id, is_favorite=True)


@router.get("/list", response_model=list[ProductOut])
def list_favorites(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    stmt = (
        select(Product)
        .join(Favorite, Favorite.product_id == Product.id)
        .where(Favorite.user_id == current_user.id)
    )
    products = db.execute(stmt).scalars().all()
    # помечаем признак избранного
    for p in products:
        p.is_favorite = True
    return products
