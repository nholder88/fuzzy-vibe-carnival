from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, validator
from datetime import datetime

class InventoryItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Name of the inventory item")
    category: Optional[str] = Field(None, max_length=50, description="Category of the item")
    quantity: int = Field(..., ge=0, description="Current quantity of the item")
    unit: Optional[str] = Field(None, max_length=20, description="Unit of measurement")
    threshold: Optional[int] = Field(None, ge=0, description="Threshold for low stock alert")
    household_id: UUID = Field(..., description="ID of the household this item belongs to")
    location: Optional[str] = Field(None, max_length=100, description="Storage location in the house")
    expiration_date: Optional[datetime] = Field(None, description="Expiration date if applicable")

class InventoryItemCreate(InventoryItemBase):
    added_by: Optional[UUID] = Field(None, description="ID of the user who added this item")

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Name of the inventory item")
    category: Optional[str] = Field(None, max_length=50, description="Category of the item")
    quantity: Optional[int] = Field(None, ge=0, description="Current quantity of the item")
    unit: Optional[str] = Field(None, max_length=20, description="Unit of measurement")
    threshold: Optional[int] = Field(None, ge=0, description="Threshold for low stock alert")
    location: Optional[str] = Field(None, max_length=100, description="Storage location in the house")
    expiration_date: Optional[datetime] = Field(None, description="Expiration date if applicable")

    @validator('name')
    def name_not_empty(cls, v):
        if v is not None and v.strip() == "":
            raise ValueError("Name cannot be empty")
        return v

class InventoryItemResponse(InventoryItemBase):
    id: UUID = Field(..., description="Unique identifier for the inventory item")
    last_updated: datetime = Field(..., description="Timestamp of the last update")
    added_by: Optional[UUID] = Field(None, description="ID of the user who added this item")

    class Config:
        orm_mode = True 