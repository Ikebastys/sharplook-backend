from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import ADMIN_EMAIL
from app.db import get_db
from app.deps import bearer_scheme
from app.models.click_event import ClickEvent
from app.models.product import Product
from app.models.search_event import SearchEvent
from app.models.user import User
from app.security import decode_token

router = APIRouter(prefix="/admin", tags=["admin"])


def render_table(headers, rows):
    head_html = "".join(f"<th>{h}</th>" for h in headers)
    body_rows = []
    for row in rows:
        body_rows.append("<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>")
    return f"<table border='1' cellspacing='0' cellpadding='4'><tr>{head_html}</tr>{''.join(body_rows)}</table>"


def _get_admin_user(
    request: Request,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> User:
    token: str | None = None
    if credentials and credentials.scheme.lower() == "bearer":
        token = credentials.credentials
    if not token:
        token = request.query_params.get("token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if user.is_admin or (ADMIN_EMAIL and user.email == ADMIN_EMAIL):
        return user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")


@router.get("/stats", response_class=HTMLResponse)
def admin_stats(current_admin=Depends(_get_admin_user), db: Session = Depends(get_db)):
    total_searches = db.execute(select(func.count()).select_from(SearchEvent)).scalar() or 0
    unique_users = (
        db.execute(
            select(func.count(func.distinct(SearchEvent.user_id))).where(SearchEvent.user_id.isnot(None))
        ).scalar()
        or 0
    )

    top_queries = db.execute(
        select(SearchEvent.query_text, func.count().label("cnt"))
        .group_by(SearchEvent.query_text)
        .order_by(func.count().desc())
        .limit(10)
    ).all()

    top_clicks = db.execute(
        select(ClickEvent.product_id, Product.title, func.count().label("cnt"))
        .outerjoin(Product, Product.id == ClickEvent.product_id)
        .group_by(ClickEvent.product_id, Product.title)
        .order_by(func.count().desc())
        .limit(10)
    ).all()

    html_parts = [
        "<h1>SharpLook — статистика</h1>",
        f"<p>Всего поисковых запросов: <strong>{total_searches}</strong></p>",
        f"<p>Уникальных залогиненных пользователей с запросами: <strong>{unique_users}</strong></p>",
        "<h2>Топ‑10 запросов</h2>",
        render_table(["Запрос", "Количество"], top_queries),
        "<h2>Топ‑10 кликов по товарам</h2>",
        render_table(["Product ID", "Title", "Кликов"], top_clicks),
    ]
    return HTMLResponse("".join(html_parts))
