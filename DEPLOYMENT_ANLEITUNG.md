# 🚀 Automatisches Deployment eingerichtet!

## Was wurde eingerichtet?
- GitHub Actions Workflow für automatisches Backend-Deployment
- Bei jedem Push zu GitHub wird das Backend automatisch auf Fly.io deployt
- Du musst nie wieder `fly deploy` in PowerShell ausführen!

## ⚠️ WICHTIG: Einmalige Einrichtung (5 Minuten)

Du musst **einmal** dein Fly.io Access Token in GitHub hinterlegen:

### Schritt 1: Fly.io Access Token holen
1. Öffne PowerShell auf deinem PC
2. Führe aus: `fly auth token`
3. Kopiere den Token (lange Zeichenkette)

### Schritt 2: Token in GitHub hinterlegen
1. Gehe zu: https://github.com/DEIN-USERNAME/Irish-Whiskey-Booking/settings/secrets/actions
2. Klicke auf **"New repository secret"**
3. Name: `FLY_API_TOKEN`
4. Value: Füge den kopierten Token ein
5. Klicke **"Add secret"**

## ✅ Fertig!

Ab jetzt:
- Klicke hier im Chat auf **"Save to GitHub"**
- GitHub Actions deployt automatisch dein Backend
- Vercel deployt automatisch dein Frontend
- Funktioniert vom Handy & PC! 📱💻

## Wie prüfe ich, ob es funktioniert?
Nach "Save to GitHub":
- Gehe zu: https://github.com/DEIN-USERNAME/Irish-Whiskey-Booking/actions
- Du siehst den Deployment-Status (grüner Haken = erfolgreich)

---

**Du musst das Token nur EINMAL hinterlegen, dann funktioniert alles automatisch!** 🎉
