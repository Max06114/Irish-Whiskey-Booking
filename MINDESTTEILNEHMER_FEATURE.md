# Mindestteilnehmerzahl-Feature

## Übersicht

Die Reise kann erst ab **10 Teilnehmern** bestätigt werden. Diese wichtige Information wird an mehreren Stellen kommuniziert und es gibt eine automatische Benachrichtigung, sobald die Mindestteilnehmerzahl erreicht ist.

## Wo wird die Information angezeigt?

### 1. **Homepage - Anreiseinfo-Sektion**
- Prominenter gelber Warnhinweis **vor** der Anreiseinfo
- Kurze, prägnante Formulierung
- Erwähnt 3-Monats-Absagefrist und Rückerstattung

### 2. **Buchungsseite** (`/booking`)
- Kompakter Hinweis in der Buchungsübersicht (rechte Sidebar)
- Direkt unter dem Zahlungsplan platziert
- Visuell hervorgehoben mit Warnsymbol

### 3. **AGB-Seite** (`/agb`)
- Ausführliche rechtliche Regelung in **Punkt 6.2**
- Detaillierte Erklärung der Absagefrist (3 Monate = 90 Tage)
- Rückerstattungsgarantie der Anzahlung
- Empfehlung zur Flugbuchung erst nach Bestätigung

### 4. **Buchungsbestätigungs-E-Mail**
- Gelbe Info-Box mit vollständigem Hinweistext
- Erwähnung der automatischen Benachrichtigung bei Erreichen der Mindestteilnehmerzahl
- Hinweis auf Rückerstattung bei Absage

## Automatische Benachrichtigung

### Wie funktioniert es?

Wenn die **10. Buchung** eingeht:

1. **System prüft automatisch** die Gesamtteilnehmerzahl
2. Wenn vorher < 10 und jetzt ≥ 10:
   - **Alle bisherigen Teilnehmer** erhalten automatisch eine E-Mail
   - Betreff: "🎉 Gute Nachrichten: Ihre Irland-Reise ist bestätigt!"
   - Inhalt:
     - Bestätigung, dass Mindestteilnehmerzahl erreicht
     - Aufforderung, jetzt Flüge zu buchen
     - Link zu Skyscanner für Flugvergleich
     - Buchungsdetails mit Status "✓ Bestätigt"

### Technische Umsetzung

**Backend** (`server.py`):
```python
# In create_booking() Funktion:
new_total_participants = booked + participants
minimum_participants = 10

if booked < minimum_participants and new_total_participants >= minimum_participants:
    # Alle Teilnehmer benachrichtigen
    all_bookings = await db.bookings.find({"trip_id": booking_data.trip_id})
    for past_booking in all_bookings:
        # trip_confirmed_email() senden
```

**E-Mail-Template** (`email_service.py`):
- Neue Funktion: `trip_confirmed_email()`
- Visuell ansprechend mit grünen und gelben Highlight-Boxen
- Call-to-Action: "Jetzt Flug buchen"

## Rechtliche Regelungen

### Absagefrist
- **3 Monate (90 Tage)** vor Reisebeginn
- Bei Nichterreichen der Mindestteilnehmerzahl

### Rückerstattung
- **100% Anzahlung** wird zurückerstattet
- Keine weiteren Ansprüche des Kunden

### Empfehlung
- Flugbuchung **erst nach schriftlicher Reisebestätigung**
- Vermeidet Risiko von unnötigen Flugkosten

## Formulierungen

### Kurz (Homepage/Booking)
```
⚠️ Mindestteilnehmerzahl: 10 Personen
Bitte buchen Sie Ihren Flug erst nach Reisebestätigung. 
Bei Absage bis 3 Monate vor Reisebeginn wird die Anzahlung vollständig zurückerstattet.
```

### Ausführlich (AGB/E-Mail)
```
Die Reise findet nur bei Erreichen der Mindestteilnehmerzahl von 10 Personen statt. 

Travel Events behält sich vor, die Reise bis zu 3 Monate (90 Tage) vor Reisebeginn 
abzusagen, wenn die Mindestteilnehmerzahl nicht erreicht wird.

Wichtig: Wir empfehlen dringend, Flugbuchungen erst nach schriftlicher Reisebestätigung 
durch Travel Events vorzunehmen.

Bei Absage der Reise wegen Nichterreichens der Mindestteilnehmerzahl erhält der Kunde 
die bereits geleistete Anzahlung vollständig zurückerstattet. Weitere Ansprüche bestehen nicht.
```

## Testing

### Manuell testen:
1. Eine Buchung erstellen (Backend-Logs prüfen)
2. Weitere 8 Buchungen erstellen
3. Bei der **10. Buchung**:
   - Alle 10 Teilnehmer sollten die "Reise bestätigt"-E-Mail erhalten
   - Backend-Log zeigt: "🎉 Minimum participants (10) reached!"

### Prüfen der Anzeige:
```bash
# Homepage
curl -s http://localhost:3000 | grep "Mindestteilnehmerzahl"

# Booking-Seite  
curl -s http://localhost:3000/booking | grep "Mindestteilnehmerzahl"

# AGB
curl -s http://localhost:3000/agb | grep "Mindestteilnehmerzahl"
```

## Dateien geändert

1. `/app/frontend/src/pages/HomePage.js` (Zeile ~774)
2. `/app/frontend/src/pages/BookingPage.js` (Zeile ~549)
3. `/app/frontend/src/pages/AGBPage.js` (Zeile ~70-73)
4. `/app/backend/email_service.py` (Zeile ~232 + neue Funktion am Ende)
5. `/app/backend/server.py` (Zeile ~1631, neue Logik für automatische E-Mails)

## Deployment

Alle Änderungen sind committed. Beim nächsten "Save to GitHub":
- Vercel deployed Frontend (inkl. Mindestteilnehmer-Hinweise)
- Fly.io deployed Backend (inkl. automatische E-Mail-Logik)

Die Änderungen sind sofort live und funktionsfähig.
