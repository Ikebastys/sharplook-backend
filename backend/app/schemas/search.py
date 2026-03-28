from typing import List, Optional

from pydantic import BaseModel, Field

from app.schemas.product import ProductOut


class SearchTextRequest(BaseModel):
    query: str = Field(..., description="Поисковый текст")
    limit: int = Field(10, ge=1, le=50, description="Сколько результатов вернуть")


class SearchResponse(BaseModel):
    items: List[ProductOut]
