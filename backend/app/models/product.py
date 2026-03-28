from sqlalchemy import Column, Integer, String, Text, Numeric, JSON

from app.db import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    image_path = Column(String, nullable=True)
    price = Column(Numeric(10, 2), nullable=True)
    shop_name = Column(String, nullable=True)
    url = Column(String, nullable=True)
    color = Column(String, nullable=True)
    category = Column(String, nullable=True)
    size = Column(String, nullable=True)
    embedding = Column(JSON, nullable=True)  # массив чисел; в SQLite хранится как JSON-текст
