from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.config import ADMIN_EMAIL
from app.db import get_db
from app.models.user import User
from app.security import decode_token

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    if credentials is None or credentials.scheme.lower() != "bearer":
        return None
    token = credentials.credentials
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
    except Exception:
        return None
    if user_id is None:
        return None
    return db.get(User, int(user_id))


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    if current_user.is_admin:
        return current_user
    if ADMIN_EMAIL and current_user.email == ADMIN_EMAIL:
        return current_user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
