import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

const ImpressumPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Startseite
        </Button>

        <div className="bg-white rounded-lg border border-[#E6DEC8] p-8">
          <h1 className="text-3xl font-serif text-[#1D1D1D] mb-6">Impressum</h1>

          <section className="mb-6">
            <p className="text-[#5A544C] mb-4">Angaben gemäß § 5 TMG:</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-[#1D1D1D] font-semibold">Travel Events</p>
              <p className="text-[#5A544C]">Maximilian Arndt von Arnim</p>
              <p className="text-[#5A544C] mt-2">Deutschland</p>
              <p className="text-[#5A544C] mt-2">Tel: +49 345 52509402</p>
              <p className="text-[#5A544C]">E-Mail: info@travel-events.de</p>
              <p className="text-[#5A544C]">Website: www.irish-whiskeys.de</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">Vertretungsberechtigter</h2>
            <p className="text-[#5A544C]">Maximilian Arndt von Arnim</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">Inhaltlich Verantwortlicher</h2>
            <p className="text-[#5A544C]">Inhaltlich Verantwortlicher gemäß § 55 Abs. 2 RStV: Maximilian Arndt von Arnim</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">EU-Streitschlichtung</h2>
            <p className="text-[#5A544C] mb-2">Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:</p>
            <p className="text-[#5A544C]">
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#74CF6C] hover:underline">
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p className="text-[#5A544C] mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">Haftungsausschluss</h2>
            
            <h3 className="text-lg font-semibold text-[#1D1D1D] mt-4 mb-2">Haftung für Inhalte</h3>
            <p className="text-[#5A544C] mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
            </p>

            <h3 className="text-lg font-semibold text-[#1D1D1D] mt-4 mb-2">Haftung für Links</h3>
            <p className="text-[#5A544C] mb-4">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>

            <h3 className="text-lg font-semibold text-[#1D1D1D] mt-4 mb-2">Urheberrecht</h3>
            <p className="text-[#5A544C]">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">Bildnachweise</h2>
            <p className="text-[#5A544C]">Bilder und Grafiken: © Travel Events, Unsplash, Pexels</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">Social Media</h2>
            <p className="text-[#5A544C]">Dieses Impressum gilt ebenfalls für unsere Social Media Präsenzen.</p>
          </section>

          <div className="border-t border-[#E6DEC8] pt-4 text-[#5A544C] text-sm">
            <p>Stand: Januar 2026</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ImpressumPage;
