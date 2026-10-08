import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PayPalSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const capturePayment = async () => {
      const orderId = searchParams.get('token');
      const payerId = searchParams.get('PayerID');
      
      if (!orderId) {
        setStatus('error');
        toast.error('Keine PayPal-Order-ID gefunden');
        return;
      }

      try {
        const response = await axios.post(`${API}/payments/paypal/capture-order`, {
          order_id: orderId,
          payer_id: payerId
        });

        if (response.data.booking_id) {
          setBookingId(response.data.booking_id);
          setStatus('success');
          toast.success('Zahlung erfolgreich!');
          
          // Redirect to confirmation page after 3 seconds
          setTimeout(() => {
            navigate(`/booking/confirmation/${response.data.booking_id}`);
          }, 3000);
        } else {
          throw new Error('Booking ID not received');
        }
      } catch (error) {
        console.error('PayPal capture error:', error);
        setStatus('error');
        toast.error('Zahlung konnte nicht abgeschlossen werden');
      }
    };

    capturePayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border-[#E6DEC8]">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-center text-[#1D1D1D]">
              PayPal-Zahlung
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            {status === 'processing' && (
              <div className="space-y-4">
                <Loader2 className="w-16 h-16 mx-auto animate-spin text-[#74CF6C]" />
                <h3 className="text-xl font-semibold text-[#1D1D1D]">
                  Zahlung wird verarbeitet...
                </h3>
                <p className="text-[#5A544C]">
                  Bitte warten Sie, während wir Ihre Zahlung bestätigen.
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 mx-auto text-[#74CF6C]" />
                <h3 className="text-xl font-semibold text-[#1D1D1D]">
                  Zahlung erfolgreich!
                </h3>
                <p className="text-[#5A544C]">
                  Ihre Anzahlung wurde erfolgreich verarbeitet.
                </p>
                <p className="text-sm text-[#5A544C]">
                  Sie werden automatisch zur Buchungsbestätigung weitergeleitet...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="w-16 h-16 mx-auto text-red-500" />
                <h3 className="text-xl font-semibold text-[#1D1D1D]">
                  Zahlung fehlgeschlagen
                </h3>
                <p className="text-[#5A544C]">
                  Ihre Zahlung konnte nicht verarbeitet werden.
                </p>
                <div className="flex gap-4 justify-center mt-6">
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-[#E6DEC8]"
                  >
                    Zur Startseite
                  </Button>
                  <Button
                    onClick={() => navigate('/booking')}
                    className="bg-[#74CF6C] hover:bg-[#5eb556]"
                  >
                    Erneut buchen
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PayPalSuccessPage;
