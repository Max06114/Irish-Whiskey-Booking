"""
One-time script to update trip prices in MongoDB
Harding Hotel is cheaper than Leonardo, so we need to adjust:
- DZ: 2700€ → 2600€
- EZ: 3330€ → 3150€
- EZZ: 660€ → 550€
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
db_name = os.environ.get("DB_NAME", "hotel_booking")

async def update_prices():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # First, let's see what we have
    print("🔍 Current trip data:")
    trips = await db.trips.find({}, {"_id": 0}).to_list(100)
    for trip in trips:
        print(f"  - {trip.get('destination', 'Unknown')}: DZ={trip.get('price_per_person_double')}€, EZ={trip.get('price_per_person_single')}€, EZZ={trip.get('single_supplement')}€")
    
    # Update all trips with new Harding Hotel prices
    result = await db.trips.update_many(
        {}, 
        {"$set": {
            "price_per_person_double": 2600.0,
            "price_per_person_single": 3150.0,
            "single_supplement": 550.0
        }}
    )
    
    print(f"\n✅ Updated {result.modified_count} trip(s).")
    
    # Verify the update
    print("\n🔍 Updated trip data:")
    trips = await db.trips.find({}, {"_id": 0}).to_list(100)
    for trip in trips:
        print(f"  - {trip.get('destination', 'Unknown')}: DZ={trip.get('price_per_person_double')}€, EZ={trip.get('price_per_person_single')}€, EZZ={trip.get('single_supplement')}€")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(update_prices())
