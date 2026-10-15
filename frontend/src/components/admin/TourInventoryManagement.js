import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Edit, Loader2, Package, RefreshCw, Calendar, MapPin, Euro, AlertCircle, CheckCircle2, Clock, CreditCard, XCircle, Info } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const InventoryManagement = () => {
  const { language } = useLanguage();
  const { getAuthHeaders } = useAuth();
  const [inventoryData, setInventoryData] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'hotels'
  const [loading, setLoading] = useState(true);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [editValues, setEditValues] = useState({});

  const fetchInventory = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/admin/inventory`, { headers: getAuthHeaders() });
      setInventoryData(response.data.hotels || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error(language === 'de' ? 'Fehler beim Laden des Inventars' : 'Error loading inventory');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, language]);

  const fetchHotels = useCallback(async () => {
    setHotelsLoading(true);
    try {
      // Fetch hotels from stats endpoint
      const response = await axios.get(`${API}/admin/stats`, { headers: getAuthHeaders() });
      const hotelsData = response.data.hotel_deadlines || [];
      setHotels(hotelsData);
      if (hotelsData.length > 0) {
        toast.success('Hotels geladen!');
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error('Fehler beim Laden der Hotels');
    } finally {
      setHotelsLoading(false);
    }
  }, [getAuthHeaders]);

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

  const toggleHotelStatus = (hotelId) => {
    setHotels(prev => prev.map(hotel => 
      hotel.hotel_id === hotelId 
        ? { ...hotel, status: hotel.status === 'booked' ? 'awaiting_confirmation' : 'booked' }
        : hotel
    ));
    toast.success('Status geändert!');
  };


  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleSeedInventory = async () => {
    if (!window.confirm(language === 'de' 
      ? 'Inventardaten initialisieren? (Überschreibt bestehende Werte)'
      : 'Initialize inventory data? (Overwrites existing values)')) {
      return;
    }
    
    setSeeding(true);
    try {
      await axios.post(`${API}/admin/seed-inventory`, {}, { headers: getAuthHeaders() });
      toast.success(language === 'de' ? 'Inventar initialisiert!' : 'Inventory initialized!');
      fetchInventory();
    } catch (error) {
      toast.error(language === 'de' ? 'Fehler beim Initialisieren' : 'Error initializing');
    } finally {
      setSeeding(false);
    }
  };

  const handleEditStart = (hotel) => {
    setEditingHotel(hotel.hotel_id);
    setEditValues({
      single: hotel.inventory?.single || 0,
      double: hotel.inventory?.double || 0,
      twin: hotel.inventory?.twin || 0,
      standard_pool: hotel.inventory?.standard_pool || 0,
      comfort_pool: hotel.inventory?.comfort_pool || 0
    });
  };

  const handleSaveInventory = async (hotelId) => {
    try {
      await axios.put(`${API}/admin/inventory/${hotelId}`, editValues, { headers: getAuthHeaders() });
      toast.success(language === 'de' ? 'Inventar aktualisiert!' : 'Inventory updated!');
      setEditingHotel(null);
      fetchInventory();
    } catch (error) {
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    }
  };

  const getRoomTypeLabel = (type, lang) => {
    const labels = {
      de: { single: 'Einzelzimmer', double: 'Doppelzimmer', twin: 'Zweibettzimmer', standard_pool: 'Standard Pool', comfort_pool: 'Komfort Pool' },
      en: { single: 'Single', double: 'Double', twin: 'Twin', standard_pool: 'Standard Pool', comfort_pool: 'Comfort Pool' }
    };
    return labels[lang]?.[type] || type;
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#6B1D2A]" /></div>;
  }

  return (
    <div data-testid="admin-inventory">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-3xl text-[#1A1A1A]">
          {language === 'de' ? 'Inventar & Hotel-Verwaltung' : 'Inventory & Hotel Management'}
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={activeTab === 'inventory' ? fetchInventory : fetchHotels}
            data-testid="refresh-btn"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {language === 'de' ? 'Aktualisieren' : 'Refresh'}
          </Button>
          {activeTab === 'inventory' && (
            <Button 
              onClick={handleSeedInventory}
              disabled={seeding}
              className="bg-[#6B1D2A] hover:bg-[#8A2536]"
              data-testid="seed-inventory-btn"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Package className="w-4 h-4 mr-2" />}
              {language === 'de' ? 'Inventar initialisieren' : 'Initialize Inventory'}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'inventory'
              ? 'border-b-2 border-[#74CF6C] text-[#74CF6C]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📦 Zimmer-Inventar
        </button>
        <button
          onClick={() => { setActiveTab('hotels'); if (hotels.length === 0) fetchHotels(); }}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'hotels'
              ? 'border-b-2 border-[#74CF6C] text-[#74CF6C]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🏨 Hotel-Verwaltung
        </button>
      </div>

      {activeTab === 'inventory' && (
        <>
          {/* Info Card */}
          <Card className="border-blue-200 bg-blue-50 mb-6">
            <CardContent className="pt-6">
              <p className="text-blue-800 text-sm">
                <strong>{language === 'de' ? '📋 Hinweis:' : 'Info:'}</strong>{' '}
            {language === 'de' 
              ? 'Diese Zimmer gelten für die gesamte Tour (alle Hotels zusammen). Gäste buchen einen Zimmertyp für die komplette 8-tägige Reise.'
              : 'These rooms apply to the entire tour (all hotels combined). Guests book a room type for the complete 8-day trip.'}
          </p>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <div className="space-y-6">
        {inventoryData.map((hotel) => (
          <Card key={hotel.hotel_id} className="border-[#E5E0D5]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{hotel.hotel_name}</CardTitle>
                <Badge className={hotel.inventory_type === 'pool' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                  {hotel.inventory_type === 'pool' 
                    ? (language === 'de' ? 'Pool-basiert (flexibel)' : 'Pool-based (flexible)')
                    : (language === 'de' ? 'Feste Zimmertypen' : 'Fixed room types')}
                </Badge>
                {!hotel.active && (
                  <Badge className="ml-2 bg-gray-100 text-gray-800">
                    {language === 'de' ? 'Inaktiv' : 'Inactive'}
                  </Badge>
                )}
              </div>
              {editingHotel === hotel.hotel_id ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingHotel(null)}>
                    {language === 'de' ? 'Abbrechen' : 'Cancel'}
                  </Button>
                  <Button size="sm" className="bg-[#6B1D2A] hover:bg-[#8A2536]" onClick={() => handleSaveInventory(hotel.hotel_id)}>
                    {language === 'de' ? 'Speichern' : 'Save'}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => handleEditStart(hotel)} data-testid={`edit-inventory-${hotel.hotel_id}`}>
                  <Edit className="w-4 h-4 mr-1" />
                  {language === 'de' ? 'Bearbeiten' : 'Edit'}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'de' ? 'Zimmertyp' : 'Room Type'}</TableHead>
                      <TableHead className="text-center">{language === 'de' ? 'Verfügbar' : 'Available'}</TableHead>
                      <TableHead className="text-center">{language === 'de' ? 'Gebucht' : 'Booked'}</TableHead>
                      <TableHead className="text-center">{language === 'de' ? 'Gesamt' : 'Total'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotel.inventory_type === 'pool' ? (
                      <>
                        <TableRow className="bg-[#F5F2EA]/50">
                          <TableCell className="font-medium">
                            {language === 'de' ? 'Standard-Zimmer' : 'Standard Rooms'}
                            <span className="text-xs text-[#4A4A4A] block">(Einzelzimmer/Doppelzimmer/Zweibettzimmer)</span>
                          </TableCell>
                          <TableCell className="text-center">
                            {editingHotel === hotel.hotel_id ? (
                              <Input 
                                type="number" 
                                min="0"
                                className="w-20 text-center mx-auto"
                                value={editValues.standard_pool}
                                onChange={(e) => setEditValues({...editValues, standard_pool: parseInt(e.target.value) || 0})}
                              />
                            ) : (
                              <span className={`font-bold ${(hotel.inventory?.standard_pool || 0) === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {hotel.inventory?.standard_pool || 0}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-[#4A4A4A]">
                            {(hotel.booked?.single || 0) + (hotel.booked?.double || 0) + (hotel.booked?.twin || 0)}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {(hotel.inventory?.standard_pool || 0) + (hotel.booked?.single || 0) + (hotel.booked?.double || 0) + (hotel.booked?.twin || 0)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            {language === 'de' ? 'Komfort-Zimmer' : 'Comfort Rooms'}
                            <span className="text-xs text-[#4A4A4A] block">(Einzelzimmer/Doppelzimmer/Zweibettzimmer Komfort)</span>
                          </TableCell>
                          <TableCell className="text-center">
                            {editingHotel === hotel.hotel_id ? (
                              <Input 
                                type="number" 
                                min="0"
                                className="w-20 text-center mx-auto"
                                value={editValues.comfort_pool}
                                onChange={(e) => setEditValues({...editValues, comfort_pool: parseInt(e.target.value) || 0})}
                              />
                            ) : (
                              <span className={`font-bold ${(hotel.inventory?.comfort_pool || 0) === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {hotel.inventory?.comfort_pool || 0}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-[#4A4A4A]">
                            {(hotel.booked?.single_comfort || 0) + (hotel.booked?.double_comfort || 0) + (hotel.booked?.twin_comfort || 0)}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {(hotel.inventory?.comfort_pool || 0) + (hotel.booked?.single_comfort || 0) + (hotel.booked?.double_comfort || 0) + (hotel.booked?.twin_comfort || 0)}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      ['single', 'double', 'twin'].map((roomType) => (
                        <TableRow key={roomType} className={roomType === 'double' ? 'bg-[#F5F2EA]/50' : ''}>
                          <TableCell className="font-medium">{getRoomTypeLabel(roomType, language)}</TableCell>
                          <TableCell className="text-center">
                            {editingHotel === hotel.hotel_id ? (
                              <Input 
                                type="number" 
                                min="0"
                                className="w-20 text-center mx-auto"
                                value={editValues[roomType]}
                                onChange={(e) => setEditValues({...editValues, [roomType]: parseInt(e.target.value) || 0})}
                              />
                            ) : (
                              <span className={`font-bold ${(hotel.inventory?.[roomType] || 0) === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {hotel.inventory?.[roomType] || 0}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-[#4A4A4A]">
                            {hotel.booked?.[roomType] || 0}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {(hotel.inventory?.[roomType] || 0) + (hotel.booked?.[roomType] || 0)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        </>
      )}

      {/* Hotel Management Tab */}
      {activeTab === 'hotels' && (
        <div className="space-y-4">
          {hotelsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-[#74CF6C]" />
            </div>
          ) : hotels.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500 mb-4">Keine Hotels geladen</p>
                <Button onClick={fetchHotels} className="bg-[#74CF6C] hover:bg-[#5eb556]">
                  Hotels laden
                </Button>
              </CardContent>
            </Card>
          ) : (
            hotels.map((hotel) => {
              const paymentDeadline = getDeadlineStatus(hotel.deadlines?.payment_due);
              const cancellationDeadline = getDeadlineStatus(
                hotel.deadlines?.free_cancellation || hotel.deadlines?.free_cancellation_full_group
              );
              
              return (
                <Card key={hotel.hotel_id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
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
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={hotel.status === 'booked' ? 'default' : 'outline'}
                          className={hotel.status === 'booked' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => toggleHotelStatus(hotel.hotel_id)}
                        >
                          🟢 Gebucht
                        </Button>
                        <Button
                          size="sm"
                          variant={hotel.status === 'awaiting_confirmation' ? 'default' : 'outline'}
                          className={hotel.status === 'awaiting_confirmation' ? 'bg-red-600 hover:bg-red-700' : ''}
                          onClick={() => toggleHotelStatus(hotel.hotel_id)}
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
                            <span className="font-semibold capitalize">
                              {room.type === 'single' ? 'Einzelzimmer' : 'Doppelzimmer'}
                            </span>
                            <Badge variant="outline">
                              {room.count_allocated || 0} / {room.max_available || '∞'}
                            </Badge>
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
                        {hotel.deadlines?.payment_due && (
                          <div className={`flex items-center justify-between p-3 rounded-lg ${
                            isDeadlineNear(hotel.deadlines.payment_due) ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                          }`}>
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

                        {(hotel.deadlines?.free_cancellation || hotel.deadlines?.free_cancellation_full_group) && (
                          <div className={`flex items-center justify-between p-3 rounded-lg ${
                            isDeadlineNear(hotel.deadlines.free_cancellation || hotel.deadlines.free_cancellation_full_group)
                              ? 'bg-orange-50 border border-orange-200'
                              : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-[#74CF6C]" />
                              <div>
                                <div className="text-sm font-medium">Stornofrist</div>
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

                        {hotel.deadlines?.deposit_due && (
                          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Euro className="w-4 h-4 text-[#74CF6C]" />
                              <div>
                                <div className="text-sm font-medium">
                                  Anzahlung (€{hotel.deadlines.deposit_amount})
                                </div>
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
            })
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
