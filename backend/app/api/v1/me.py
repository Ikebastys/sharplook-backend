from fastapi import APIRouter, Depends

from app.deps import get_current_user
from app.models.user import User

router = APIRouter(tags=["users"])


@router.get("/v1/me")
def read_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_admin": bool(current_user.is_admin),
    }
