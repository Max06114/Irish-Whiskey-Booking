#!/usr/bin/env python3
"""
Direct hotel seeding script - bypasses API/CORS issues
Run this to create the 4 main Irish Whiskey tour hotels
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from uuid import uuid4

async def seed_hotels():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client['hotel_booking']
    
    hotels_data = [
        {
            "id": str(uuid4()),
            "name": "Victoria Hotel Galway",
            "name_en": "Victoria Hotel Galway",
            "description": "Charmantes Boutique-Hotel in ruhiger Seitenstraße direkt am Eyre Square",
            "description_en": "Charming boutique hotel on a quiet side street right at Eyre Square",
            "stars": 4,
            "address": "Galway",
            "distance_to_venue": "",
            "distance_to_venue_en": "",
            "amenities": [],
            "amenities_en": [],
            "images": [],
            "image_ids": [],
            "single_price": 0.0,
            "double_price": 0.0,
            "breakfast_included": True,
            "tax_included": True,
            "active": True,
            "inventory_type": "fixed",
            "has_comfort_rooms": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "sort_order": 1
        },
        {
            "id": str(uuid4()),
            "name": "The Park Hotel Dungarvan",
            "name_en": "The Park Hotel Dungarvan",
            "description": "Elegantes Hotel in Dungarvan",
            "description_en": "Elegant hotel in Dungarvan",
            "stars": 4,
            "address": "Dungarvan",
            "distance_to_venue": "",
            "distance_to_venue_en": "",
            "amenities": [],
            "amenities_en": [],
            "images": [],
            "image_ids": [],
            "single_price": 0.0,
            "double_price": 0.0,
            "breakfast_included": True,
            "tax_included": True,
            "active": True,
            "inventory_type": "fixed",
            "has_comfort_rooms": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "sort_order": 2
        },
        {
            "id": str(uuid4()),
            "name": "Dublin Hotel",
            "name_en": "Dublin Hotel",
            "description": "Zentral gelegenes Hotel in Dublin (Name noch festzulegen)",
            "description_en": "Centrally located hotel in Dublin (name TBD)",
            "stars": 4,
            "address": "Dublin",
            "distance_to_venue": "",
            "distance_to_venue_en": "",
            "amenities": [],
            "amenities_en": [],
            "images": [],
            "image_ids": [],
            "single_price": 0.0,
            "double_price": 0.0,
            "breakfast_included": True,
            "tax_included": True,
            "active": True,
            "inventory_type": "fixed",
            "has_comfort_rooms": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "sort_order": 3
        },
        {
            "id": str(uuid4()),
            "name": "Killarney Hotel",
            "name_en": "Killarney Hotel",
            "description": "Hotel in Killarney (Name noch festzulegen)",
            "description_en": "Hotel in Killarney (name TBD)",
            "stars": 4,
            "address": "Killarney",
            "distance_to_venue": "",
            "distance_to_venue_en": "",
            "amenities": [],
            "amenities_en": [],
            "images": [],
            "image_ids": [],
            "single_price": 0.0,
            "double_price": 0.0,
            "breakfast_included": True,
            "tax_included": True,
            "active": True,
            "inventory_type": "fixed",
            "has_comfort_rooms": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "sort_order": 4
        }
    ]
    
    print("🏨 Seeding hotels to MongoDB...")
    
    seeded_count = 0
    for hotel_data in hotels_data:
        # Check if hotel already exists by name
        existing = await db.hotels.find_one({"name": hotel_data["name"]})
        if existing:
            print(f"   ⏭️  '{hotel_data['name']}' already exists, skipping")
            continue
        
        await db.hotels.insert_one(hotel_data)
        print(f"   ✅ Created: {hotel_data['name']}")
        seeded_count += 1
    
    print(f"\n✨ Done! {seeded_count} new hotel(s) created")
    print(f"📊 Total hotels in database: {await db.hotels.count_documents({})}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_hotels())
