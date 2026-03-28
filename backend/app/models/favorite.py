from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
    product = relationship("Product")
