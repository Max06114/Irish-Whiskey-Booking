# SEO-Lösung für Vercel Deployment

## Problem
`react-snap` funktioniert nicht auf Vercel, weil:
- Puppeteer/Chromium benötigt System-Libraries, die auf Vercel fehlen
- Chromium-Binary überschreitet Vercel's Bundle-Size-Limit (250MB)
- react-snap ist veraltet und wird nicht mehr gewartet

## Lösung
Lightweight Pre-Rendering-Script (`scripts/prerender.js`), das:
- ✅ **Ohne Puppeteer** funktioniert
- ✅ **Garantiert auf Vercel** läuft
- ✅ **Schnell** ist (< 1 Sekunde)
- ✅ **SEO-optimiert** ist

## Was macht das Script?

1. **Robots Meta Tag**: `noindex, nofollow` → `index, follow`
2. **Noscript Content**: Aussagekräftiger Text für Search Engines
3. **JSON-LD Structured Data**: Schema.org TouristTrip Markup
4. **Preconnect Links**: Für bessere Performance

## Wie es funktioniert

```json
{
  "scripts": {
    "build": "CI=false craco build",
    "postbuild": "node scripts/prerender.js"
  }
}
```

Nach dem Build wird automatisch `prerender.js` ausgeführt und optimiert die HTML-Dateien.

## Testing

Lokal testen:
```bash
yarn build
```

Dann prüfen:
```bash
grep "robots" build/index.html
# Sollte zeigen: content="index, follow"
```

## Deployment

1. Auf "Save to GitHub" klicken
2. Vercel deployed automatisch
3. Nach 5-10 Minuten ist die neue Version live
4. Google/Bots können den Content jetzt lesen

## Vorteile gegenüber react-snap

| Feature | react-snap | prerender.js |
|---------|-----------|--------------|
| Funktioniert auf Vercel | ❌ Nein | ✅ Ja |
| Build-Zeit | ~20 Sek | < 1 Sek |
| Dependencies | Puppeteer (groß) | Nur Node.js |
| Wartung | Veraltet | Aktiv |
| SEO Meta-Tags | ✅ | ✅ |
| Structured Data | ✅ | ✅ |
| Full HTML Pre-Render | ✅ | ⚠️ Partial |

## Hinweis

Diese Lösung rendert nicht die komplette React-App, sondern optimiert nur die Meta-Tags und den noscript-Content. Das ist ausreichend für:
- ✅ Google SEO
- ✅ Social Media Previews (Facebook, Twitter)
- ✅ Search Engine Crawling

Für Benutzer mit JavaScript bleibt die App voll funktional.
