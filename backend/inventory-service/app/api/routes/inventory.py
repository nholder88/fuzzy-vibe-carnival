from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Path, Depends
from uuid import UUID, uuid4

from app.schemas.inventory import (
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryItemResponse
)

router = APIRouter()

# Temporary in-memory storage for demo
inventory_items = []

@router.get("/", response_model=List[InventoryItemResponse])
async def get_inventory_items(
    household_id: Optional[UUID] = Query(None, description="Filter items by household ID"),
    category: Optional[str] = Query(None, description="Filter items by category")
):
    # Filter items by household_id if provided
    if household_id:
        filtered_items = [item for item in inventory_items if item["household_id"] == household_id]
    else:
        filtered_items = inventory_items
    
    # Further filter by category if provided
    if category:
        filtered_items = [item for item in filtered_items if item["category"] == category]
    
    return filtered_items

@router.get("/{item_id}", response_model=InventoryItemResponse)
async def get_inventory_item(
    item_id: UUID = Path(..., description="The ID of the inventory item to get")
):
    # Early return for error case
    item = next((item for item in inventory_items if item["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    return item

@router.post("/", response_model=InventoryItemResponse, status_code=201)
async def create_inventory_item(
    item: InventoryItemCreate
):
    new_item = {
        "id": uuid4(),
        **item.dict(),
        "last_updated": "2023-10-06T00:00:00Z",  # Simplified for now
    }
    
    inventory_items.append(new_item)
    
    # In a real implementation, we would publish an event to Kafka here
    # Example: await publish_event("inventory.created", new_item)
    
    return new_item

@router.put("/{item_id}", response_model=InventoryItemResponse)
async def update_inventory_item(
    item_update: InventoryItemUpdate,
    item_id: UUID = Path(..., description="The ID of the inventory item to update")
):
    # Early return for error case
    item_index = next((i for i, item in enumerate(inventory_items) if item["id"] == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    # Update the item
    updated_item = {
        **inventory_items[item_index],
        **item_update.dict(exclude_unset=True),
        "last_updated": "2023-10-06T00:00:00Z",  # Simplified for now
    }
    
    inventory_items[item_index] = updated_item
    
    # In a real implementation, we would publish an event to Kafka here
    # Example: await publish_event("inventory.updated", updated_item)
    
    return updated_item

@router.delete("/{item_id}", status_code=204)
async def delete_inventory_item(
    item_id: UUID = Path(..., description="The ID of the inventory item to delete")
):
    # Early return for error case
    item_index = next((i for i, item in enumerate(inventory_items) if item["id"] == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    # Store for event before deletion
    deleted_item = inventory_items[item_index]
    
    # Delete the item
    inventory_items.pop(item_index)
    
    # In a real implementation, we would publish an event to Kafka here
    # Example: await publish_event("inventory.deleted", deleted_item) 