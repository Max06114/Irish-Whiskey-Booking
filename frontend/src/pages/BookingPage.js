import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Check, Users, Calendar, Euro } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BookingPage = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    salutation: 'Herr',
    first_name: '',
    last_name: '',
    email: '',
    street: '',
    postal_code: '',
    city: '',
    country: 'Deutschland',
    room_type: 'double',
    companion_salutation: '',
    companion_first_name: '',
    companion_last_name: '',
    notes: '',
    payment_method: 'bank_transfer'
  });

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`${API}/trips`);
        if (res.data && res.data.length > 0) {
          setTrip(res.data[0]);
        }
      } catch (error) {
        toast.error('Reise konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, []);

  // Use prices from API trip data
  const roomTypes = trip ? [
    { value: 'double', label: 'Doppelzimmer', price: trip.price_per_person_double, persons: 2, description: 'Für 2 Personen' },
    { value: 'twin', label: 'Twin-Zimmer', price: trip.price_per_person_twin, persons: 2, description: 'Zwei Einzelbetten' },
    { value: 'single', label: 'Einzelzimmer', price: trip.price_per_person_single, persons: 1, description: trip.single_supplement > 0 ? `Mit Einzelzimmerzuschlag €${trip.single_supplement},-` : 'Mit Einzelzimmerzuschlag' },
    { value: 'shared', label: 'Halbes Doppelzimmer', price: trip.price_per_person_shared, persons: 1, description: 'Mit Zimmerpartner-Zuteilung' }
  ] : [];

  const selectedRoomType = roomTypes.find(rt => rt.value === formData.room_type);
  const totalPrice = selectedRoomType ? selectedRoomType.price * selectedRoomType.persons : 0;
  const depositAmount = Math.round(totalPrice * 0.25);
  const remainingAmount = totalPrice - depositAmount;

  const needsCompanion = ['double', 'twin'].includes(formData.room_type);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.salutation || !formData.first_name || !formData.last_name || !formData.email ||
        !formData.street || !formData.postal_code || !formData.city || !formData.country) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return false;
    }
    
    if (needsCompanion && (!formData.companion_first_name || !formData.companion_last_name)) {
      toast.error('Bitte geben Sie die Daten Ihrer Begleitperson ein');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const bookingData = {
        trip_id: trip.id,
        ...formData,
        language: 'de'
      };

      const response = await axios.post(`${API}/bookings`, bookingData);
      toast.success('Buchung erfolgreich erstellt!');
      
      const bookingId = response.data.booking?.id || response.data.id;
      
      // Redirect based on payment method
      if (formData.payment_method === 'paypal') {
        // Create PayPal order and redirect to PayPal
        try {
          const paypalResponse = await axios.post(`${API}/payments/paypal/create-tour-order`, {
            booking_id: bookingId
          });
          
          if (paypalResponse.data.approval_url) {
            // Redirect to PayPal for payment
            window.location.href = paypalResponse.data.approval_url;
          } else {
            throw new Error('PayPal approval URL not received');
          }
        } catch (paypalError) {
          console.error('PayPal order creation failed:', paypalError);
          toast.error('PayPal-Zahlung konnte nicht gestartet werden. Bitte versuchen Sie Banküberweisung.');
          // Fallback to bank transfer page
          navigate(`/booking/transfer/${bookingId}`);
        }
      } else {
        // Bank transfer - redirect to transfer page
        navigate(`/booking/transfer/${bookingId}`);
      }
    } catch (error) {
      const msg = error.response?.data?.detail;
      toast.error(typeof msg === 'string' ? msg : 'Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#74CF6C]" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <p className="text-center text-[#5A544C]">Keine Reise verfügbar</p>
          <Button onClick={() => navigate('/')} className="mt-4 mx-auto block">
            Zurück zur Startseite
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Übersicht
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="border-[#E6DEC8]">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-[#1D1D1D]">
                  Reisebuchung
                </CardTitle>
                <p className="text-[#5A544C]">{trip.name}</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Room Type Selection */}
                  <div>
                    <Label className="text-[#1D1D1D] mb-3 block">Zimmerart wählen *</Label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {roomTypes.map((rt) => (
                        <div
                          key={rt.value}
                          onClick={() => setFormData(prev => ({ ...prev, room_type: rt.value }))}
                          className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                            formData.room_type === rt.value
                              ? 'border-[#74CF6C] bg-[#74CF6C]/5'
                              : 'border-[#E6DEC8] hover:border-[#74CF6C]/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-[#1D1D1D]">{rt.label}</p>
                              <p className="text-sm text-[#5A544C] mt-1">{rt.description}</p>
                            </div>
                            {formData.room_type === rt.value && (
                              <Check className="w-5 h-5 text-[#74CF6C]" />
                            )}
                          </div>
                          <p className="text-lg font-bold text-[#74CF6C] mt-2">€ {rt.price},-</p>
                          <p className="text-xs text-[#5A544C]">pro Person</p>
                        </div>
                      ))}
                    </div>

                    {/* Shared Room Details */}
                    {formData.room_type === 'shared' && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-[#1D1D1D] mb-2">
                          Halbes Doppelzimmer mit Zimmerpartner-Zuteilung
                        </h4>
                        <ul className="text-sm text-[#5A544C] space-y-2">
                          <li>• Wir vermitteln Ihnen einen gleichgeschlechtlichen Zimmerpartner.</li>
                          <li>• Sollte sich für Ihr halbes Doppelzimmer bis 4 Wochen vor Reisebeginn kein Zimmerpartner finden, werden Sie auf ein Einzelzimmer umgestellt.</li>
                          <li>• Die Differenz zwischen halbem Doppelzimmer und Einzelzimmer beträgt 700 €. Diese teilen wir uns:
                            <ul className="ml-4 mt-1 space-y-1">
                              <li>→ Sie zahlen nur 350 € Aufpreis</li>
                              <li>→ Wir übernehmen 350 €</li>
                            </ul>
                          </li>
                          <li className="font-medium text-[#1D1D1D] pt-1">
                            Ihr Gesamtpreis erhöht sich damit von 2.600 € auf 2.950 €.
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Personal Info */}
                  <div className="border-t border-[#E6DEC8] pt-6">
                    <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">Ihre persönlichen Daten</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="salutation">Anrede *</Label>
                        <select
                          id="salutation"
                          name="salutation"
                          value={formData.salutation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-[#E6DEC8] rounded-lg mt-1"
                          required
                        >
                          <option value="Herr">Herr</option>
                          <option value="Frau">Frau</option>
                        </select>
                      </div>
                      <div></div>
                      <div>
                        <Label htmlFor="first_name">Vorname *</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Nachname *</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="email">E-Mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="street">Straße und Hausnummer *</Label>
                        <Input
                          id="street"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">PLZ *</Label>
                        <Input
                          id="postal_code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ort *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="country">Land *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Companion Info */}
                  {needsCompanion && (
                    <div className="border-t border-[#E6DEC8] pt-6">
                      <h3 className="text-lg font-semibold text-[#1D1D1D] mb-4">Daten der Begleitperson</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companion_salutation">Anrede</Label>
                          <select
                            id="companion_salutation"
                            name="companion_salutation"
                            value={formData.companion_salutation}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-[#E6DEC8] rounded-lg mt-1"
                          >
                            <option value="">Bitte wählen</option>
                            <option value="Herr">Herr</option>
                            <option value="Frau">Frau</option>
                          </select>
                        </div>
                        <div></div>
                        <div>
                          <Label htmlFor="companion_first_name">Vorname *</Label>
                          <Input
                            id="companion_first_name"
                            name="companion_first_name"
                            value={formData.companion_first_name}
                            onChange={handleInputChange}
                            required={needsCompanion}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companion_last_name">Nachname *</Label>
                          <Input
                            id="companion_last_name"
                            name="companion_last_name"
                            value={formData.companion_last_name}
                            onChange={handleInputChange}
                            required={needsCompanion}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="border-t border-[#E6DEC8] pt-6">
                    <Label htmlFor="notes">Anmerkungen (optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1"
                      placeholder="Besondere Wünsche oder Hinweise..."
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="border-t border-[#E6DEC8] pt-6">
                    <Label className="text-base font-semibold text-[#1D1D1D] mb-4 block">
                      Zahlungsmethode wählen
                    </Label>
                    <div className="space-y-3">
                      {/* Bank Transfer Option */}
                      <div 
                        onClick={() => setFormData({...formData, payment_method: 'bank_transfer'})}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          formData.payment_method === 'bank_transfer' 
                            ? 'border-[#74CF6C] bg-[#74CF6C]/5' 
                            : 'border-[#E6DEC8] hover:border-[#74CF6C]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.payment_method === 'bank_transfer' ? 'border-[#74CF6C]' : 'border-gray-300'
                            }`}>
                              {formData.payment_method === 'bank_transfer' && (
                                <div className="w-3 h-3 rounded-full bg-[#74CF6C]"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-[#1D1D1D]">Banküberweisung</p>
                              <p className="text-sm text-[#5A544C]">25% Anzahlung per Überweisung</p>
                            </div>
                          </div>
                          <Euro className="w-5 h-5 text-[#74CF6C]" />
                        </div>
                      </div>

                      {/* PayPal Option */}
                      <div 
                        onClick={() => setFormData({...formData, payment_method: 'paypal'})}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          formData.payment_method === 'paypal' 
                            ? 'border-[#74CF6C] bg-[#74CF6C]/5' 
                            : 'border-[#E6DEC8] hover:border-[#74CF6C]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.payment_method === 'paypal' ? 'border-[#74CF6C]' : 'border-gray-300'
                            }`}>
                              {formData.payment_method === 'paypal' && (
                                <div className="w-3 h-3 rounded-full bg-[#74CF6C]"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-[#1D1D1D]">PayPal / Kreditkarte</p>
                              <p className="text-sm text-[#5A544C]">25% Anzahlung sofort bezahlen</p>
                            </div>
                          </div>
                          <svg className="w-20 h-5" viewBox="0 0 101 32" fill="none">
                            <path d="M12.237 7.948c.634-4.051-2.383-6.181-6.527-6.181H.173L.002.098A.346.346 0 0 0 .346 0H6.47c2.077 0 4.021.772 5.21 2.396 1.085 1.482 1.436 3.42.557 5.552z" fill="#003087"/>
                            <path d="M20.597 11.368c-.528 3.422-3.125 5.726-6.465 5.726-1.662 0-2.99-.535-3.846-1.548-.85-1.005-1.169-2.438-.9-4.034.502-3.15 3.193-5.78 6.431-5.78 1.635 0 2.947.534 3.799 1.545.855 1.016 1.17 2.466.981 4.091z" fill="#0070E0"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-[#E6DEC8] pt-6">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#74CF6C] hover:bg-[#5eb556] text-white py-6 text-lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Buchung wird erstellt...
                        </>
                      ) : (
                        'Verbindlich buchen'
                      )}
                    </Button>
                    <p className="text-xs text-center text-[#5A544C] mt-4">
                      Mit der Buchung akzeptieren Sie unsere <Link to="/agb" className="text-[#74CF6C] hover:underline">AGB</Link> und <Link to="/datenschutz" className="text-[#74CF6C] hover:underline">Datenschutzerklärung</Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="border-[#E6DEC8] sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-[#1D1D1D]">
                  Buchungsübersicht
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-[#74CF6C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#1D1D1D]">Reisetermin</p>
                    <p className="text-[#5A544C]">{trip.start_date} – {trip.end_date}</p>
                    <p className="text-[#5A544C]">{trip.duration_days} Tage / {trip.duration_nights} Nächte</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Users className="w-5 h-5 text-[#74CF6C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#1D1D1D]">Zimmerart</p>
                    <p className="text-[#5A544C]">{selectedRoomType?.label}</p>
                    <p className="text-[#5A544C]">{selectedRoomType?.persons} Person{selectedRoomType?.persons > 1 ? 'en' : ''}</p>
                  </div>
                </div>

                <div className="border-t border-[#E6DEC8] pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A544C]">Preis pro Person</span>
                    <span className="font-medium text-[#1D1D1D]">€ {selectedRoomType?.price},-</span>
                  </div>
                  {selectedRoomType?.persons > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5A544C]">Anzahl Personen</span>
                      <span className="font-medium text-[#1D1D1D]">× {selectedRoomType.persons}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-[#E6DEC8] pt-2">
                    <span className="text-[#1D1D1D]">Gesamtpreis</span>
                    <span className="text-[#74CF6C]">€ {totalPrice},-</span>
                  </div>
                </div>

                <div className="bg-[#74CF6C]/5 rounded-lg p-4 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro className="w-4 h-4 text-[#74CF6C]" />
                    <span className="font-semibold text-[#1D1D1D]">Zahlungsplan</span>
                  </div>
                  <div className="space-y-1 text-[#5A544C]">
                    <p>• Anzahlung (25%): <strong>€ {depositAmount},-</strong></p>
                    <p>• Restzahlung: <strong>€ {remainingAmount},-</strong></p>
                    <p className="text-xs mt-2">
                      Fällig 6 Wochen vor Reisebeginn
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#E6DEC8] pt-4">
                  <p className="text-xs text-[#5A544C]">
                    <strong>Inklusive:</strong> {trip.inclusions?.slice(0, 3).join(', ')}...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
