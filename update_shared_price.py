#!/usr/bin/env python3
"""
Script zum Aktualisieren des 'Halbes Doppelzimmer' Preises in MongoDB.

Neue Kalkulation mit Harding Hotel:
- DZ: 2600€
- EZ: 3150€
- Differenz: 550€ (geteilt: 275€ pro Seite)
- Halbes DZ: 2600€ + 275€ = 2875€
"""

print("=" * 60)
print("HALBES DOPPELZIMMER PREIS AKTUALISIERUNG")
print("=" * 60)
print()
print("Neue Preise:")
print("  - Doppelzimmer (DZ): 2600€")
print("  - Einzelzimmer (EZ): 3150€")
print("  - Differenz: 550€ (geteilt: je 275€)")
print("  - Halbes DZ: 2875€ (2600 + 275)")
print()
print("Du musst diesen Preis manuell in MongoDB Atlas aktualisieren:")
print()
print("1. Gehe zu MongoDB Atlas: https://cloud.mongodb.com")
print("2. Wähle deine Datenbank 'hotel_booking'")
print("3. Öffne die Collection 'trips'")
print("4. Finde das Dokument für deine Reise")
print("5. Bearbeite das Feld 'price_per_person_shared' → Setze es auf: 2875.0")
print()
print("ODER verwende die MongoDB Shell:")
print()
print("db.trips.updateMany(")
print("  {},")
print("  { $set: { price_per_person_shared: 2875.0 } }")
print(")")
print()
print("=" * 60)
