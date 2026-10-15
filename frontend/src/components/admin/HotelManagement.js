import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { RefreshCw, Calendar, MapPin, Euro, AlertCircle, CheckCircle2, Clock, Hotel } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotels(response.data.hotel_deadlines || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDeadlineNear = (deadlineDate) => {
    if (!deadlineDate) return false;
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const isDeadlinePassed = (deadlineDate) => {
    if (!deadlineDate) return false;
    const now = new Date();
    const deadline = new Date(deadlineDate);
    return deadline < now;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDeadlineBadge = (deadlineDate) => {
    if (!deadlineDate) return null;
    
    if (isDeadlinePassed(deadlineDate)) {
      return <Badge className="bg-red-500">Abgelaufen</Badge>;
    }
    
    if (isDeadlineNear(deadlineDate)) {
      return <Badge className="bg-orange-500">Dringend (7 Tage)</Badge>;
    }
    
    return <Badge className="bg-green-500">OK</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center py-12">Lade Hotels...</div>;
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1D] mb-2">Hotel-Verwaltung</h1>
          <p className="text-[#5A544C]">Übersicht aller Hotels mit Deadlines und Konditionen</p>
        </div>
        <Button onClick={fetchHotels} className="bg-[#74CF6C] hover:bg-[#5fb85a]">
          <RefreshCw className="w-4 h-4 mr-2" />
          Aktualisieren
        </Button>
      </div>

      {hotels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Hotel className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Keine Hotels gefunden</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {hotels.map((hotel, index) => (
            <Card key={hotel.hotel_id || index} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#74CF6C]/10 to-[#E6DEC8]/20">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Hotel className="w-5 h-5 text-[#74CF6C]" />
                      {hotel.name}
                    </CardTitle>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {hotel.location}
                      </span>
                      {hotel.dates && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(hotel.dates.check_in)} - {formatDate(hotel.dates.check_out)}
                          {hotel.dates.nights && ` (${hotel.dates.nights} Nächte)`}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className={hotel.status === 'booked' ? 'bg-green-600' : 'bg-yellow-600'}>
                    {hotel.status === 'booked' ? 'Gebucht' : 'Bestätigung ausstehend'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Deadlines */}
                {hotel.deadlines && Object.keys(hotel.deadlines).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Wichtige Fristen
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Frist-Typ</TableHead>
                          <TableHead>Datum</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          // Collect all deadlines with their labels
                          const deadlineList = [];
                          
                          if (hotel.deadlines.deposit_due) {
                            deadlineList.push({
                              date: hotel.deadlines.deposit_due,
                              label: `Anzahlung ${hotel.deadlines.deposit_amount ? `(€${hotel.deadlines.deposit_amount})` : ''}`
                            });
                          }
                          if (hotel.deadlines.free_cancellation_full_group) {
                            deadlineList.push({
                              date: hotel.deadlines.free_cancellation_full_group,
                              label: 'Gruppenstornierung'
                            });
                          }
                          if (hotel.deadlines.room_list_due) {
                            deadlineList.push({
                              date: hotel.deadlines.room_list_due,
                              label: 'Zimmerliste fällig'
                            });
                          }
                          if (hotel.deadlines.contingent_adjustment) {
                            deadlineList.push({
                              date: hotel.deadlines.contingent_adjustment,
                              label: 'Kontingent-Anpassung'
                            });
                          }
                          if (hotel.deadlines.payment_due) {
                            deadlineList.push({
                              date: hotel.deadlines.payment_due,
                              label: 'Zahlungsfrist'
                            });
                          }
                          if (hotel.deadlines.free_cancellation) {
                            deadlineList.push({
                              date: hotel.deadlines.free_cancellation,
                              label: 'Kostenfreie Stornierung'
                            });
                          }
                          if (hotel.deadlines.room_adjustment) {
                            deadlineList.push({
                              date: hotel.deadlines.room_adjustment,
                              label: 'Zimmeranpassung'
                            });
                          }
                          
                          // Sort by date (earliest first)
                          deadlineList.sort((a, b) => new Date(a.date) - new Date(b.date));
                          
                          return deadlineList.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{item.label}</TableCell>
                              <TableCell>{formatDate(item.date)}</TableCell>
                              <TableCell>{getDeadlineBadge(item.date)}</TableCell>
                            </TableRow>
                          ));
                        })()}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Rooms */}
                {hotel.rooms && hotel.rooms.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      Zimmer & Preise
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {hotel.rooms.map((room, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="font-medium text-gray-900 mb-1">
                            {room.type === 'single' ? 'Einzelzimmer' : 
                             room.type === 'double' ? 'Doppelzimmer' : 
                             room.type === 'twin' ? 'Twin' : room.type}
                          </div>
                          <div className="text-sm text-gray-600">
                            {room.max_available && `Max: ${room.max_available} Zimmer`}
                            {room.count_allocated !== undefined && ` (${room.count_allocated} belegt)`}
                          </div>
                          <div className="text-sm text-[#74CF6C] font-semibold mt-2">
                            {room.price_per_night && `€${room.price_per_night}/Nacht`}
                            {room.price_per_person_per_night && `€${room.price_per_person_per_night} p.P./Nacht`}
                            {room.price_22_may && `€${room.price_22_may} (22. Mai)`}
                            {room.price_23_may && ` / €${room.price_23_may} (23. Mai)`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {hotel.notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        Wichtige Hinweise:
                      </strong>
                      {hotel.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
