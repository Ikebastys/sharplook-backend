from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.models.click_event import ClickEvent
from app.models.search_event import SearchEvent


def log_search_event(session: Session, query_text: str, user_id: Optional[int]) -> None:
    event = SearchEvent(user_id=user_id, query_text=query_text, created_at=datetime.utcnow())
    session.add(event)


def log_click_event(session: Session, product_id: int, user_id: Optional[int]) -> None:
    event = ClickEvent(user_id=user_id, product_id=product_id, created_at=datetime.utcnow())
    session.add(event)
