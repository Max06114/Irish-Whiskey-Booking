import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

const AGBPage = () => {
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
          <h1 className="text-3xl font-serif text-[#1D1D1D] mb-6">Allgemeine Geschäftsbedingungen</h1>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">1. Anmeldung / Abschluss des Reisevertrags</h2>
            <p className="text-[#5A544C] mb-2"><strong>1.1.</strong> Mit der Anmeldung bietet der Kunde Travel Events den Abschluss eines Reisevertrages verbindlich an.</p>
            <p className="text-[#5A544C] mb-2"><strong>1.2.</strong> Der Vertrag kommt mit der Annahme durch Travel Events zustande. In diesem Fall erfolgt nach Vertragsabschluss eine schriftliche Reisebestätigung („Anmeldebestätigung"). Hierzu ist Travel Events nicht verpflichtet, wenn die Buchung durch den Kunden weniger als 7 Kalendertage vor Reisebeginn erfolgt. Der Vertrag kommt auf der Grundlage dieses neuen Angebots zustande, wenn der Kunde dieses durch ausdrückliche Annahmeerklärung bestätigt bzw. durch konkludentes Verhalten annimmt, wie die Vornahme der Anzahlung bzw. Restzahlung.</p>
            <p className="text-[#5A544C]"><strong>1.3.</strong> Die Reisebestätigung gilt für alle vom Kunden angemeldeten Personen. Der anmeldende Kunde haftet für die Einhaltung aller vertraglichen Verpflichtungen der durch ihn angemeldeten Personen, sofern dies ausdrücklich und gesondert erklärt wird.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">2. Zahlung / Reisedokumente</h2>
            <p className="text-[#5A544C] mb-2"><strong>2.1.</strong> Zahlungen auf den Reisepreis vor der Reise dürfen nur gegen Aushändigung des Sicherungsscheines im Sinne von § 651 Abs. 3 BGB erfolgen. Nach Vertragsabschluss wird gegen Aushändigung des Sicherungsscheines eine Anzahlung in Höhe von <strong>25 %</strong> des Reisepreises fällig, die innerhalb von 21 Tagen nach Erhalt der Rechnung / Reisebestätigung zu zahlen ist. Die Restzahlung wird <strong>6 Wochen</strong> vor Reisebeginn fällig, sofern der Sicherungsschein übergeben ist und die Reise nicht mehr aus dem in Ziffer 6.2. genannten Grund abgesagt werden kann.</p>
            <p className="text-[#5A544C] mb-2"><strong>2.2.</strong> Gebühren für Umbuchungen, Stornierungen sowie Versicherungsprämien sind sofort fällig.</p>
            <p className="text-[#5A544C]"><strong>2.3.</strong> Die Reiseunterlagen werden nach Erhalt der Restzahlung ca. 2 Wochen vor Reisebeginn versandt.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">3. Leistungs- und Preisänderungen</h2>
            <p className="text-[#5A544C] mb-2"><strong>3.1.</strong> Unsere Leistungen ergeben sich aus der Leistungsbeschreibung, den allgemeinen Hinweisen auf unserer Internetseite www.irish-whiskeys.de sowie aus den hierauf bezugnehmenden Angaben in der Reisebestätigung. Zusätzliche Leistungen sowie Nebenabreden bedürfen der Bestätigung von Travel Events.</p>
            <p className="text-[#5A544C] mb-2"><strong>3.2.</strong> Die auf der Internetseite www.irish-whiskeys.de genannten Angaben sind für Travel Events bindend. Bezüglich unserer internetbasierten Reiseausschreibung behält sich Travel Events in Übereinstimmung mit § 4 Abs.2 BGB-Info V ausdrücklich vor, aus sachlich berechtigten, erheblichen und nicht vorhersehbaren Gründen vor Vertragsschluss eine Änderung der Ausschreibungen zu erklären, über die der Kunde vor Buchung informiert wird.</p>
            <p className="text-[#5A544C]"><strong>3.3.</strong> Preiserhöhungen sind nur dann zulässig, sofern zwischen Vertragsschluss und dem vereinbarten Reisetermin mehr als 4 Monate liegen. Bei Preiserhöhungen um mehr als 5 % ist der Reisende berechtigt, vom Reisevertrag kostenlos zurückzutreten.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">4. Rücktritt durch den Reisegast / Umbuchungen</h2>
            <p className="text-[#5A544C] mb-2"><strong>4.1.</strong> Der Reisende hat die Möglichkeit, jederzeit vor Reisebeginn zurückzutreten. Maßgeblich ist der Zugang der Rücktrittserklärung bei Travel Events.</p>
            <p className="text-[#5A544C] mb-2"><strong>4.2.</strong> Tritt der Kunde vor Reisebeginn zurück, verliert der Reiseveranstalter den Anspruch auf den Reisepreis, kann aber eine Entschädigung verlangen:</p>
            <ul className="list-disc ml-6 text-[#5A544C] mb-2">
              <li>bis zum 30. Tag vor Reiseantritt = 20 %</li>
              <li>vom 29. bis 15. Tag vor Reiseantritt = 40 %</li>
              <li>vom 14. bis 7. Tag vor Reiseantritt = 60 %</li>
              <li>ab dem 6. Tag und bei Nichtanreise = 90 %</li>
            </ul>
            <p className="text-[#5A544C] mb-2"><strong>4.3.</strong> Dem Kunden bleibt es in jedem Fall unbenommen, nachzuweisen, dass kein oder ein wesentlich niedriger Schaden entstanden ist.</p>
            <p className="text-[#5A544C]"><strong>4.4.</strong> Wünscht der Kunde nach zugegangener Reisebestätigung die Umbuchung bestimmter Leistungen, so ist Travel Events berechtigt, pro Umbuchungsvorgang 30,00 Euro Bearbeitungsgebühr in Rechnung zu stellen.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">5. Nicht in Anspruch genommene Leistungen</h2>
            <p className="text-[#5A544C]">Nimmt der Reisende einzelne Reiseleistungen infolge vorzeitiger Rückreise oder aus sonstigen zwingenden Gründen nicht in Anspruch, hat er keinen Anspruch auf anteilige Erstattung des Reisepreises. Der Reiseveranstalter wird sich um Erstattung der ersparten Aufwendungen durch die Leistungsträger bemühen.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">6. Rücktritt, Kündigung des Reiseveranstalters</h2>
            <p className="text-[#5A544C] mb-2"><strong>6.1.</strong> Travel Events kann ohne Einhaltung einer Frist kündigen, wenn der Reisende die Durchführung der Reise ungeachtet einer Abmahnung nachhaltig stört.</p>
            <p className="text-[#5A544C]"><strong>6.2.</strong> Bis 21 Tage vor Reiseantritt bei Nichterreichen einer ausgeschriebenen Mindestteilnehmerzahl. Der Kunde erhält den eingezahlten Reisepreis unverzüglich zurück.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">7. Pass-, Visa- und Gesundheitsvorschriften</h2>
            <p className="text-[#5A544C] mb-2"><strong>7.1.</strong> Der Reiseveranstalter informiert über Pass-, Visa- und Gesundheitsvorschriften.</p>
            <p className="text-[#5A544C] mb-2"><strong>7.2.</strong> Der Reisende ist für die Einhaltung aller Vorschriften selbst verantwortlich.</p>
            <p className="text-[#5A544C]"><strong>7.3.</strong> Wir empfehlen dringend den Abschluss einer Reiserücktrittskostenversicherung.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">8. Gewährleistung</h2>
            <p className="text-[#5A544C] mb-2"><strong>8.1.</strong> Wird die Reise nicht vertragsgemäß erbracht, kann der Kunde Abhilfe verlangen.</p>
            <p className="text-[#5A544C] mb-2"><strong>8.2.</strong> Für die Dauer einer nicht vertragsgemäßen Erbringung kann der Kunde eine Herabsetzung des Reisepreises verlangen (Minderung).</p>
            <p className="text-[#5A544C]"><strong>8.3.</strong> Gepäckschäden sind unverzüglich vor Ort mittels Schadensanzeige der zuständigen Fluggesellschaft anzuzeigen.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">9. Haftungsbeschränkung</h2>
            <p className="text-[#5A544C] mb-2"><strong>9.1.</strong> Die vertragliche Haftung des Reiseveranstalters für Schäden, die nicht Körperschäden sind, ist auf den dreifachen Reisepreis beschränkt.</p>
            <p className="text-[#5A544C]"><strong>9.2.</strong> Der Reiseveranstalter haftet nicht für Leistungsstörungen bei Fremdleistungen, die ausdrücklich als solche gekennzeichnet sind.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">10. Mitwirkungspflicht</h2>
            <p className="text-[#5A544C] mb-2"><strong>10.1.</strong> Der Reisende ist verpflichtet, bei Leistungsstörungen mitzuwirken und Schäden zu vermeiden.</p>
            <p className="text-[#5A544C]"><strong>10.2.</strong> Beanstandungen sind unverzüglich der örtlichen Reiseleitung oder dem Reiseveranstalter mitzuteilen.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">11. Ausschluss von Ansprüchen und Verjährung</h2>
            <p className="text-[#5A544C] mb-2"><strong>11.1.</strong> Ansprüche sind innerhalb eines Monats nach Reiseende geltend zu machen.</p>
            <p className="text-[#5A544C]"><strong>11.2.</strong> Ansprüche verjähren nach einem Jahr ab dem vertraglich vorgesehenen Rückreisedatum.</p>
          </section>

          <section className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-2 mb-3">12. Buchung eines halben Doppelzimmers</h2>
            <p className="text-[#5A544C] mb-2"><strong>12.1.</strong> Hat sich bei Buchung eines halben Doppelzimmers <strong>bis 4 Wochen vor Reiseantritt</strong> kein gleichgeschlechtlicher Zimmerpartner angemeldet, wird der Kunde automatisch auf ein Einzelzimmer umgestellt.</p>
            <p className="text-[#5A544C] mb-2"><strong>12.2.</strong> In diesem Fall teilen sich Kunde und Veranstalter die Differenz zwischen halbem Doppelzimmer und Einzelzimmer:</p>
            <ul className="list-disc ml-6 text-[#5A544C] mb-2">
              <li>Differenz: 700 €</li>
              <li>Kunde zahlt: 350 € Aufpreis</li>
              <li>Veranstalter übernimmt: 350 €</li>
              <li>Gesamtpreis erhöht sich von 2.600 € auf 2.950 €</li>
            </ul>
            <p className="text-[#5A544C]"><strong>12.3.</strong> Bei Buchungen innerhalb eines Monats vor Abreise wird der volle Einzelzimmerzuschlag berechnet, wenn kein Zimmerpartner verfügbar ist.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">13. Gerichtsstand</h2>
            <p className="text-[#5A544C]">Für Klagen ist der Sitz des Reiseveranstalters maßgebend.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-[#1D1D1D] mt-6 mb-3">14. Veranstalter</h2>
            <p className="text-[#5A544C] mb-4">Die Reisen werden von Travel Events veranstaltet.</p>
            
            <div className="border-t border-[#E6DEC8] pt-4 text-[#5A544C]">
              <p className="font-semibold">Travel Events</p>
              <p>Maximilian Arndt von Arnim</p>
              <p>Tel: +49 345 52509402</p>
              <p>E-Mail: info@travel-events.de</p>
              <p className="mt-4 text-sm">Stand: Januar 2026</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AGBPage;
