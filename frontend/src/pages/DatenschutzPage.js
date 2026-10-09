import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

const DatenschutzPage = () => {
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

        <div className="bg-white rounded-lg border border-[#E6DEC8] p-8 prose prose-sm max-w-none">
          <h1 className="text-3xl font-serif text-[#1D1D1D] mb-6">Datenschutzerklärung</h1>

          <p className="text-[#5A544C] mb-6">
            Wir freuen uns sehr über Ihr Interesse an unserem Unternehmen. Datenschutz hat einen besonders hohen Stellenwert für die Geschäftsleitung von Irish-Whiskeys.de & Travel Events. Eine Nutzung der Internetseiten ist grundsätzlich ohne jede Angabe personenbezogener Daten möglich.
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">1. Name und Anschrift des Verantwortlichen</h2>
            <p className="text-[#5A544C]">Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):</p>
            <div className="bg-gray-50 p-4 rounded mt-2">
              <p className="text-[#5A544C]">Irish-Whiskeys.de & Travel Events</p>
              <p className="text-[#5A544C]">Tel: +49 345 52509402</p>
              <p className="text-[#5A544C]">E-Mail: info@travel-events.de</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p className="text-[#5A544C] mb-2">Bei der Buchung einer Reise erheben wir folgende Daten:</p>
            <ul className="list-disc ml-6 text-[#5A544C] mb-2">
              <li>Anrede, Vor- und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Anschrift (Straße, PLZ, Ort, Land)</li>
              <li>Zimmerauswahl und Reisedaten</li>
              <li>Zahlungsinformationen (bei PayPal)</li>
            </ul>
            <p className="text-[#5A544C]">Die Daten werden zur Durchführung des Reisevertrags und zur Kommunikation mit Ihnen verwendet.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">3. Weitergabe von Daten</h2>
            <p className="text-[#5A544C] mb-2">Wir geben Ihre Daten an folgende Dienstleister weiter:</p>
            <ul className="list-disc ml-6 text-[#5A544C]">
              <li><strong>PayPal:</strong> Für die Zahlungsabwicklung</li>
              <li><strong>Resend:</strong> Für den Versand von Bestätigungs-E-Mails</li>
              <li><strong>MongoDB Atlas:</strong> Zur sicheren Speicherung Ihrer Buchungsdaten</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">4. Cookies</h2>
            <p className="text-[#5A544C] mb-2">Unsere Internetseite verwendet Cookies. Cookies sind Textdateien, die über einen Internetbrowser auf einem Computersystem gespeichert werden.</p>
            <p className="text-[#5A544C]">Sie können die Setzung von Cookies durch eine entsprechende Einstellung Ihres Browsers verhindern. Bereits gesetzte Cookies können jederzeit gelöscht werden.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">5. Speicherdauer</h2>
            <p className="text-[#5A544C]">Wir speichern Ihre personenbezogenen Daten nur so lange, wie dies für die Durchführung der Reise und zur Erfüllung gesetzlicher Aufbewahrungspflichten erforderlich ist. Nach Ablauf der gesetzlichen Aufbewahrungsfristen werden die Daten routinemäßig gelöscht.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">6. Ihre Rechte</h2>
            <p className="text-[#5A544C] mb-2">Sie haben folgende Rechte:</p>
            <ul className="list-disc ml-6 text-[#5A544C]">
              <li><strong>Auskunftsrecht:</strong> Sie können Auskunft über Ihre gespeicherten Daten verlangen</li>
              <li><strong>Berichtigungsrecht:</strong> Sie können die Berichtigung unrichtiger Daten verlangen</li>
              <li><strong>Löschungsrecht:</strong> Sie können die Löschung Ihrer Daten verlangen</li>
              <li><strong>Einschränkung der Verarbeitung:</strong> Sie können die Einschränkung der Verarbeitung verlangen</li>
              <li><strong>Widerspruchsrecht:</strong> Sie können der Verarbeitung Ihrer Daten widersprechen</li>
              <li><strong>Datenübertragbarkeit:</strong> Sie können die Übertragung Ihrer Daten an einen anderen Verantwortlichen verlangen</li>
              <li><strong>Beschwerderecht:</strong> Sie können sich bei einer Aufsichtsbehörde beschweren</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">7. Datensicherheit</h2>
            <p className="text-[#5A544C]">Wir verwenden technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder den Zugriff unberechtigter Personen zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">8. SSL-Verschlüsselung</h2>
            <p className="text-[#5A544C]">Diese Seite nutzt aus Gründen der Sicherheit und zum Schutz der Übertragung vertraulicher Inhalte eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">9. Kontakt</h2>
            <p className="text-[#5A544C] mb-2">Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:</p>
            <div className="bg-gray-50 p-4 rounded mt-2">
              <p className="text-[#5A544C]">Irish-Whiskeys.de & Travel Events</p>
              <p className="text-[#5A544C]">Tel: +49 345 52509402</p>
              <p className="text-[#5A544C]">E-Mail: info@travel-events.de</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">10. Änderungen der Datenschutzerklärung</h2>
            <p className="text-[#5A544C]">Wir behalten uns vor, diese Datenschutzerklärung gelegentlich anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.</p>
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

export default DatenschutzPage;
