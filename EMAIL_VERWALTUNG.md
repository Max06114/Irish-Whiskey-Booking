# E-Mail-Übersicht für Admin

## ✅ **Automatisches BCC implementiert**

Ab sofort erhältst du automatisch eine **BCC-Kopie** aller E-Mails, die an Kunden versendet werden.

### Was bedeutet das?

- **Buchungsbestätigungen** → Du erhältst Kopie
- **Zahlungserinnerungen** → Du erhältst Kopie
- **Reisebestätigungen** (bei 10 Teilnehmern) → Du erhältst Kopie
- **Zahlungsbestätigungen** → Du erhältst Kopie

### Empfänger-E-Mail

Die BCC-Kopien gehen an: **info@travel-events.de**

### Sicherheit

- **Keine BCC-Loop:** Wenn eine E-Mail direkt an `info@travel-events.de` geht (z.B. Admin-Benachrichtigung bei neuer Buchung), wird KEIN zusätzliches BCC verschickt
- Der Kunde sieht NICHT, dass du eine Kopie erhältst (BCC = Blind Carbon Copy)

---

## 📧 **Wo du E-Mails nachschauen kannst**

### Option 1: In deinem E-Mail-Postfach (empfohlen)

Alle E-Mails landen automatisch in **info@travel-events.de**.

**Tipp:** Erstelle einen Ordner/Label namens "Kunden-E-Mails (BCC)" und richte eine Filterregel ein:
- **Von:** info@travel-events.de
- **An:** [verschiedene Kunden]
- **Aktion:** In Ordner "Kunden-E-Mails (BCC)" verschieben

So hast du alle Kundenkommunikation an einem Ort.

### Option 2: Resend Dashboard

Du kannst auch im Resend-Dashboard alle gesendeten E-Mails sehen:

1. Gehe zu: https://resend.com/emails
2. Dort siehst du:
   - ✅ Alle gesendeten E-Mails
   - 📅 Zeitstempel
   - 👤 Empfänger
   - 📊 Zustellstatus (delivered, opened, clicked)
   - 📝 Vollständiger E-Mail-Inhalt

---

## 🔍 **Erste Buchung nachsehen**

### Methode 1: E-Mail-Postfach prüfen

Schaue in **info@travel-events.de** nach einer E-Mail mit:
- **Betreff:** "Buchungsbestätigung - Irish Whiskey Tour [Datum]"
- **Von:** Travel Events <info@travel-events.de>
- **BCC:** info@travel-events.de

### Methode 2: Resend Dashboard

1. Gehe zu https://resend.com/emails
2. Suche nach der E-Mail (neueste zuerst)
3. Klicke auf die E-Mail → Du siehst:
   - Vollständigen HTML-Inhalt
   - Anhang (Rechnung als PDF)
   - Zustellstatus

### Methode 3: Backend-Logs (für Debugging)

Falls die E-Mail nicht angekommen ist, kannst du die Backend-Logs prüfen:

```bash
# Fly.io (Produktiv)
fly logs -a [dein-app-name]

# Suche nach "Email sent successfully"
```

---

## 📊 **Welche E-Mails werden automatisch versendet?**

### 1. **Buchungsbestätigung** (sofort nach Buchung)
- **An:** Kunde
- **BCC:** info@travel-events.de ✅
- **Anhang:** Rechnung als PDF
- **Inhalt:** Buchungsdetails, Mindestteilnehmer-Hinweis

### 2. **Admin-Benachrichtigung** (sofort nach Buchung)
- **An:** info@travel-events.de
- **BCC:** Keine (da bereits an Admin)
- **Inhalt:** Neue Buchung eingegangen (Admin-Version)

### 3. **Reisebestätigung** (bei 10. Buchung)
- **An:** ALLE bisherigen Teilnehmer
- **BCC:** info@travel-events.de ✅
- **Inhalt:** "Mindestteilnehmerzahl erreicht, jetzt Flug buchen"

### 4. **Zahlungserinnerung** (geplant für P1)
- **An:** Kunde
- **BCC:** info@travel-events.de ✅
- **Inhalt:** Erinnerung an Restzahlung

---

## ⚙️ **Technische Details**

### Code-Änderung

In `/app/backend/email_service.py`:

```python
# Automatisches BCC für Admin
bcc_list = bcc or []
if ADMIN_EMAIL and to.lower() != ADMIN_EMAIL.lower() and ADMIN_EMAIL not in bcc_list:
    bcc_list.append(ADMIN_EMAIL)
```

### Umgebungsvariable

Die Admin-E-Mail wird aus der `.env` gelesen:

```bash
ADMIN_EMAIL=info@travel-events.de
```

Falls du die Admin-E-Mail ändern möchtest, kannst du das in der `.env`-Datei tun.

---

## 🚀 **Deployment**

Die Änderung ist committed. Beim nächsten "Save to GitHub":
- Fly.io deployed automatisch die neue Version
- Alle zukünftigen E-Mails enthalten BCC an info@travel-events.de

**Die erste Buchung wurde OHNE BCC versendet** (da die Änderung noch nicht live war). Aber du kannst die E-Mail trotzdem im Resend-Dashboard sehen!

---

## ❓ **FAQ**

**Q: Sieht der Kunde, dass ich eine Kopie erhalte?**  
A: Nein, BCC ist unsichtbar für den Empfänger.

**Q: Kann ich mehrere BCC-Empfänger hinzufügen?**  
A: Ja, ändere einfach in `email_service.py` die `bcc_list`.

**Q: Was ist, wenn ich keine BCC-Kopie mehr möchte?**  
A: Entferne die BCC-Logik aus `email_service.py` oder setze `ADMIN_EMAIL=""` in der `.env`.

**Q: Werden auch Admin-Benachrichtigungen mit BCC versendet?**  
A: Nein, nur E-Mails an Kunden. E-Mails an den Admin selbst erhalten kein zusätzliches BCC (würde doppelt sein).
