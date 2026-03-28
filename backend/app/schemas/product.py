from typing import List, Optional

from pydantic import BaseModel
from pydantic import ConfigDict


class ProductOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    image_path: Optional[str] = None
    price: Optional[float] = None
    shop_name: Optional[str] = None
    url: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None
    size: Optional[str] = None
    embedding: Optional[List[float]] = None
    is_favorite: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)
