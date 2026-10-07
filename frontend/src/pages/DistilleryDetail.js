import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { ArrowLeft, MapPin, Calendar, Wine, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const distilleries = {
  'irish-whiskey-museum': {
    name: 'Irish Whiskey Museum',
    location: 'Dublin',
    day: 1,
    image: 'https://images.pexels.com/photos/31466957/pexels-photo-31466957.jpeg',
    tagline: 'Die dramatische Geschichte des irischen Whiskeys',
    description: `Markenunabhängiges Museum, das die dramatische Geschichte des irischen Whiskeys erzählt – von Mönchen über den Beinahe-Untergang bis zum aktuellen Boom. Die Guides führen mit typisch irischem Humor und großartigem Storytelling durch die verschiedenen Epochen.

Das Museum bietet eine Verkostung mit Blick auf das Trinity College und ist der perfekte Einstieg in die Welt des Irish Whiskey.`,
    highlight: 'Blending Experience',
    highlightDescription: 'Das absolute Highlight ist die "Blending Experience", bei der Besucher ihren eigenen, maßgeschneiderten Blend kreieren und in einer kleinen Flasche mit nach Hause nehmen können. Eine einzigartige Gelegenheit, die Kunst des Whiskey-Blendings selbst zu erleben.',
    features: [
      'Markenunabhängige Geschichte',
      'Guides mit irischem Humor',
      'Tasting mit Trinity College Blick',
      'Eigenen Whiskey-Blend kreieren',
      'Kleine Flasche zum Mitnehmen'
    ]
  },
  'pearse-lyons-distillery': {
    name: 'Pearse Lyons Distillery',
    location: 'Dublin (The Liberties)',
    day: 2,
    image: 'https://images.unsplash.com/photo-1737280188457-80431abb0b09',
    tagline: 'Spektakuläre Brennerei in restaurierter Kirche',
    description: `Eine der ästhetisch spektakulärsten Brennereien Irlands, untergebracht in der wunderschön restaurierten ehemaligen St. James Church mit einer gläsernen Kirchturmspitze.

Die beeindruckenden Brennblasen tragen die liebevollen Namen "Mighty Molly" und "Little Lizzy". Whiskey-Motive zieren die kunstvollen Kirchenfenster und schaffen eine einzigartige Atmosphäre zwischen Tradition und Moderne.`,
    highlight: 'Pearse 7 Years Distiller\'s Choice',
    highlightDescription: 'Mehrfach ausgezeichneter, weicher Blend, gereift in Bourbon-, Sherry- und "Kentucky Bourbon Barrel Ale"-Fässern. Charakterisiert durch elegante Frucht- und Vanillenoten, die perfekt harmonieren.',
    features: [
      'Historische Kirche aus dem 18. Jahrhundert',
      'Gläserne Kirchturmspitze',
      'Brennblasen "Mighty Molly" und "Little Lizzy"',
      'Whiskey-Motive in Kirchenfenstern',
      'Architektonisches Meisterwerk'
    ]
  },
  'temple-bar': {
    name: 'The Temple Bar',
    location: 'Dublin',
    day: 2,
    image: 'https://images.unsplash.com/photo-1765570486735-b4db24a4452b',
    tagline: 'Über 450 Whiskeys in Dublins berühmtestem Pub',
    description: `Der berühmte Pub mit der ikonischen roten Fassade bietet eine beeindruckende Auswahl von über 450 verschiedenen Whiskeys und Live-Musik in authentischer Atmosphäre.

Für eine ruhigere und exklusivere Erfahrung gibt es nebenan ein spezielles Whiskeygeschäft, wo im Keller eigene Fässer lagern. Hier finden geführte Tastings in deutlich ruhigerer Atmosphäre statt – perfekt für Kenner und Genießer.`,
    highlight: 'The Temple Bar Signature Blend',
    highlightDescription: 'Exklusiv für den Pub kreierter Blend, gereift in Bourbon- und Portweinfässern. Weich im Geschmack mit fruchtigen Noten von Beeren und Pflaumen, Honigsüße und Vanille. Ein perfekter Blend, der die Essenz von Dublin einfängt.',
    features: [
      'Über 450 verschiedene Whiskeys',
      'Ikonische rote Fassade',
      'Live-Musik täglich',
      'Exklusives Whiskeygeschäft nebenan',
      'Geführte Tastings im Keller',
      'Eigene Fass-Lagerung'
    ]
  },
  'ahascragh-distillery': {
    name: 'Ahascragh Distillery',
    location: 'Galway County',
    day: 3,
    image: 'https://images.unsplash.com/photo-1737280188457-80431abb0b09',
    tagline: 'Irlands erste Zero-Emissions Öko-Brennerei',
    description: `Irlands erste zertifizierte "Zero Energy Emissions"-Öko-Brennerei vereint Tradition mit modernster, klimaneutraler Technologie. Die Brennerei ist in einer liebevoll restaurierten Kornmühle aus dem 19. Jahrhundert untergebracht.

Hier verschmelzen Umweltschutz und jahrhundertealtes Handwerk zu einem einzigartigen Konzept. Ein Ort, der zeigt, dass nachhaltige Whiskey-Produktion ohne Kompromisse bei der Qualität möglich ist.`,
    highlight: 'Clan Colla 11 Year Old',
    highlightDescription: 'Komplexer, tiefgründiger Blend, gereift in Ex-Bourbon-, Oloroso-Sherry- und leicht getorften Fässern. Charakterisiert durch feine Honigsüße, lebendige Zitrusnoten und einen dezenten Hauch von Torfrauch. Ein Whiskey mit Tiefe und Charakter.',
    features: [
      'Erste Zero-Emissions-Brennerei Irlands',
      'Restaurierte Kornmühle (19. Jh.)',
      'Klimaneutrale Produktion',
      'Moderne Öko-Technologie',
      'Nachhaltiges Handwerk'
    ]
  },
  'micil-distillery': {
    name: 'Micil Distillery',
    location: 'Galway',
    day: 4,
    image: 'https://images.pexels.com/photos/31466957/pexels-photo-31466957.jpeg',
    tagline: 'Familienbetrieb seit 6 Generationen - Poitín-Spezialisten',
    description: `Die erste legale Brennerei in Galway seit über 100 Jahren wird von einer Familie betrieben, die seit sechs Generationen nach alten, geheimen Rezepten destilliert – früher illegal in den abgelegenen Hügeln von Connemara.

Der Fokus liegt auf Poitín, dem "Original Spirit" Irlands, und charakterstarkem Whiskey. Die Familie bewahrt jahrhundertealte Traditionen und gibt ihre Kunst von Generation zu Generation weiter.`,
    highlight: 'Micil Heritage Poitín',
    highlightDescription: 'Der authentische "Original Spirit" Irlands, destilliert aus gemälzter Gerste und Hafer. Mit Torf vom eigenen Familienbauernhof geräuchert, entwickelt er einen einzigartigen rauchig-süßen Charakter. Ein Stück lebendige irische Geschichte im Glas.',
    features: [
      'Erste legale Brennerei Galways seit 100 Jahren',
      'Familie destilliert seit 6 Generationen',
      'Historische Rezepte aus Connemara',
      'Poitín-Spezialisten',
      'Torf vom eigenen Bauernhof',
      'Authentische Familientradition'
    ]
  },
  'the-liberator-distillery': {
    name: 'The Liberator Distillery',
    location: 'Killarney (Lakeview Estate)',
    day: 5,
    image: 'https://images.unsplash.com/photo-1633938127384-ea2ede12fee2',
    tagline: 'Private Führung auf historischem Anwesen',
    description: `Ein besonderes Privileg: Maurice O'Connell empfängt Besucher persönlich auf dem geschichtsträchtigen Lakeview Estate an den malerischen Seen von Killarney.

Die Familie arbeitet als traditionsreiche "Bonder" – sie kaufen sorgfältig ausgewählte Rohbrände ein und veredeln diese in einem 300 Jahre alten Steinhaus. Auf dem Anwesen wird bereits eigene Gerste für zukünftigen "Grain to Glass"-Whiskey angebaut. Eine Reise zu den Wurzeln des Whiskey-Handwerks.`,
    highlight: 'The Liberator Port Cask Finished Whiskey',
    highlightDescription: 'Die Whiskeys erhalten ihr exquisites Finish in frischen Tawny-Portweinfässern, die direkt aus Portugal importiert werden. Das Ergebnis ist extrem fruchtig, vollmundig und elegant – ein Whiskey von außergewöhnlicher Qualität und Charakter.',
    features: [
      'Private Führung mit Maurice O\'Connell',
      'Geschichtsträchtiges Lakeview Estate',
      'Traditionsreiche Bonder-Familie',
      '300 Jahre altes Steinhaus',
      'Eigener Gersten-Anbau',
      'Direktimport von Port-Fässern'
    ]
  },
  'blackwater-distillery': {
    name: 'Blackwater Distillery',
    location: 'Waterford (Ballyduff)',
    day: 7,
    image: 'https://images.pexels.com/photos/31586052/pexels-photo-31586052.jpeg',
    tagline: 'Experimentelle Micro-Destillerie am Blackwater River',
    description: `Eine Micro-Destillerie und echter Geheimtipp für Individualisten, untergebracht in einem liebevoll umgebauten Eisenwarenladen aus den 1950er Jahren, direkt am Ufer des Blackwater River.

Das innovative Team um Peter Mulryan arbeitet experimentell mit historischen Pot-Still-Rezepturen und lokalen Getreidesorten. Hier wird Whiskey-Geschichte neu geschrieben – mit Respekt vor der Tradition und Mut zur Innovation.`,
    highlight: 'Velvet Cap Irish Whiskey',
    highlightDescription: 'Exzellente Small-Batch-Mischung, gereift in einer einzigartigen Kombination aus Bourbon-, Portwein- und Stout-Rye-Fässern. Charakterisiert durch samtige Noten von Vanille und reifen Pflaumen. Für historische Liebhaber: Unbedingt nach dem "Dirtgrain Manifesto" fragen – einer Hommage an alte irische Destillations-Philosophien.',
    features: [
      'Micro-Destillerie in historischem Eisenwarenladen',
      'Lage am Blackwater River',
      'Experimentelle Pot-Still-Rezepturen',
      'Lokale Getreidesorten',
      'Small-Batch-Produktion',
      'Innovative Fass-Kombinationen',
      '"Dirtgrain Manifesto" Philosophie'
    ]
  }
};

const DistilleryDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const distillery = distilleries[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!distillery) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#1D1D1D] mb-4">Destillerie nicht gefunden</h1>
          <Button onClick={() => navigate('/')} className="bg-[#74CF6C] hover:bg-[#5eb556]">
            Zurück zur Übersicht
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      {/* Hero Image */}
      <div className="relative h-[60vh] min-h-[400px]">
        <img
          src={distillery.image}
          alt={distillery.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/80 via-[#1D1D1D]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-[#74CF6C] text-sm font-semibold tracking-wider uppercase mb-2">
                Tag {distillery.day}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
                {distillery.name}
              </h1>
              <p className="text-xl text-white/90 mb-4">{distillery.tagline}</p>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {distillery.location}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Übersicht
        </Button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-2xl font-bold text-[#1D1D1D] mb-4">Über die Brennerei</h2>
              {distillery.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-[#5A544C] leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Features */}
            <div className="mt-12">
              <h3 className="font-serif text-xl font-bold text-[#1D1D1D] mb-6">Highlights</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {distillery.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-[#E6DEC8]">
                    <Wine className="w-5 h-5 text-[#74CF6C] flex-shrink-0 mt-0.5" />
                    <span className="text-[#5A544C]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-[#E6DEC8] sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-[#74CF6C]" />
                <h3 className="font-bold text-[#1D1D1D]">Spitzenprodukt</h3>
              </div>
              
              <h4 className="font-serif text-xl font-bold text-[#74CF6C] mb-3">
                {distillery.highlight}
              </h4>
              
              <p className="text-sm text-[#5A544C] leading-relaxed mb-6">
                {distillery.highlightDescription}
              </p>

              <div className="pt-6 border-t border-[#E6DEC8]">
                <div className="flex items-center gap-2 text-sm text-[#5A544C] mb-2">
                  <Calendar className="w-4 h-4 text-[#74CF6C]" />
                  <span>Besuch am Tag {distillery.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#5A544C]">
                  <MapPin className="w-4 h-4 text-[#74CF6C]" />
                  <span>{distillery.location}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/booking')}
                className="w-full mt-6 bg-[#74CF6C] hover:bg-[#5eb556] text-white"
              >
                Reise jetzt buchen
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DistilleryDetail;