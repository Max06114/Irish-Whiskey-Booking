# 🚀 Fly.io Deployment Guide - Irish Whiskey Backend

## Voraussetzungen ✅
- [x] Fly CLI installiert und via GitHub angemeldet
- [x] MongoDB Atlas Cluster erstellt
- [x] Resend API Key vorhanden (für E-Mail-Versand)

---

## 📋 Schritt-für-Schritt Deployment

### 1️⃣ Backend-Code zu Ihrem lokalen Rechner kopieren

Da Fly CLI auf Ihrem lokalen Rechner läuft, müssen Sie den Backend-Code zunächst aus dem GitHub Repository klonen:

```bash
# Klonen Sie Ihr Repository (falls noch nicht geschehen)
git clone https://github.com/Max06114/Irish-Whiskey-Booking.git
cd Irish-Whiskey-Booking/backend
```

**ODER** Sie können die Dateien direkt von diesem Container herunterladen:
- Laden Sie den gesamten `/app/backend` Ordner herunter
- Wechseln Sie in Ihrem Terminal in diesen Ordner

---

### 2️⃣ Fly App erstellen und konfigurieren

Öffnen Sie ein Terminal in Ihrem lokalen `backend/` Ordner und führen Sie aus:

```bash
# App erstellen (Region: Frankfurt)
flyctl launch --no-deploy

# Bei den Fragen:
# - App Name: irish-whiskey-backend (oder Ihr Wunschname)
# - Region: fra (Frankfurt)
# - PostgreSQL? → NO
# - Redis? → NO
```

Dies erstellt eine `fly.toml` Datei. Diese wurde bereits im Container vorbereitet und sollte in Ihrem backend/ Ordner vorhanden sein.

---

### 3️⃣ Umgebungsvariablen (Secrets) setzen

**WICHTIG:** Bevor Sie deployen, müssen Sie die folgenden Secrets setzen:

#### MongoDB Atlas Connection String
```bash
flyctl secrets set MONGO_URL="mongodb+srv://username:password@cluster.mongodb.net/irish_whiskey?retryWrites=true&w=majority"
```
👉 **Ersetzen Sie dies mit Ihrer echten MongoDB Atlas Connection String!**

#### JWT Secret (für Token-Authentifizierung)
```bash
flyctl secrets set JWT_SECRET="ihr-sehr-sicherer-zufälliger-string-hier"
```
💡 Tipp: Generieren Sie einen sicheren String mit:
```bash
openssl rand -base64 32
```

#### Resend API Key (für E-Mail-Versand)
```bash
flyctl secrets set RESEND_API_KEY="re_xxxxxxxxxxxxx"
```

#### Weitere Umgebungsvariablen
```bash
# Datenbank-Name
flyctl secrets set DB_NAME="irish_whiskey"

# Frontend URL (später nach Vercel-Deployment)
flyctl secrets set FRONTEND_URL="https://ihr-frontend.vercel.app"

# E-Mail-Konfiguration
flyctl secrets set EMAIL_FROM="info@travel-events.de"
flyctl secrets set EMAIL_FROM_NAME="Irish Whiskey Tours"
flyctl secrets set ADMIN_EMAIL="info@travel-events.de"

# Bank-Details
flyctl secrets set BANK_ACCOUNT_HOLDER="M. A. von Arnim"

# CORS (erlaubt alle Origins - später einschränken!)
flyctl secrets set CORS_ORIGINS="*"
```

#### Optional: PayPal (falls Sie PayPal-Integration sofort testen möchten)
```bash
flyctl secrets set PAYPAL_CLIENT_ID="your-paypal-client-id"
flyctl secrets set PAYPAL_SECRET="your-paypal-secret"
```

---

### 4️⃣ Backend deployen

Jetzt können Sie das Backend deployen:

```bash
flyctl deploy
```

Dies wird:
- Das Docker Image mit Python 3.11 bauen
- Die Abhängigkeiten installieren
- Das Image auf Fly.io hochladen
- Ihre App starten

Der Build-Prozess dauert ca. 2-5 Minuten.

---

### 5️⃣ Deployment überprüfen

Nach erfolgreichem Deployment:

```bash
# Status überprüfen
flyctl status

# Logs anzeigen
flyctl logs

# App-URL anzeigen
flyctl info
```

Ihre Backend-URL wird etwa so aussehen:
```
https://irish-whiskey-backend.fly.dev
```

---

### 6️⃣ Health-Check testen

Testen Sie, ob das Backend läuft:

```bash
# Health-Check Endpoint
curl https://irish-whiskey-backend.fly.dev/api/health

# Erwartete Antwort:
# {"status":"healthy","database":"connected"}
```

Wenn Sie `{"status":"healthy","database":"connected"}` sehen, ist alles erfolgreich! 🎉

---

### 7️⃣ Admin-Benutzer erstellen

Erstellen Sie einen Admin-Benutzer für das Dashboard:

```bash
curl -X POST https://irish-whiskey-backend.fly.dev/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{
    "email": "info@travel-events.de",
    "password": "IhrSicheresPasswort123!",
    "first_name": "Admin",
    "last_name": "User"
  }'
```

---

### 8️⃣ Trip-Daten seeden

Fügen Sie die Irish Whiskey Trip-Daten hinzu:

```bash
curl -X POST https://irish-whiskey-backend.fly.dev/api/admin/seed-trip \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <IHR_ADMIN_TOKEN>"
```

(Sie erhalten den Token nach dem Admin-Login)

---

## 🔧 Nützliche Fly.io Befehle

```bash
# Logs in Echtzeit anzeigen
flyctl logs -a irish-whiskey-backend

# SSH in die VM
flyctl ssh console

# Secrets anzeigen (Namen, keine Werte)
flyctl secrets list

# Secret aktualisieren
flyctl secrets set KEY="new-value"

# App neu starten
flyctl apps restart irish-whiskey-backend

# Skalierung anpassen (falls mehr Ressourcen nötig)
flyctl scale vm shared-cpu-1x --memory 512
```

---

## 🐛 Troubleshooting

### Problem: "Could not resolve host"
→ Überprüfen Sie Ihre MongoDB Atlas IP-Whitelist. Fügen Sie `0.0.0.0/0` hinzu, um alle IPs zuzulassen (oder die Fly.io IP-Range).

### Problem: "Database connection failed"
→ Überprüfen Sie Ihren `MONGO_URL` Secret:
```bash
flyctl secrets list
```

### Problem: "502 Bad Gateway"
→ Überprüfen Sie die Logs:
```bash
flyctl logs
```

### Problem: "App keeps restarting"
→ Checken Sie, ob alle erforderlichen Secrets gesetzt sind:
```bash
flyctl secrets list
```

---

## ✅ Nächste Schritte nach erfolgreichem Deployment

1. **Frontend auf Vercel deployen** und `REACT_APP_BACKEND_URL` auf die Fly.io URL setzen
2. **CORS aktualisieren** in den Fly.io Secrets (Frontend-URL statt `*`)
3. **Frontend UI-Transformation** (Irish Whiskey Branding)
4. **E2E-Tests** durchführen

---

## 📞 Benötigen Sie Hilfe?

Falls Sie auf Probleme stoßen:
1. Teilen Sie die Fly.io Logs mit: `flyctl logs`
2. Teilen Sie die Ausgabe von: `flyctl status`
3. Beschreiben Sie den Fehler genau

Viel Erfolg! 🍀
