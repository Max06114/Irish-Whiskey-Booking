"""
Update trip prices based on new EZ price (3050€):
- DZ: 2600€
- EZ: 3050€ (neu, war 3150€)
- Differenz: 450€ (neu, war 550€)
- Single Supplement: 450€
- Halbes DZ: 2825€ (2600 + 225)
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
db_name = os.environ.get("DB_NAME", "whiskey_booking")

async def update_prices():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Update trip prices
    result = await db.trips.update_many(
        {},
        {"$set": {
            "price_per_person_single": 3050.0,
            "single_supplement": 450.0,
            "price_per_person_shared": 2825.0
        }}
    )
    
    print(f"✅ Updated {result.modified_count} trip(s)")
    
    # Verify
    trip = await db.trips.find_one({}, {"_id": 0, "price_per_person_double": 1, "price_per_person_single": 1, "single_supplement": 1, "price_per_person_shared": 1})
    print("\n📊 Aktuelle Preise:")
    print(f"  DZ: {trip.get('price_per_person_double')}€")
    print(f"  EZ: {trip.get('price_per_person_single')}€")
    print(f"  Single Supplement: {trip.get('single_supplement')}€")
    print(f"  Halbes DZ: {trip.get('price_per_person_shared')}€")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(update_prices())
