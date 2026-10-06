# ✅ Fly.io Deployment Checkliste

## Vor dem Deployment benötigt:

### 1. MongoDB Atlas Connection String
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```
- [ ] Connection String bereit

### 2. Resend API Key
```
re_xxxxxxxxxxxxx
```
- [ ] API Key bereit
- [ ] Domain verifiziert in Resend (info@travel-events.de)

### 3. JWT Secret generieren
```bash
openssl rand -base64 32
```
- [ ] Secret generiert

---

## Deployment Steps (in Ihrem lokalen Terminal):

```bash
# 1. In backend/ Ordner wechseln
cd /pfad/zu/Irish-Whiskey-Booking/backend

# 2. App erstellen (ohne sofortiges Deployment)
flyctl launch --no-deploy

# 3. Secrets setzen (ERSETZEN SIE DIE WERTE!)
flyctl secrets set MONGO_URL="mongodb+srv://..."
flyctl secrets set JWT_SECRET="<generierter-string>"
flyctl secrets set RESEND_API_KEY="re_..."
flyctl secrets set DB_NAME="irish_whiskey"
flyctl secrets set EMAIL_FROM="info@travel-events.de"
flyctl secrets set EMAIL_FROM_NAME="Irish Whiskey Tours"
flyctl secrets set ADMIN_EMAIL="info@travel-events.de"
flyctl secrets set BANK_ACCOUNT_HOLDER="M. A. von Arnim"
flyctl secrets set CORS_ORIGINS="*"
flyctl secrets set FRONTEND_URL="http://localhost:3000"

# 4. Deployen!
flyctl deploy

# 5. Status prüfen
flyctl status
flyctl logs

# 6. URL merken
flyctl info
# → https://irish-whiskey-backend.fly.dev
```

---

## Nach dem Deployment:

```bash
# 1. Health Check testen
curl https://irish-whiskey-backend.fly.dev/api/health

# 2. Admin erstellen (Browser oder curl)
curl -X POST https://irish-whiskey-backend.fly.dev/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"email":"info@travel-events.de","password":"IhrPasswort123","first_name":"Admin","last_name":"User"}'

# 3. Login testen
curl -X POST https://irish-whiskey-backend.fly.dev/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"info@travel-events.de","password":"IhrPasswort123"}'

# Sie erhalten einen Token zurück!
```

---

## Fertig? ✅

- [ ] Backend ist live
- [ ] Health Check funktioniert
- [ ] Admin-Login funktioniert
- [ ] MongoDB-Verbindung erfolgreich

**Nächster Schritt:** Frontend auf Vercel deployen und `REACT_APP_BACKEND_URL` setzen!
