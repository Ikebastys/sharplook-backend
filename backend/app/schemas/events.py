from typing import Optional

from pydantic import BaseModel, Field


class ClickEventRequest(BaseModel):
    product_id: int = Field(..., description="ID товара")


class EventResponse(BaseModel):
    status: str = "ok"
