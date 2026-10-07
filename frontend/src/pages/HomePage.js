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
                <div className="md:col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1549918864-48ac978761a4?w=600&h=400&fit=crop"
                    alt="Dublin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">1</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Ankunft in Dublin</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3">
                    Begrüßung am Nachmittag, Besuch im Irish Whiskey Museum, gemeinsames Abendessen zum Kennenlernen der Gruppe.
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
                <div className="md:col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1548951484-cb0d23db6082?w=600&h=400&fit=crop"
                    alt="Pearse Lyons Distillery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">2</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Dublin & Pearse Lyons Distillery</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3">
                    Stadtrundgang (Trinity College, Temple Bar), Besuch der Pearse Lyons Distillery in einer 800 Jahre alten Kirche, abends geführtes Whiskey-Tasting in Temple Bar.
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
                <div className="md:col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=600&h=400&fit=crop"
                    alt="Ahascragh Distillery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">3</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Von Dublin nach Galway</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3">
                    Besuch der modernen, nachhaltigen Ahascragh Distillery, Lunch im Café, Weiterfahrt nach Galway, Abendbummel durch die bunte Stadt.
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
                <div className="md:col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
                    alt="Connemara"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">4</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Connemara & Micil Distillery</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3">
                    Killary Harbour (Irlands einziger Fjord), Kylemore Abbey, Micil Distillery in Salthill mit traditionellem Poitín-Tasting.
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
                <div className="md:col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop"
                    alt="Killarney"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">5</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Von Galway nach Killarney</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3">
                    Adare (Irlands schönstes Dorf), Muckross House & Gardens, Ross Castle, private Führung bei The Liberator Distillery mit Maurice O'Connell.
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
                <div className="md:col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
                    alt="Ring of Kerry"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">6</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Derrynane Bay & Ring of Kerry</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3">
                    Cahergal Ringfort, Waterville, traumhafte Derrynane Beach, Kenmare mit Steinkreis, Ladies View Aussichtspunkt.
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
                <div className="md:col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1591035897819-f4bdf739f446?w=600&h=400&fit=crop"
                    alt="Cobh"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">7</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Cobh & Blackwater Distillery</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3">
                    St. Colman's Cathedral, Titanic Experience Cobh, Blackwater Distillery am Fluss (Führung + Tasting), Check-in in Dungarvan.
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
                <div className="md:col-span-1">
                  <img
                    src="https://images.unsplash.com/photo-1549918864-48ac978761a4?w=600&h=400&fit=crop"
                    alt="Dublin Airport"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74CF6C] text-white font-bold">8</span>
                    <h3 className="font-serif text-xl font-bold text-[#1D1D1D]">Rückreise</h3>
                  </div>
                  <p className="text-[#5A544C] mb-3">
                    Frühstück, Transfer zum Flughafen Dublin. Abschied mit vielen unvergesslichen Eindrücken und neuen Freunden.
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
                className="bg-white rounded-xl overflow-hidden border border-[#E6DEC8] hover:shadow-lg transition-shadow"
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
                highlight: 'Blending Experience'
              },
              { 
                slug: 'pearse-lyons-distillery',
                name: 'Pearse Lyons Distillery', 
                location: 'Dublin (The Liberties)', 
                day: 2, 
                teaser: 'Ästhetisch spektakuläre Brennerei in wunderschön restaurierter Kirche mit gläserner Turmspitze.',
                highlight: 'Pearse 7 Years Distiller\'s Choice'
              },
              { 
                slug: 'temple-bar',
                name: 'The Temple Bar', 
                location: 'Dublin', 
                day: 2, 
                teaser: 'Über 450 Whiskeys im berühmten Pub. Geführtes Tasting im Keller des Whiskeygeschäfts nebenan.',
                highlight: 'Temple Bar Signature Blend'
              },
              { 
                slug: 'ahascragh-distillery',
                name: 'Ahascragh Distillery', 
                location: 'Galway County', 
                day: 3, 
                teaser: 'Irlands erste "Zero Energy Emissions" Öko-Brennerei in restaurierter Kornmühle aus dem 19. Jh.',
                highlight: 'Clan Colla 11 Year Old'
              },
              { 
                slug: 'micil-distillery',
                name: 'Micil Distillery', 
                location: 'Galway', 
                day: 4, 
                teaser: 'Erste legale Brennerei Galways seit 100 Jahren. Familie destilliert seit 6 Generationen Poitín.',
                highlight: 'Micil Heritage Poitín'
              },
              { 
                slug: 'the-liberator-distillery',
                name: 'The Liberator Distillery', 
                location: 'Killarney (Lakeview Estate)', 
                day: 5, 
                teaser: 'Private Führung mit Maurice O\'Connell auf geschichtsträchtigem Anwesen an Killarneys Seen.',
                highlight: 'Port Cask Finished Whiskey'
              },
              { 
                slug: 'blackwater-distillery',
                name: 'Blackwater Distillery', 
                location: 'Waterford (Ballyduff)', 
                day: 7, 
                teaser: 'Micro-Destillerie in umgebautem Eisenwarenladen. Experimentell mit historischen Pot-Still-Rezepturen.',
                highlight: 'Velvet Cap Irish Whiskey'
              }
            ].map((distillery, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/distillery/${distillery.slug}`)}
                className="bg-white rounded-xl p-6 border border-[#E6DEC8] hover:shadow-lg hover:border-[#74CF6C] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#74CF6C]/10 flex items-center justify-center flex-shrink-0">
                    <Wine className="w-6 h-6 text-[#74CF6C]" />
                  </div>
                  <span className="text-xs font-semibold text-[#74CF6C] bg-[#74CF6C]/10 px-2 py-1 rounded">
                    Tag {distillery.day}
                  </span>
                </div>
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
