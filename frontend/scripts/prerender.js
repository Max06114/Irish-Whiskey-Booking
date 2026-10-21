const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const indexPath = path.join(buildDir, 'index.html');

console.log('🚀 Starting lightweight pre-rendering...');

// Read the built index.html
let html = fs.readFileSync(indexPath, 'utf8');

// Inject basic meta tags and content into the HTML for better SEO
// This is a lightweight solution that doesn't require Puppeteer

// Update robots meta tag
html = html.replace(
  '<meta name="robots" content="noindex, nofollow"/>',
  '<meta name="robots" content="index, follow"/>'
);

// Add preconnect for better performance
if (!html.includes('preconnect')) {
  html = html.replace(
    '</head>',
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></head>'
  );
}

// Replace noscript content with something more informative
html = html.replace(
  '<noscript>You need to enable JavaScript to run this app.</noscript>',
  `<noscript>
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h1>Irish Whiskey Entdeckungsreise | 8 Tage Irland Tour</h1>
      <p>Erleben Sie 7 einzigartige Whiskey-Tastings auf unserer 8-tägigen Rundreise durch Irland.</p>
      <p><strong>Von Dublin bis Galway</strong> - authentische Destillerien, traditionelle Pubs und die grüne Insel.</p>
      <p><strong>Kleine Gruppe</strong>: Max. 20 Teilnehmer</p>
      <p><strong>Termin</strong>: 18. – 25. Mai 2027</p>
      <p>Bitte aktivieren Sie JavaScript, um die vollständige Buchungsseite zu sehen.</p>
      <p>Kontakt: <a href="mailto:info@travel-events.de">info@travel-events.de</a></p>
    </div>
  </noscript>`
);

// Add structured data directly in the HTML
const structuredData = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "name": "Irish Whiskey Natur & Kultur Entdeckungsreise",
  "description": "Erleben Sie 7 einzigartige Whiskey-Tastings auf unserer 8-tägigen Rundreise durch Irland. Von Dublin bis Galway - authentische Destillerien, traditionelle Pubs und die grüne Insel. Kleine Gruppe max. 20 Teilnehmer.",
  "image": "https://irish-whiskey-tour.travel-events.de/images/hero-current.webp",
  "url": "https://irish-whiskey-tour.travel-events.de",
  "provider": {
    "@type": "Organization",
    "name": "Travel Events",
    "url": "https://www.travel-events.de"
  },
  "startDate": "2027-05-18",
  "endDate": "2027-05-25",
  "location": {
    "@type": "Place",
    "name": "Irland",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IE"
    }
  },
  "offers": {
    "@type": "Offer",
    "price": "2600",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
};

// Add structured data script if not present
if (!html.includes('application/ld+json')) {
  html = html.replace(
    '</head>',
    `<script type="application/ld+json">${JSON.stringify(structuredData)}</script></head>`
  );
}

// Write the updated HTML back
fs.writeFileSync(indexPath, html);

console.log('✅ Pre-rendering completed successfully!');
console.log('📦 Updated: index.html');
console.log('🔍 SEO improvements applied:');
console.log('   - Robots meta tag updated to "index, follow"');
console.log('   - Enhanced noscript content for search engines');
console.log('   - Structured data (JSON-LD) added');
