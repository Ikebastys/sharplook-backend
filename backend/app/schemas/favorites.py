from pydantic import BaseModel, Field


class FavoriteToggleRequest(BaseModel):
    product_id: int = Field(..., description="ID товара")


class FavoriteToggleResponse(BaseModel):
    product_id: int
    is_favorite: bool
