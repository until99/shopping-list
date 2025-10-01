from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean
from sqlalchemy.sql import func

from db import Base


# SQLAlchemy Model


class Item(Base):
    __tablename__ = "items"
    __table_args__ = {"schema": "vitalis"}

    id = Column(
        Integer,
        primary_key=True,
    )
    name = Column(
        String(50),
        nullable=False,
    )
    description = Column(
        String(500),
        default="No description",
    )
    category = Column(
        String(50),
        default="Not specified",
    )
    price = Column(
        Float,
        default=0.0,
    )
    amount = Column(
        Integer,
        default=1,
    )
    purchased = Column(
        Boolean,
        default=False,
    )
    created_at = Column(
        DateTime,
        default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __init__(self, name, description, category, price, amount, purchased):
        self.name = name
        self.description = description
        self.category = category
        self.price = price
        self.amount = amount
        self.purchased = purchased


# Pydantic Model


class ItemSchema(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=3, max_length=500)
    category: str = Field(..., min_length=3, max_length=50)
    price: float = Field(..., gt=0)
    amount: int = Field(..., gt=0)
    purchased: bool = Field(...)


class ItemUpdateSchema(BaseModel):
    name: str | None = Field(None, min_length=3, max_length=50)
    description: str | None = Field(None, min_length=3, max_length=500)
    category: str | None = Field(None, min_length=3, max_length=50)
    price: float | None = Field(None, gt=0)
    amount: int | None = Field(None, gt=0)
    purchased: bool | None = Field(None)


class ItemDB(ItemSchema):
    id: int

    class Config:
        from_attributes = True
