import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DayCard from '../components/DayCard';
import LazyImage from '../components/LazyImage';
import { Button } from '../components/ui/button';
import { Calendar, Users, MapPin, Wine, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const fadeInUpTransition = { duration: 0.4, ease: "easeOut" };

const HomePage = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`${API}/trips`);
        if (res.data && res.data.length > 0) {
          setTrip(res.data[0]);
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, []);

  // Handle hash navigation (e.g., /#distilleries)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74CF6C] mx-auto mb-4"></div>
          <p className="text-[#1D1D1D]">Reise wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center" data-testid="hero-section">
        <div className="absolute inset-0 z-0">
          <picture>
            <source srcSet="/images/hero-current.webp" type="image/webp" />
            <img
              src="/images/hero-current.webp"
              alt="Dramatic Irish Coastal Landscape"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </picture>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUpTransition}
            className="max-w-3xl bg-[#2C1B14]/40 backdrop-blur-sm p-8 rounded-2xl"
          >
            <span className="inline-block text-[#74CF6C] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Exklusive Gruppenreise Mai 2027
            </span>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight">
              Irlands Seele schmecken: Whiskey, unberührte Natur & lebendige Kultur
            </h1>
            
            <p className="text-xl text-white/90 mb-8">
              Eine persönliche 8-tägige Genuss- und Entdeckungsreise durch Dublin, Galway, Kerry und die wilden Küsten Irlands.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {/* Box 1: Datum */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <MapPin className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Termin</div>
                <div className="text-sm font-semibold text-white">18. – 25. Mai 2027</div>
              </div>
              
              {/* Box 2: Reisedauer */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <Calendar className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Reisedauer</div>
                <div className="text-sm font-semibold text-white">7 Nächte / 8 Tage</div>
              </div>
              
              {/* Box 3: Mareike Spitzer */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <Users className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Reiseleitung</div>
                <div className="text-sm font-semibold text-white">Mareike Spitzer</div>
                <div className="text-xs text-white/60 mt-1">Irish-Whiskeys.de</div>
              </div>
              
              {/* Box 4: Brennereien & Tastings */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <Wine className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Programm</div>
                <div className="text-sm font-semibold text-white">7 Brennereien & Tastings</div>
              </div>
              
              {/* Box 5: Gutschein */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <Check className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Bonus</div>
                <div className="text-sm font-semibold text-white">50€ Gutschein</div>
                <div className="text-xs text-white/60 mt-1">Irish-Whiskeys.de</div>
              </div>
              
              {/* Box 6: Teilnehmer */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <Users className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Teilnehmer</div>
                <div className="text-sm font-semibold text-white">Max. 20 Personen</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate('/booking')}
                className="bg-[#74CF6C] hover:bg-[#5eb556] text-white px-8 py-6 text-lg"
                data-testid="hero-book-now-button"
              >
                Reise jetzt buchen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => scrollToSection('itinerary')}
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                data-testid="hero-itinerary-button"
              >
                Programm (Tag 1–8) ansehen
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="overview" className="py-20 bg-white" data-testid="intro-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D1D1D] mb-6">
              Herzlich Willkommen bei Irish Whiskeys
            </h2>
            <p className="text-lg text-[#5A544C] leading-relaxed">
              Unsere Mission ist es, Ihnen die grüne Insel und deren Whiskeys näher zu bringen. 
              Auf dieser exklusiven 8-tägigen Reise entdecken Sie Irlands faszinierende Whiskey-Kultur, 
              atemberaubende Landschaften und lebendige Traditionen – von Dublin über Connemara bis in den Süden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Itinerary Section */}
      <section className="py-20 bg-[#FDFBF7]" data-testid="itinerary-section" id="itinerary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D1D1D] mb-4">
              Ihr 8-Tage-Reiseprogramm
            </h2>
            <p className="text-[#5A544C] max-w-2xl mx-auto">
              Eine sorgfältig zusammengestellte Reise durch Irlands Whiskey-Kultur, Natur und Geschichte
            </p>
          </div>

          <div className="space-y-6">
            {/* Day 1 */}
            <DayCard
              title="Tag 1, Di. 18. Mai – Ankunft in Dublin & erstes Whiskey-Tasting"
              description={<>
                Begrüßung am Nachmittag durch Mareike Spitzer und Ihr Reiseleiter Max von Arnim, gefolgt von einem Besuch des Temple Bar Whiskey Reserve im Herzen Dublins, mit über 450 Whiskey-Sorten im Regal. Bei diesem ersten Whiskey-Tasting tauchen Sie ein in die spannende Welt des irischen Whiskeys. Der erste Tag klingt mit einem gemeinsamen Abendessen aus, bei dem Sie Ihre Mitreisenden kennenlernen.
              </>}
              image="/images/dublin-arrival.jpg"
              alt="Ankunft Dublin"
              accommodation="Übernachtung: Dublin"
              dinner={true}
            />

            {/* Day 2 */}
            <DayCard
              title="Tag 2, Mi. 19. Mai – Dublin & Pearse Lyons Distillery"
              description="Nach einem Stadtrundgang von Dublin besuchen Sie die spektakuläre Pearse Lyons Distillery. Diese einzigartige Brennerei ist in einer liebevoll restaurierten, 800 Jahre alten Kirche mit gläserner Turmspitze untergebracht. Danach ist Freizeit für eine Mittagspause und eigene Erkundungen, wie zum Beispiel das Irish Whiskey Museum, das Guinness Store House oder das Book of Kells etc."
              image="/images/pearse-lyons.jpg"
              alt="Pearse Lyons Distillery"
              distillery="Destillerie: Pearse Lyons"
              accommodation="Übernachtung: Dublin"
              dinner={false}
            />

            {/* Day 3 */}
            <DayCard
              title="Tag 3, Do. 20. Mai – Von Dublin nach Galway"
              description="Die Reise führt westwärts zur innovativen Ahascragh Distillery, Irlands erster klimaneutraler Brennerei mit &quot;Zero Energy Emissions&quot;. In einer restaurierten Kornmühle aus dem 19. Jahrhundert erleben Sie modernste Destillationstechnik und genießen ein Whiskey, Cheese & Chocolate Tasting. Anschließend Weiterfahrt nach Galway, wo Sie am Abend durch die bunte, lebendige Stadt bummeln."
              image="/images/ahascragh.jpg"
              alt="Ahascragh Distillery"
              distillery="Destillerie: Ahascragh"
              accommodation="Übernachtung: Galway"
              dinner={true}
            />

            {/* Day 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-72">
                  <img
                    src="/images/micil.jpg"
                    alt="Micil Distillery"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="mb-3">
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Tag 4, Fr. 21. Mai – Connemara & Micil Distillery</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Ein Tag voller Naturschönheiten: Entdecken Sie den Killary Harbour, Irlands einzigen Fjord, und die märchenhafte Kylemore Abbey mit ihren viktorianischen Gärten. Am Nachmittag besuchen Sie die Micil Distillery in Salthill – die erste legale Brennerei Galways seit über 100 Jahren. Die Familie destilliert seit sechs Generationen traditionellen Poitín, den Sie bei einem authentischen Tasting probieren.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🥃 Destillerie: Micil · 🏨 Übernachtung: Galway</div>
                </div>
              </div>
            </motion.div>

            {/* Day 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-72">
                  <img
                    src="/images/liberator.jpg"
                    alt="The Liberator Distillery"
                    className="w-full h-full object-cover"
                   loading="lazy" />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="mb-3">
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Tag 5, Sa. 22. Mai – Von Galway nach Killarney</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Die malerische Route führt Sie durch Adare, das als Irlands schönstes Dorf gilt, weiter zu den prächtigen Gärten von Muckross House und dem romantischen Ross Castle am Lough Leane. Höhepunkt des Tages ist eine private Führung bei Wayward Spirits mit Maurice O'Connell – direkter Nachfahre von Daniel O'Connell, dem "Befreier Irlands" – auf dem geschichtsträchtigen Lakeview Estate direkt an Killarneys Seen.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🥃 Wayward Spirits (The Liberator) · 🏨 Übernachtung: Killarney · 🍽️ Abendessen inkludiert</div>
                </div>
              </div>
            </motion.div>

            {/* Day 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-72">
                  <img
                    src="/images/dingle.webp"
                    alt="Dingle Peninsula"
                    className="w-full h-full object-cover"
                   loading="lazy" />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="mb-3">
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Tag 6, So. 23. Mai – Dingle Peninsula & Whiskey-Verkostung</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Erleben Sie eine der schönsten Küstenstraßen der Welt: Der legendäre Slea Head Drive führt Sie entlang dramatischer Klippen, einsamer Sandstrände und prähistorischer Stätten auf der Dingle-Halbinsel. Bestaunen Sie die Blasket Islands, besuchen Sie das charmante Hafenstädtchen Dingle und genießen Sie die wilde Schönheit dieser gälischsprachigen Region. Am Nachmittag erwartet Sie ein Kerry Whiskey Tasting im traditionsreichen Foxy John's Bar in Dingle.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🥃 Kerry Whiskey Tasting (Foxy John's Bar) · 🏨 Übernachtung: Killarney</div>
                </div>
              </div>
            </motion.div>

            {/* Day 7 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-72">
                  <img
                    src="/images/blackwater.jpg"
                    alt="Blackwater Distillery"
                    className="w-full h-full object-cover"
                   loading="lazy" />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="mb-3">
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Tag 7, Mo. 24. Mai – Cobh & Blackwater Distillery</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Erkunden Sie die farbenfrohe Hafenstadt Cobh mit der imposanten St. Colman's Cathedral und besuchen Sie die bewegende Titanic Experience am letzten Anlaufhafen des Schicksalsschiffs. Am Nachmittag erwartet Sie die experimentelle Blackwater Distillery in einem umgebauten Eisenwarenladen direkt am Fluss, wo Sie innovative Pot-Still-Rezepturen probieren. Anschließend Check-in in Dungarvan.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🥃 Destillerie: Blackwater · 🏨 Übernachtung: Dungarvan · 🍽️ Abendessen inkludiert</div>
                </div>
              </div>
            </motion.div>

            {/* Day 8 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-72">
                  <img
                    src="/images/price-doppelzimmer.jpg"
                    alt="Dublin Airport"
                    className="w-full h-full object-cover"
                   loading="lazy" />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="mb-3">
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Tag 8, Di. 25. Mai – Rückreise</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Nach einem gemütlichen Frühstück heißt es Abschied nehmen von der grünen Insel. Der komfortable Transfer bringt Sie rechtzeitig zum Flughafen Dublin. Sie reisen ab mit einem Koffer voller unvergesslicher Eindrücke, neu gewonnenen Whiskey-Kenntnissen und hoffentlich vielen neuen Freundschaften aus der Gruppe.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">✈️ Transfer Flughafen Dublin</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-[#5A544C] mb-4">
              <strong>Wichtig:</strong> Flug nach Dublin ist nicht im Preis enthalten. Treffpunkt ist am Nachmittag des ersten Tages in Dublin.
            </p>
            <Button
              onClick={() => navigate('/booking')}
              size="lg"
              className="bg-[#74CF6C] hover:bg-[#5eb556] text-white px-12 py-6 text-lg"
            >
              Jetzt Platz auf dieser Reise sichern
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section className="py-20 bg-white" data-testid="hotels-section" id="hotels">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D1D1D] mb-4">
              Ihre Unterkünfte
            </h2>
            <p className="text-[#5A544C] max-w-2xl mx-auto">
              Ausgewählte 3-4 Sterne Hotels in perfekter Lage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Harding Hotel',
                location: 'Dublin (Temple Bar)',
                nights: 2,
                stars: '3',
                description: 'Perfekte Lage, neben Christchurch Cathedral und am Rande des Temple Bar Districts. Es besticht durch seine urige, irische Atmosphäre und bietet mit dem hauseigenen Live-Musik-Pub, guter irischer Küche und herzlicher Gastlichkeit eine authentische Bleibe in Dublin.',
                highlights: ['Perfekte Lage', 'Authentisch Irisch', 'Eigener, berühmter Live-Musik-Pub'],
                headerImage: 'https://irish-whiskey-booking.fly.dev/api/images/53cbb65b-b1ec-46a9-8cf8-8f7260bcb1ce',
                headerImagePosition: 'center 30%',
                galleryImages: [
                  'https://irish-whiskey-booking.fly.dev/api/images/81ed9661-37c1-47a3-a90c-7329fd240da5',
                  'https://irish-whiskey-booking.fly.dev/api/images/3aeef347-3371-4c5e-a90b-1c6d2a77707f',
                  '/images/hotel-dublin-3.webp'
                ]
              },
              {
                name: 'Victoria Hotel Galway',
                location: 'Galway',
                nights: 2,
                stars: '3',
                description: 'Charmantes Boutique-Hotel in ruhiger Seitenstraße direkt am Eyre Square, dem lebendigen Herzstück der Stadt. Verbindet klassischen Komfort mit echter irischer Gastfreundschaft.',
                highlights: ['Unschlagbar zentrale Lage', 'Eyre Square', 'Irische Gastfreundschaft'],
                headerImage: '/images/pearse-lyons-header.jpg',
                galleryImages: [
                  '/images/pearse-lyons-1.jpg',
                  '/images/pearse-lyons-2.jpg',
                  '/images/pearse-lyons-3.jpg'
                ]
              },
              {
                name: 'Castlerosse Park Resort',
                location: 'Killarney',
                nights: 2,
                stars: '4',
                description: 'Traumhaft gelegenes Resort direkt am Ufer des Lough Leane im Herzen des Killarney Nationalparks. Das Anwesen bietet nicht nur erstklassigen Komfort, sondern eine Pool, Wellness und Ruhe um sich etwas Erholung zu gönnen.',
                highlights: ['Direkt am Lough Leane', 'Pool & Wellness', 'Erholung & Ruhe'],
                headerImage: '/images/ahascragh-header.jpg',
                galleryImages: [
                  '/images/ahascragh-1.jpg',
                  '/images/ahascragh-2.jpg',
                  '/images/ahascragh-3.jpg'
                ]
              },
              {
                name: 'The Park Hotel Dungarvan',
                location: 'Dungarvan',
                nights: 1,
                stars: '4',
                description: 'Charmantes Hotel an der malerischen Südküste Irlands in der Grafschaft Waterford. Die Anlage liegt auf einem rund zwei Hektar großen, gepflegten Gartengrundstück mit direktem Blick auf die Mündung des Flusses Colligan.',
                highlights: ['2 Hektar Gartenanlage', 'Blick auf Colligan-Mündung', 'Südküste Waterford'],
                headerImage: '/images/micil-header.jpg',
                galleryImages: [
                  '/images/micil-1.jpg',
                  '/images/micil-2.jpg',
                  '/images/micil-3.jpg'
                ]
              }
            ].map((hotel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden border-4 border-[#74CF6C]/30 hover:border-[#74CF6C] hover:shadow-2xl transition-all duration-300"
              >
                {/* Header Image - schmal und lang */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.headerImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    style={{ objectPosition: hotel.headerImagePosition || (index === 0 ? 'center bottom' : 'center center') }}
                   loading="lazy" />
                  <div className="absolute top-4 right-4 bg-[#74CF6C] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {hotel.nights} {hotel.nights === 1 ? 'Nacht' : 'Nächte'}
                  </div>
                </div>
                
                {/* Hotel Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#74CF6C]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#74CF6C]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1D1D1D] text-base">{hotel.name}</h3>
                      <p className="text-xs text-[#5A544C]">{hotel.location} · {hotel.stars} Sterne</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#5A544C] mb-4 leading-relaxed">
                    {hotel.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.highlights.map((highlight, idx) => (
                      <span key={idx} className="text-xs text-[#74CF6C] bg-[#74CF6C]/5 px-2 py-1 rounded">
                        ✓ {highlight}
                      </span>
                    ))}
                  </div>

                  {/* 3 quadratische Bilder */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {hotel.galleryImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
                        <img
                          src={img}
                          alt={`${hotel.name} ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                         loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Distilleries Section */}
      <section className="py-20 bg-[#FDFBF7]" data-testid="distilleries-section" id="distilleries">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D1D1D] mb-4">
              7 Whiskey-Erlebnisse
            </h2>
            <p className="text-[#5A544C] max-w-2xl mx-auto">
              Exklusive Brennereibesuche mit Führungen und Verkostungen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                slug: 'temple-bar',
                name: 'The Temple Bar', 
                location: 'Dublin', 
                day: 1, 
                teaser: 'Über 450 Whiskeys im berühmten Pub. Geführtes Tasting mit spannenden Einblicken in die irische Whiskey-Kultur.',
                highlight: 'Temple Bar Signature Tasting',
                image: 'https://irish-whiskey-booking.fly.dev/api/images/afa82f2a-aab5-43b9-8084-9806c8f1295a'
              },
              { 
                slug: 'pearse-lyons-distillery',
                name: 'Pearse Lyons Distillery', 
                location: 'Dublin (The Liberties)', 
                day: 2, 
                teaser: 'Ästhetisch spektakuläre Brennerei in wunderschön restaurierter Kirche mit gläserner Turmspitze.',
                highlight: 'Pearse 7 Years Distiller\'s Choice',
                image: '/images/highlight-2.jpg'
              },
              { 
                slug: 'ahascragh-distillery',
                name: 'Ahascragh Distillery', 
                location: 'Galway County', 
                day: 3, 
                teaser: 'Irlands erste "Zero Energy Emissions" Öko-Brennerei in restaurierter Kornmühle aus dem 19. Jh.',
                highlight: 'Clan Colla 11 Year Old',
                image: '/images/highlight-3.jpg'
              },
              { 
                slug: 'micil-distillery',
                name: 'Micil Distillery', 
                location: 'Galway', 
                day: 4, 
                teaser: 'Erste legale Brennerei Galways seit 100 Jahren. Familie destilliert seit 6 Generationen Poitín.',
                highlight: 'Micil Heritage Poitín',
                image: '/images/highlight-4.jpg'
              },
              { 
                slug: 'the-liberator-distillery',
                name: 'The Liberator by Wayward Spirits', 
                location: 'Killarney (Lakeview Estate)', 
                day: 5, 
                teaser: 'Private Führung mit Maurice O\'Connell, Nachfahre des "Befreiers" Daniel O\'Connell. Wayward Spirits ist ein traditionsreicher Bonder.',
                highlight: 'Port Cask Finished Whiskey',
                image: '/images/liberator.jpg'
              },
              { 
                slug: 'foxy-johns-bar',
                name: 'Kerry Whiskey Tasting', 
                location: 'Dingle (Foxy John\'s Bar)', 
                day: 6, 
                teaser: 'Authentisches Whiskey-Tasting in der legendären Foxy John\'s Bar – einzigartige Mischung aus Pub und Eisenwarenladen im Herzen von Dingle.',
                highlight: 'Kerry Whiskey Selection',
                image: '/images/foxy-johns-detail.jpg'
              },
              { 
                slug: 'blackwater-distillery',
                name: 'Blackwater Distillery', 
                location: 'Waterford (Ballyduff)', 
                day: 7, 
                teaser: 'Micro-Destillerie in umgebautem Eisenwarenladen. Experimentell mit historischen Pot-Still-Rezepturen.',
                highlight: 'Velvet Cap Irish Whiskey',
                image: '/images/highlight-5.jpg'
              }
            ].map((distillery, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/distillery/${distillery.slug}`)}
                className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg hover:border-[#74CF6C] transition-all cursor-pointer group"
              >
                {/* Image Header */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={distillery.image} 
                    alt={distillery.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                   loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 right-3 text-xs font-semibold text-white bg-[#74CF6C] px-2 py-1 rounded">
                    Tag {distillery.day}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-[#1D1D1D] mb-1 text-base group-hover:text-[#74CF6C] transition-colors">{distillery.name}</h3>
                  <p className="text-xs text-[#5A544C] mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {distillery.location}
                  </p>
                  <p className="text-sm text-[#5A544C] mb-3 leading-relaxed">{distillery.teaser}</p>
                  <div className="pt-3 border-t border-[#E6DEC8] mt-3">
                    <p className="text-xs font-medium text-[#74CF6C] flex items-center justify-between">
                      <span>⭐ {distillery.highlight}</span>
                      <span className="text-[#74CF6C] group-hover:translate-x-1 transition-transform">→</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white" data-testid="pricing-section" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D1D1D] mb-4">
              Leistungen & Preise
            </h2>
            <p className="text-[#5A544C] max-w-2xl mx-auto">
              Genießen Sie eine sorgenfreie Reise mit allem inklusive
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div 
              onClick={() => navigate('/booking')}
              className="bg-white rounded-xl p-8 border border-[#E6DEC8] hover:shadow-lg hover:border-[#74CF6C] transition-all cursor-pointer"
            >
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">Doppelzimmer</h3>
              <div className="text-3xl font-bold text-[#74CF6C] mb-4">€ 2.600,-</div>
              <p className="text-sm text-[#5A544C]">Pro Person im Doppelzimmer oder Twin</p>
            </div>
            
            <div 
              onClick={() => navigate('/booking')}
              className="bg-white rounded-xl p-8 border-2 border-[#74CF6C] hover:shadow-lg transition-all cursor-pointer relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#74CF6C] text-white text-xs px-4 py-1 rounded-full">
                Preistipp für Einzelreisende
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">Halbes Zweibettzimmer</h3>
              <div className="text-3xl font-bold text-[#74CF6C] mb-4">€ 2.600,-</div>
              <p className="text-sm text-[#5A544C]">Mit Zimmerpartner-Zuteilung</p>
            </div>
            
            <div 
              onClick={() => navigate('/booking')}
              className="bg-white rounded-xl p-8 border border-[#E6DEC8] hover:shadow-lg hover:border-[#74CF6C] transition-all cursor-pointer"
            >
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">Einzelzimmer</h3>
              <div className="text-3xl font-bold text-[#74CF6C] mb-4">€ 3.050,-</div>
              <p className="text-sm text-[#5A544C]">Inkl. € 450,- Einzelzimmerzuschlag</p>
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-xl p-8 border border-[#E6DEC8]">
            <h3 className="text-xl font-bold text-[#1D1D1D] mb-6">Im Reisepreis enthalten:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Begleitung und Moderation Mareike Spitzer (Irish-Whiskeys.de)',
                '7 Whiskey-Erlebnisse & Tastings',
                'Kleine Gruppe max. 20 Teilnehmer',
                '7 Übernachtungen in 3-4 Sterne Hotels',
                'Täglich Frühstück',
                '4 x Abendessen',
                'Alle Transfers im Reisebus',
                'Reiseleitung Max von Arnim',
                'Eintritte (Kylemore Abbey, Muckross House, Titanic Experience Cobh u.a.)',
                '50€ Gutschein bei Irish-Whiskeys.de'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#74CF6C] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1D1D1D]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-[#5A544C] mb-4">
              Anzahlung: 25% bei Buchung · Restzahlung: 6 Wochen vor Reisebeginn
            </p>
            <Button
              onClick={() => navigate('/booking')}
              size="lg"
              className="bg-[#74CF6C] hover:bg-[#5eb556] text-white px-12 py-6 text-lg"
            >
              Jetzt Platz sichern
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
