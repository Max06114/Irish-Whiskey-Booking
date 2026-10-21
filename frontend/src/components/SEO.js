import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Irish Whiskey Entdeckungsreise | 8 Tage Irland Tour", 
  description = "Erleben Sie 7 einzigartige Whiskey-Tastings auf unserer 8-tägigen Rundreise durch Irland. Von Dublin bis Galway - authentische Destillerien, traditionelle Pubs und die grüne Insel. Kleine Gruppe max. 20 Teilnehmer.",
  keywords = "Irish Whiskey Tour, Irland Rundreise, Whiskey Tasting, Destillerie Besichtigung, Dublin, Galway, Killarney, Gruppenreise Irland",
  image = "https://irish-whiskey-tour.travel-events.de/images/hero-current.webp",
  url = "https://irish-whiskey-tour.travel-events.de",
  type = "website"
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:site_name" content="Irish Whiskey Entdeckungsreise" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="German" />
      <meta name="author" content="Travel Events" />
      <link rel="canonical" href={url} />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": "Irish Whiskey Natur & Kultur Entdeckungsreise",
          "description": description,
          "image": image,
          "url": url,
          "provider": {
            "@type": "Organization",
            "name": "Travel Events",
            "url": "https://www.travel-events.de"
          },
          "itinerary": {
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Dublin - Ankunft & Temple Bar Tasting"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Pearse Lyons Distillery"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Ahascragh Distillery & Galway"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Kylemore Abbey & Micil Distillery"
              },
              {
                "@type": "ListItem",
                "position": 5,
                "name": "Killarney & Wayward Spirits"
              },
              {
                "@type": "ListItem",
                "position": 6,
                "name": "Dingle Halbinsel & Foxy John's"
              },
              {
                "@type": "ListItem",
                "position": 7,
                "name": "Cobh & Blackwater Distillery"
              },
              {
                "@type": "ListItem",
                "position": 8,
                "name": "Abreise Dublin"
              }
            ]
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
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
