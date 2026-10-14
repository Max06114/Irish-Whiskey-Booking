import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, MapPin, Euro, AlertCircle, CheckCircle2, 
  Clock, CreditCard, XCircle, Info, Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HotelInventoryManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API}/admin/hotel-inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotels(res.data.hotels || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError(err.response?.data?.detail || 'Fehler beim Laden der Hotels');
      setLoading(false);
    }
  };

  const updateStatus = async (hotelId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API}/admin/hotel-inventory/${hotelId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessMessage(`Status erfolgreich auf "${newStatus}" geändert!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh hotels
      fetchHotels();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.detail || 'Fehler beim Aktualisieren');
    }
  };

  const seedHotels = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(
        `${API}/admin/hotel-inventory/seed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessMessage(res.data.message);
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchHotels();
    } catch (err) {
      console.error('Error seeding hotels:', err);
      setError(err.response?.data?.detail || 'Fehler beim Seed');
    }
  };

  const isDeadlineNear = (deadlineDate) => {
    if (!deadlineDate) return false;
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const getDeadlineStatus = (deadlineDate) => {
    if (!deadlineDate) return null;
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: 'text-red-600', icon: XCircle, label: 'Abgelaufen' };
    if (diffDays <= 7) return { color: 'text-orange-500', icon: AlertCircle, label: `In ${diffDays} Tag${diffDays === 1 ? '' : 'en'}` };
    return { color: 'text-green-600', icon: CheckCircle2, label: `In ${diffDays} Tagen` };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74CF6C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1D]">Hotel-Verwaltung</h2>
          <p className="text-sm text-[#5A544C]">Inventar, Deadlines & Zahlungsfristen</p>
        </div>
        {hotels.length === 0 && (
          <Button onClick={seedHotels} className="bg-[#74CF6C] hover:bg-[#5eb556]">
            Hotels laden
          </Button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Hotels List */}
      <div className="space-y-4">
        {hotels.map((hotel) => {
          const paymentDeadline = getDeadlineStatus(hotel.deadlines?.payment_due);
          const cancellationDeadline = getDeadlineStatus(hotel.deadlines?.free_cancellation || hotel.deadlines?.free_cancellation_full_group);
          
          return (
            <Card key={hotel.hotel_id} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {/* Status Indicator */}
                    {hotel.status === 'booked' ? (
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                    )}
                    
                    <div>
                      <CardTitle className="text-xl">{hotel.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-[#5A544C] mt-1">
                        <MapPin className="w-4 h-4" />
                        {hotel.location}
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4" />
                        {formatDate(hotel.dates?.check_in)} - {formatDate(hotel.dates?.check_out)}
                        <span className="text-[#74CF6C] font-medium">({hotel.dates?.nights} Nächte)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Toggle */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={hotel.status === 'booked' ? 'default' : 'outline'}
                      className={hotel.status === 'booked' ? 'bg-green-600 hover:bg-green-700' : ''}
                      onClick={() => updateStatus(hotel.hotel_id, 'booked')}
                    >
                      🟢 Gebucht
                    </Button>
                    <Button
                      size="sm"
                      variant={hotel.status === 'awaiting_confirmation' ? 'default' : 'outline'}
                      className={hotel.status === 'awaiting_confirmation' ? 'bg-red-600 hover:bg-red-700' : ''}
                      onClick={() => updateStatus(hotel.hotel_id, 'awaiting_confirmation')}
                    >
                      🔴 Nicht bestätigt
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rooms */}
                <div className="grid grid-cols-2 gap-4">
                  {hotel.rooms?.map((room, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold capitalize">{room.type === 'single' ? 'Einzelzimmer' : 'Doppelzimmer'}</span>
                        <Badge variant="outline">{room.count_allocated || 0} / {room.max_available || '∞'} gebucht</Badge>
                      </div>
                      <div className="text-sm text-[#5A544C]">
                        {room.price_per_night && (
                          <div className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {room.price_per_night} pro Nacht
                          </div>
                        )}
                        {room.price_per_person_per_night && (
                          <div className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {room.price_per_person_per_night} p.P. pro Nacht
                          </div>
                        )}
                        {room.note && <div className="text-xs mt-1 italic">{room.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Deadlines */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Wichtige Fristen
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Payment Deadline */}
                    {hotel.deadlines?.payment_due && (
                      <div className={`flex items-center justify-between p-3 rounded-lg ${isDeadlineNear(hotel.deadlines.payment_due) ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#74CF6C]" />
                          <div>
                            <div className="text-sm font-medium">Zahlung fällig</div>
                            <div className="text-xs text-[#5A544C]">{formatDate(hotel.deadlines.payment_due)}</div>
                          </div>
                        </div>
                        {paymentDeadline && (
                          <div className={`flex items-center gap-1 ${paymentDeadline.color}`}>
                            <paymentDeadline.icon className="w-4 h-4" />
                            <span className="text-xs font-medium">{paymentDeadline.label}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cancellation Deadline */}
                    {(hotel.deadlines?.free_cancellation || hotel.deadlines?.free_cancellation_full_group) && (
                      <div className={`flex items-center justify-between p-3 rounded-lg ${isDeadlineNear(hotel.deadlines.free_cancellation || hotel.deadlines.free_cancellation_full_group) ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-[#74CF6C]" />
                          <div>
                            <div className="text-sm font-medium">Kostenfreie Stornierung</div>
                            <div className="text-xs text-[#5A544C]">
                              {formatDate(hotel.deadlines.free_cancellation || hotel.deadlines.free_cancellation_full_group)}
                            </div>
                          </div>
                        </div>
                        {cancellationDeadline && (
                          <div className={`flex items-center gap-1 ${cancellationDeadline.color}`}>
                            <cancellationDeadline.icon className="w-4 h-4" />
                            <span className="text-xs font-medium">{cancellationDeadline.label}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contingent Adjustment (Victoria) */}
                    {hotel.deadlines?.contingent_adjustment && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-[#74CF6C]" />
                          <div>
                            <div className="text-sm font-medium">Kontingent-Anpassung</div>
                            <div className="text-xs text-[#5A544C]">{formatDate(hotel.deadlines.contingent_adjustment)}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Deposit */}
                    {hotel.deadlines?.deposit_due && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Euro className="w-4 h-4 text-[#74CF6C]" />
                          <div>
                            <div className="text-sm font-medium">Anzahlung (€{hotel.deadlines.deposit_amount})</div>
                            <div className="text-xs text-[#5A544C]">{formatDate(hotel.deadlines.deposit_due)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {hotel.notes && (
                  <div className="border-t pt-4">
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">{hotel.notes}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hotels.length === 0 && !loading && (
        <div className="text-center py-12 text-[#5A544C]">
          <p>Keine Hotels vorhanden. Klicke auf "Hotels laden" um die Hotels zu importieren.</p>
        </div>
      )}
    </div>
  );
};

export default HotelInventoryManagement;
