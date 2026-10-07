import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Calendar, Users, MapPin, Wine, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeInUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };
const fadeInUpTransition = { duration: 0.8 };

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
          <img
            src="https://images.unsplash.com/photo-1632664918986-3334b1c3f85f"
            alt="Dramatic Irish Coastal Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C1B14]/80 via-[#2C1B14]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUpTransition}
            className="max-w-3xl"
          >
            <span className="inline-block text-[#74CF6C] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Exklusive Gruppenreise · 18. – 25. Mai 2027 · Max. 20 Gäste
            </span>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight">
              Irlands Seele schmecken: Whiskey, unberührte Natur & lebendige Kultur
            </h1>
            
            <p className="text-xl text-white/90 mb-4">
              Eine persönliche 8-tägige Genuss- und Entdeckungsreise durch Dublin, Galway, Kerry und die wilden Küsten Irlands.
            </p>
            
            <p className="text-white/70 mb-8 max-w-2xl">
              Begleitet von Whiskeyspezialistin <strong>Mareike Spitzer</strong> (Irish-Whiskeys.de) und Reiseleiter <strong>Max von Arnim</strong> (Travel Events).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <Calendar className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Reisedauer</div>
                <div className="text-sm font-semibold text-white">8 Tage / 7 Nächte</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <Users className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Teilnehmer</div>
                <div className="text-sm font-semibold text-white">Max. 20 Personen</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <Wine className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Brennereien</div>
                <div className="text-sm font-semibold text-white">6 Exklusive Besuche</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <MapPin className="w-5 h-5 text-[#74CF6C] mb-2" />
                <div className="text-xs text-white/60">Termin</div>
                <div className="text-sm font-semibold text-white">18. – 25. Mai 2027</div>
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
              Unsere Mission ist es, Ihnen die grüne Insel und deren Spirituosen näher zu bringen. 
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
              Eine sorgfältig kuratierte Reise durch Irlands Whiskey-Kultur, Natur und Geschichte
            </p>
          </div>

          <div className="space-y-6">
            {/* Day 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-72">
                  <img
                    src="https://irish-whiskey-booking.fly.dev/api/images/77d88d5b-10b7-4547-bb50-5e5c56f7425a"
                    alt="Ankunft Dublin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">1</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Ankunft in Dublin</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Begrüßung am Nachmittag durch Mareike Spitzer und Max von Arnim, gefolgt von einem Besuch des Irish Whiskey Museum im Herzen Dublins. Dort tauchen Sie ein in die dramatische Geschichte des irischen Whiskeys und haben die Möglichkeit, Ihren eigenen Blend zu kreieren. Der erste Tag klingt mit einem gemeinsamen Abendessen aus, bei dem Sie Ihre Mitreisenden kennenlernen.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🏨 Übernachtung: Dublin</div>
                </div>
              </div>
            </motion.div>

            {/* Day 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-72">
                  <img
                    src="https://irish-whiskey-booking.fly.dev/api/images/8b8a3efd-0995-4ff3-a4f0-098f59ff03b0"
                    alt="Pearse Lyons Distillery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">2</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Dublin & Pearse Lyons Distillery</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Nach einem ausführlichen Stadtrundgang durch Dublin mit Trinity College und dem bunten Temple Bar Viertel besuchen Sie die spektakuläre Pearse Lyons Distillery. Diese einzigartige Brennerei ist in einer liebevoll restaurierten, 800 Jahre alten Kirche mit gläserner Turmspitze untergebracht. Am Abend erwartet Sie ein geführtes Whiskey-Tasting in einem traditionellen Pub in Temple Bar.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🥃 Destillerie: Pearse Lyons · 🏨 Übernachtung: Dublin</div>
                </div>
              </div>
            </motion.div>

            {/* Day 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 h-72">
                  <img
                    src="https://irish-whiskey-booking.fly.dev/api/images/1c600c5a-4218-4470-a129-3ed39f1af10d"
                    alt="Ahascragh Distillery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">3</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Von Dublin nach Galway</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Die Reise führt westwärts zur innovativen Ahascragh Distillery, Irlands erster klimaneutraler Brennerei mit "Zero Energy Emissions". In einer restaurierten Kornmühle aus dem 19. Jahrhundert erleben Sie modernste Destillationstechnik und genießen ein gemütliches Lunch im hauseigenen Café. Anschließend Weiterfahrt nach Galway, wo Sie am Abend durch die bunte, lebendige Stadt bummeln.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🥃 Destillerie: Ahascragh · 🏨 Übernachtung: Galway</div>
                </div>
              </div>
            </motion.div>

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
                    src="https://irish-whiskey-booking.fly.dev/api/images/dd70b422-6eac-40d0-aa39-be12b347952b"
                    alt="Micil Distillery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">4</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Connemara & Micil Distillery</h3>
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
                    src="https://irish-whiskey-booking.fly.dev/api/images/94d5f24e-c7fc-471d-892f-140319e7ab79"
                    alt="The Liberator Distillery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">5</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Von Galway nach Killarney</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Die malerische Route führt Sie durch Adare, das als Irlands schönstes Dorf gilt, weiter zu den prächtigen Gärten von Muckross House und dem romantischen Ross Castle am Lough Leane. Höhepunkt des Tages ist eine private Führung durch The Liberator Distillery mit Maurice O'Connell höchstpersönlich auf dem geschichtsträchtigen Familien-Anwesen direkt an Killarneys Seen.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🥃 Destillerie: The Liberator · 🏨 Übernachtung: Killarney</div>
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
                    src="https://irish-whiskey-booking.fly.dev/api/images/7e0492ba-db18-4f56-99e9-2768d1038917"
                    alt="Ring of Kerry"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">6</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Derrynane Bay & Ring of Kerry</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Eine spektakuläre Panoramafahrt entlang des berühmten Ring of Kerry erwartet Sie: Bestaunen Sie das uralte Cahergal Ringfort, das malerische Küstendorf Waterville und den traumhaften Derrynane Beach mit seinem türkisfarbenen Wasser. Weiter geht es nach Kenmare mit seinem mystischen Steinkreis und dem atemberaubenden Ladies View Aussichtspunkt über die drei Seen von Killarney.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🏞️ Natur & Kultur · 🏨 Übernachtung: Killarney</div>
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
                    src="https://irish-whiskey-booking.fly.dev/api/images/927c83ec-2926-494d-835c-662a2833c14c"
                    alt="Blackwater Distillery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">7</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Cobh & Blackwater Distillery</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3 leading-relaxed">
                    Erkunden Sie die farbenfrohe Hafenstadt Cobh mit der imposanten St. Colman's Cathedral und besuchen Sie die bewegende Titanic Experience am letzten Anlaufhafen des Schicksalsschiffs. Am Nachmittag erwartet Sie die experimentelle Blackwater Distillery in einem umgebauten Eisenwarenladen direkt am Fluss, wo Sie innovative Pot-Still-Rezepturen probieren. Anschließend Check-in in Dungarvan.
                  </p>
                  <div className="text-sm text-[#74CF6C] font-medium">🥃 Destillerie: Blackwater · 🏨 Übernachtung: Dungarvan</div>
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
                    src="https://irish-whiskey-booking.fly.dev/api/images/75ee7bb8-ba55-47f2-aa0a-8df1068ff58a"
                    alt="Dublin Airport"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">8</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Rückreise</h3>
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
                name: 'Hotel in Dublin',
                location: 'Dublin',
                nights: 2,
                stars: '3-4',
                description: 'Zentral gelegenes Hotel in Dublin mit ausgezeichneter Anbindung zu allen Sehenswürdigkeiten.',
                highlights: ['Zentrale Lage', 'Nahe Trinity College', 'Temple Bar zu Fuß erreichbar'],
                headerImage: 'https://images.unsplash.com/photo-1662042494212-38641b246a81',
                galleryImages: [
                  'https://images.unsplash.com/photo-1651348317504-9513c52e155c',
                  'https://images.unsplash.com/photo-1488155665162-7fc8d8093d18',
                  'https://images.unsplash.com/photo-1650291870423-37e1b0d93a1b'
                ]
              },
              {
                name: 'Victoria Hotel Galway',
                location: 'Galway',
                nights: 2,
                stars: '3',
                description: 'Charmantes Boutique-Hotel in ruhiger Seitenstraße direkt am Eyre Square, dem lebendigen Herzstück der Stadt. Verbindet klassischen Komfort mit echter irischer Gastfreundschaft.',
                highlights: ['Unschlagbar zentrale Lage', 'Eyre Square', 'Irische Gastfreundschaft'],
                headerImage: 'https://irish-whiskey-booking.fly.dev/api/images/047d3db3-35fe-433d-859c-abdef02ae37f',
                galleryImages: [
                  'https://irish-whiskey-booking.fly.dev/api/images/6a6caec8-e335-4df1-87a6-a895295c6494',
                  'https://irish-whiskey-booking.fly.dev/api/images/9855ca4e-3cdf-4b43-8d2f-0ce084bb7412',
                  'https://irish-whiskey-booking.fly.dev/api/images/2c6644ab-189c-4c28-8344-6d1900646833'
                ]
              },
              {
                name: 'Hotel in Killarney',
                location: 'Killarney',
                nights: 2,
                stars: '3-4',
                description: 'Komfortables Hotel in Killarney, idealer Ausgangspunkt für Ausflüge zum Ring of Kerry und den Seen von Killarney.',
                highlights: ['Nähe zum Nationalpark', 'Ring of Kerry', 'Killarney Seen'],
                headerImage: 'https://images.unsplash.com/photo-1784714326411-11280b8a9e51',
                galleryImages: [
                  'https://images.unsplash.com/photo-1633938127384-ea2ede12fee2',
                  'https://images.unsplash.com/photo-1650989402255-0af5678b1b3e',
                  'https://images.unsplash.com/photo-1632664918986-3334b1c3f85f'
                ]
              },
              {
                name: 'The Park Hotel Dungarvan',
                location: 'Dungarvan',
                nights: 1,
                stars: '4',
                description: 'Charmantes Hotel an der malerischen Südküste Irlands in der Grafschaft Waterford. Die Anlage liegt auf einem rund zwei Hektar großen, gepflegten Gartengrundstück mit direktem Blick auf die Mündung des Flusses Colligan.',
                highlights: ['2 Hektar Gartenanlage', 'Blick auf Colligan-Mündung', 'Südküste Waterford'],
                headerImage: 'https://irish-whiskey-booking.fly.dev/api/images/2a1589bc-fcbf-4021-9ba6-53fb9f330b8c',
                galleryImages: [
                  'https://irish-whiskey-booking.fly.dev/api/images/0ea718bc-9595-4592-8a82-488051783892',
                  'https://irish-whiskey-booking.fly.dev/api/images/1e4f0ed1-02dd-4caf-9886-dc2bb9984a37',
                  'https://irish-whiskey-booking.fly.dev/api/images/b88a7539-16fe-44da-bae3-2edff21ce51e'
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
                  />
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
                        />
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
              Destillerien & Tastings
            </h2>
            <p className="text-[#5A544C] max-w-2xl mx-auto">
              7 exklusive Brennereibesuche mit Führungen und Verkostungen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                slug: 'irish-whiskey-museum',
                name: 'Irish Whiskey Museum', 
                location: 'Dublin', 
                day: 1, 
                teaser: 'Markenunabhängiges Museum mit dramatischer Geschichte des irischen Whiskeys. Eigenen Blend kreieren!',
                highlight: 'Blending Experience',
                image: 'https://irish-whiskey-booking.fly.dev/api/images/c95ed09c-cb85-40a9-a946-c3c1fb15bb8d'
              },
              { 
                slug: 'pearse-lyons-distillery',
                name: 'Pearse Lyons Distillery', 
                location: 'Dublin (The Liberties)', 
                day: 2, 
                teaser: 'Ästhetisch spektakuläre Brennerei in wunderschön restaurierter Kirche mit gläserner Turmspitze.',
                highlight: 'Pearse 7 Years Distiller\'s Choice',
                image: 'https://irish-whiskey-booking.fly.dev/api/images/15cbdd55-df1e-4c96-8df2-b1036d92d274'
              },
              { 
                slug: 'temple-bar',
                name: 'The Temple Bar', 
                location: 'Dublin', 
                day: 2, 
                teaser: 'Über 450 Whiskeys im berühmten Pub. Geführtes Tasting im Keller des Whiskeygeschäfts nebenan.',
                highlight: 'Temple Bar Signature Blend',
                image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=300&fit=crop'
              },
              { 
                slug: 'ahascragh-distillery',
                name: 'Ahascragh Distillery', 
                location: 'Galway County', 
                day: 3, 
                teaser: 'Irlands erste "Zero Energy Emissions" Öko-Brennerei in restaurierter Kornmühle aus dem 19. Jh.',
                highlight: 'Clan Colla 11 Year Old',
                image: 'https://irish-whiskey-booking.fly.dev/api/images/018dd861-cc74-4e83-9e78-1b3c274f1c2b'
              },
              { 
                slug: 'micil-distillery',
                name: 'Micil Distillery', 
                location: 'Galway', 
                day: 4, 
                teaser: 'Erste legale Brennerei Galways seit 100 Jahren. Familie destilliert seit 6 Generationen Poitín.',
                highlight: 'Micil Heritage Poitín',
                image: 'https://irish-whiskey-booking.fly.dev/api/images/bbe54526-882b-451d-990e-c2ce9c4d4c03'
              },
              { 
                slug: 'the-liberator-distillery',
                name: 'The Liberator Distillery', 
                location: 'Killarney (Lakeview Estate)', 
                day: 5, 
                teaser: 'Private Führung mit Maurice O\'Connell auf geschichtsträchtigem Anwesen an Killarneys Seen.',
                highlight: 'Port Cask Finished Whiskey',
                image: 'https://irish-whiskey-booking.fly.dev/api/images/94d5f24e-c7fc-471d-892f-140319e7ab79'
              },
              { 
                slug: 'blackwater-distillery',
                name: 'Blackwater Distillery', 
                location: 'Waterford (Ballyduff)', 
                day: 7, 
                teaser: 'Micro-Destillerie in umgebautem Eisenwarenladen. Experimentell mit historischen Pot-Still-Rezepturen.',
                highlight: 'Velvet Cap Irish Whiskey',
                image: 'https://irish-whiskey-booking.fly.dev/api/images/cf479a45-277e-4a88-8b78-9a7d4ac358b7'
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
                  />
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
                Beliebt
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">Einzelzimmer</h3>
              <div className="text-3xl font-bold text-[#74CF6C] mb-4">€ 3.300,-</div>
              <p className="text-sm text-[#5A544C]">Inkl. € 700,- Einzelzimmerzuschlag</p>
            </div>
            
            <div 
              onClick={() => navigate('/booking')}
              className="bg-white rounded-xl p-8 border border-[#E6DEC8] hover:shadow-lg hover:border-[#74CF6C] transition-all cursor-pointer"
            >
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">Halbes Doppelzimmer</h3>
              <div className="text-3xl font-bold text-[#74CF6C] mb-4">€ 2.600,-</div>
              <p className="text-sm text-[#5A544C]">Mit Zimmerpartner-Zuteilung</p>
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-xl p-8 border border-[#E6DEC8]">
            <h3 className="text-xl font-bold text-[#1D1D1D] mb-6">Im Reisepreis enthalten:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                '7 Übernachtungen in 3-4 Sterne Hotels',
                'Täglich Frühstück',
                'Alle Transfers im Reisebus',
                'Alle Destillerie-Besuche inkl. Führungen & Tastings',
                'Eintritte (Irish Whiskey Museum, Kylemore Abbey, Muckross House, Titanic Experience Cobh u.a.)',
                'Reiseleitung Max von Arnim',
                'Begleitung Mareike Spitzer (Irish-Whiskeys.de)',
                'Kleine Gruppe max. 20 Teilnehmer'
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
