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
            src="https://images.unsplash.com/photo-1590086782692-1e9b83c09f90?w=1920&h=1080&fit=crop"
            alt="Irish Landscape"
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
      <section className="py-20 bg-white" data-testid="intro-section">
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

      {/* Pricing Section */}
      <section className="py-20 bg-[#FDFBF7]" data-testid="pricing-section" id="pricing">
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
            <div className="bg-white rounded-xl p-8 border border-[#E6DEC8] hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">Doppelzimmer</h3>
              <div className="text-3xl font-bold text-[#74CF6C] mb-4">€ 2.600,-</div>
              <p className="text-sm text-[#5A544C]">Pro Person im Doppelzimmer oder Twin</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border-2 border-[#74CF6C] hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#74CF6C] text-white text-xs px-4 py-1 rounded-full">
                Beliebt
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">Einzelzimmer</h3>
              <div className="text-3xl font-bold text-[#74CF6C] mb-4">€ 3.300,-</div>
              <p className="text-sm text-[#5A544C]">Inkl. € 700,- Einzelzimmerzuschlag</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-[#E6DEC8] hover:shadow-lg transition-shadow">
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
