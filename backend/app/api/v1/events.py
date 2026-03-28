from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_current_user_optional
from app.models.product import Product
from app.schemas.events import ClickEventRequest, EventResponse
from app.services.events import log_click_event

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/click", response_model=EventResponse)
def log_click(
    payload: ClickEventRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    product = db.get(Product, payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    user_id = current_user.id if current_user else None
    log_click_event(db, payload.product_id, user_id)
    db.commit()
    return EventResponse(status="ok")
