import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, Mail, MapPin, Globe, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2C1B14] text-[#FDFBF7] py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#74CF6C] rounded-full flex items-center justify-center">
                <Wine className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-serif text-xl font-semibold">Irish Whiskey</span>
                <p className="text-sm text-[#FDFBF7]/70">Natur & Kultur Reise</p>
              </div>
            </div>
            <p className="text-[#FDFBF7]/70 text-sm leading-relaxed">
              Eine exklusive 8-tägige Genussreise durch Irland mit Whiskeyspezialistin Mareike Spitzer und Reiseleiter Max von Arnim.
            </p>
            <p className="text-[#74CF6C] text-lg font-serif mt-4">Slàinte! <span className="text-sm text-[#FDFBF7]/50">(Irisch für Prost)</span></p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-lg mb-6">Navigation</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                Reiseüberblick
              </Link>
              <a href="/#itinerary" className="text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                Reiseroute (8 Tage)
              </a>
              <a href="/#pricing" className="text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                Leistungen & Preise
              </a>
              <Link to="/booking" className="text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                Jetzt buchen
              </Link>
              <Link to="/impressum" className="text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                Impressum
              </Link>
              <Link to="/datenschutz" className="text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                Datenschutz
              </Link>
              <Link to="/agb" className="text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                AGB
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg mb-6">Kontakt</h3>
            <div className="flex flex-col gap-4">
              <a href="tel:+493455250940" className="flex items-center gap-3 text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                <Phone className="w-5 h-5" />
                +49 345 52509402
              </a>
              <a href="mailto:info@travel-events.de" className="flex items-center gap-3 text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                <Mail className="w-5 h-5" />
                info@travel-events.de
              </a>
              <a href="https://www.travel-events.de" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                <Globe className="w-5 h-5" />
                www.travel-events.de
              </a>
              <a href="https://www.irish-whiskeys.de" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#FDFBF7]/70 hover:text-[#74CF6C] transition-colors">
                <Globe className="w-5 h-5" />
                www.irish-whiskeys.de
              </a>
            </div>
            <div className="mt-6">
              <p className="text-xs text-[#FDFBF7]/50 mb-2">Fragen vor der Buchung?</p>
              <p className="text-sm text-[#FDFBF7]/70">
                Rufen Sie uns gerne an!
              </p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-[#FDFBF7]/50 mb-2">Eine Kooperation von:</p>
              <p className="text-sm text-[#FDFBF7]/70">
                <strong>Irish-Whiskeys.de</strong> &<br/>
                <strong>Travel Events</strong> (Max von Arnim)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#FDFBF7]/10 text-center">
          <p className="text-[#FDFBF7]/50 text-sm">
            © {new Date().getFullYear()} Travel Events · Irish-Whiskeys.de. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
