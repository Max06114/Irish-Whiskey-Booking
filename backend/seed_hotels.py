"""
Seed script for hotel inventory data
Run this once to populate the hotels collection with initial data
"""

import asyncio
import os
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'irish_whiskey_db')

# Trip dates (from the main trip)
TRIP_START = datetime(2027, 5, 18)
TRIP_END = datetime(2027, 5, 25)

HOTELS_DATA = [
    {
        "hotel_id": "leonardo-dublin",
        "name": "Leonardo Hotel Christchurch",
        "location": "Dublin",
        "status": "awaiting_confirmation",  # or "booked"
        "rooms": [
            {
                "type": "single",
                "count_allocated": 0,  # How many rooms are currently allocated
                "price_per_night": 250,
                "available": True
            },
            {
                "type": "double",
                "count_allocated": 0,
                "price_per_night": 265,
                "available": True
            }
        ],
        "dates": {
            "check_in": "2027-05-18",
            "check_out": "2027-05-20",
            "nights": 2
        },
        "deadlines": {
            "free_cancellation": "2027-04-18",  # 30 days before arrival
            "payment_due": "2027-04-18",  # 100% advance payment
            "room_adjustment": None,
            "deposit_due": None,
            "deposit_amount": 0
        },
        "payment_terms": {
            "deposit_required": False,
            "full_payment_advance": True,
            "payment_due_days_before": 30
        },
        "cancellation_policy": {
            "free_until_days": 30,
            "tiers": [
                {"days_before": 28, "percentage": 50},
                {"days_before": 20, "percentage": 75},
                {"days_before": 13, "percentage": 90},
                {"days_before": 2, "percentage": 100}
            ]
        },
        "notes": "100% Vorauszahlung erforderlich. Kostenfreie Stornierung bis 30 Tage vor Anreise.",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "hotel_id": "victoria-galway",
        "name": "The Victoria Hotel Galway",
        "location": "Galway",
        "status": "awaiting_confirmation",
        "rooms": [
            {
                "type": "single",
                "count_allocated": 0,
                "max_available": 8,  # 8 Classic Double rooms for single occupancy
                "price_per_night": 209,
                "available": True,
                "note": "Classic Doppelzimmer zur Einzelnutzung"
            },
            {
                "type": "double",
                "count_allocated": 0,
                "max_available": 7,  # 7 Classic Double/Twin rooms
                "price_per_person_per_night": 115,
                "available": True,
                "note": "Classic Doppel-/Zweibettzimmer zur Doppelnutzung"
            }
        ],
        "dates": {
            "check_in": "2027-05-20",
            "check_out": "2027-05-22",
            "nights": 2
        },
        "deadlines": {
            "free_cancellation_full_group": "2027-02-20",  # 3 months (12 weeks) before - ENTIRE GROUP
            "contingent_adjustment": "2027-04-08",  # 6 weeks before - max 25% of rooms adjustable
            "payment_due": "2027-04-08",  # 6 weeks before
            "room_list_due": "2027-04-01",  # 7 weeks before
            "deposit_due": None,
            "deposit_amount": 0
        },
        "payment_terms": {
            "deposit_required": False,
            "full_payment_advance": True,
            "payment_due_days_before": 42  # 6 weeks
        },
        "cancellation_policy": {
            "free_cancellation_full_group_days": 90,  # 3 months for entire group
            "contingent_adjustment_days": 42,  # 6 weeks for individual adjustments
            "max_contingent_adjustment_percentage": 25,
            "note": "PHASE 1: Bis 3 Monate vor Anreise - kostenfreie Stornierung der GESAMTEN Gruppe. PHASE 2: Danach bis 6 Wochen vor Anreise - Kontingent-Anpassung möglich (max. 25% der Zimmer)."
        },
        "notes": "WICHTIG: 3 Monate vor Anreise = komplette Gruppenstornierung möglich. Danach: Kontingent-Anpassung bis 6 Wochen vorher (max. 25%). Zimmerliste 7 Wochen vorher. Zahlung 6 Wochen vorher.",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "hotel_id": "castlerosse-killarney",
        "name": "Castlerosse Park Resort",
        "location": "Killarney",
        "status": "awaiting_confirmation",
        "rooms": [
            {
                "type": "single",
                "count_allocated": 0,
                "max_available": 6,
                "prices_per_night": {
                    "2027-05-22": 162,
                    "2027-05-23": 144
                },
                "available": True
            },
            {
                "type": "double",
                "count_allocated": 0,
                "max_available": 9,
                "prices_per_person_per_night": {
                    "2027-05-22": 117,
                    "2027-05-23": 99
                },
                "available": True,
                "note": "Preis pro Person bei Teilung"
            }
        ],
        "dates": {
            "check_in": "2027-05-22",
            "check_out": "2027-05-24",
            "nights": 2
        },
        "deadlines": {
            "free_cancellation": "2027-04-24",  # 28 days before
            "payment_due": "2027-04-24",  # Full balance 28 days before
            "room_list_due": "2027-04-24",  # Final room list 28 days before
            "room_adjustment": "2027-05-20",  # 48 hours before (minor changes)
            "deposit_due": "2027-02-15",  # €1000 deposit
            "deposit_amount": 1000
        },
        "payment_terms": {
            "deposit_required": True,
            "deposit_amount": 1000,
            "deposit_due": "2027-02-15",
            "full_payment_advance": False,
            "payment_due_days_before": 28
        },
        "cancellation_policy": {
            "free_until_days": 28,
            "note": "Bei Stornierung bis 28 Tage vor Anreise: keine Gebühren, Anzahlung wird zurückerstattet."
        },
        "notes": "€1.000 Anzahlung bis 15. Feb 2027. Restzahlung 28 Tage vor Anreise. Kleinere Zimmeränderungen bis 48h vor Anreise möglich.",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "hotel_id": "park-dungarvan",
        "name": "The Park Hotel",
        "location": "Dungarvan (Shandon Road)",
        "status": "booked",  # Already booked!
        "rooms": [
            {
                "type": "single",
                "count_allocated": 0,
                "max_available": 6,
                "price_per_night": 130,
                "available": True
            },
            {
                "type": "double",
                "count_allocated": 0,
                "max_available": 9,
                "price_per_night": 150,
                "available": True
            }
        ],
        "dates": {
            "check_in": "2027-05-24",
            "check_out": "2027-05-25",
            "nights": 1
        },
        "deadlines": {
            "free_cancellation": None,  # Not specified
            "payment_due": "2027-05-10",  # 2 weeks before (estimate)
            "room_adjustment": None,
            "deposit_due": None,
            "deposit_amount": 0
        },
        "payment_terms": {
            "deposit_required": False,
            "full_payment_advance": False,
            "payment_due_days_before": 14  # 2 weeks
        },
        "cancellation_policy": {
            "note": "Nicht explizit genannt"
        },
        "notes": "Hotel kontaktiert 2 Wochen vor Anreise für vollständige Zahlung. Status: GEBUCHT.",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]


async def seed_hotels():
    """Seed hotels collection with initial data"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # Check if hotels already exist
        existing_count = await db.hotels.count_documents({})
        
        if existing_count > 0:
            print(f"⚠️  Hotels collection already has {existing_count} documents.")
            response = input("Do you want to replace them? (yes/no): ")
            if response.lower() != 'yes':
                print("❌ Seed cancelled.")
                return
            
            # Delete existing hotels
            await db.hotels.delete_many({})
            print("🗑️  Deleted existing hotels.")
        
        # Insert new hotels
        result = await db.hotels.insert_many(HOTELS_DATA)
        print(f"✅ Successfully seeded {len(result.inserted_ids)} hotels!")
        
        # Display summary
        print("\n📊 Hotels Overview:")
        for hotel in HOTELS_DATA:
            status_icon = "🟢" if hotel['status'] == 'booked' else "🔴"
            print(f"{status_icon} {hotel['name']} ({hotel['location']}) - {hotel['status'].upper()}")
            print(f"   Check-in: {hotel['dates']['check_in']} | Nights: {hotel['dates']['nights']}")
            if hotel['deadlines'].get('deposit_due'):
                print(f"   💰 Anzahlung: €{hotel['deadlines']['deposit_amount']} bis {hotel['deadlines']['deposit_due']}")
            if hotel['deadlines'].get('payment_due'):
                print(f"   💳 Zahlung fällig: {hotel['deadlines']['payment_due']}")
            if hotel['deadlines'].get('free_cancellation'):
                print(f"   🔄 Kostenfreie Stornierung bis: {hotel['deadlines']['free_cancellation']}")
            print()
        
    except Exception as e:
        print(f"❌ Error seeding hotels: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(seed_hotels())
