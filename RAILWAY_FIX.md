## 🚀 Railway Deployment - FINALE ANLEITUNG

### ❌ Problem: Nixpacks pip-Modul nicht gefunden

### ✅ EINFACHSTE LÖSUNG: Railway Settings manuell setzen

**MACHE FOLGENDES IN RAILWAY:**

1. **Service Settings öffnen:**
   - Klicke auf "Irish-Whiskey-Booking" Service
   - Gehe zu **"Settings"** Tab

2. **Service Settings konfigurieren:**
   ```
   Root Directory: backend
   ```

3. **Build Settings:**
   ```
   Install Command: pip install -r requirements.txt
   Build Command: (leer lassen)
   ```

4. **Start Settings:**
   ```
   Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

5. **Environment Variables hinzufügen (Variables Tab):**
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=irish_whiskey_booking
   JWT_SECRET=temp-secret-key
   FRONTEND_URL=http://localhost:3000
   CORS_ORIGINS=*
   ```

6. **Redeploy klicken**

---

### ALTERNATIVE: MongoDB Atlas nutzen

Falls Railway MongoDB nicht funktioniert:

1. **MongoDB Atlas (KOSTENLOS):**
   - Gehe zu: mongodb.com/cloud/atlas
   - Erstelle Free Cluster (M0)
   - Dauert 3-5 Minuten
   - Kopiere Connection String

2. **In Railway Variables:**
   ```
   MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
   ```

---

### 🎯 ERWARTETES RESULTAT:

Railway sollte automatisch:
1. ✅ Python erkennen
2. ✅ requirements.txt installieren
3. ✅ Uvicorn starten
4. ✅ Backend verfügbar auf Railway URL

---

**Falls es IMMER NOCH nicht funktioniert:**
- Sende mir einen Screenshot von deinen Railway Settings
- Ich erstelle eine komplett andere Deployment-Strategie (z.B. Docker)
