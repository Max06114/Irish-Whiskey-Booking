import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Save, Package, Users } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TourInventoryManagement = () => {
  const [inventory, setInventory] = useState({
    single: 0,
    double: 0,
    twin: 0,
    shared_twin: 0
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchBookings();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      const response = await axios.get(`${API}/admin/tour-inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(response.data || { single: 0, double: 0, twin: 0, shared_twin: 0 });
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // If no inventory exists, use defaults
      setInventory({ single: 0, double: 0, twin: 0, shared_twin: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      const response = await axios.get(`${API}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Calculate booked rooms and guests
  const getBookingStats = () => {
    const stats = {
      single: 0,
      double: 0,
      twin: 0,
      shared: 0
    };

    bookings.forEach(booking => {
      if (booking.room_type === 'single') stats.single++;
      if (booking.room_type === 'double') stats.double++;
      if (booking.room_type === 'twin') stats.twin++;
      if (booking.room_type === 'shared') stats.shared++;
    });

    return stats;
  };

  const bookedStats = getBookingStats();
  
  // Calculate guests
  const totalAvailableGuests = inventory.single + (inventory.double * 2) + (inventory.twin * 2) + inventory.shared_twin;
  const totalBookedGuests = bookedStats.single + (bookedStats.double * 2) + (bookedStats.twin * 2) + bookedStats.shared;
  const totalAvailableRooms = inventory.single + inventory.double + inventory.twin + Math.floor(inventory.shared_twin / 2);
  const totalBookedRooms = bookedStats.single + bookedStats.double + bookedStats.twin + Math.floor(bookedStats.shared / 2);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      await axios.put(`${API}/admin/tour-inventory`, inventory, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Inventar gespeichert!');
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Speichern fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (type, value) => {
    setInventory(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  if (loading) {
    return <div className="flex justify-center py-12">Lade...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1D1D1D] mb-2">Tour-Inventar</h1>
        <p className="text-[#5A544C]">Verfügbare Zimmer für die Irish Whiskey Tour</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#74CF6C]" />
            Zimmer-Kontingente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Hinweis:</strong> Diese Zimmer gelten für die gesamte Tour (alle Hotels zusammen).
              Gäste buchen einen Zimmertyp für die komplette 8-tägige Reise.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Einzelzimmer */}
            <div className="bg-white border-2 border-[#E6DEC8] rounded-xl p-6 hover:border-[#74CF6C] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#74CF6C]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#74CF6C]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1D1D1D]">Einzelzimmer</h3>
                  <p className="text-xs text-[#5A544C]">EZ / Single</p>
                </div>
              </div>
              <input
                type="number"
                value={inventory.single}
                onChange={(e) => handleChange('single', e.target.value)}
                min="0"
                className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C] focus:border-transparent"
              />
              <p className="text-xs text-[#5A544C] mt-2 text-center">Verfügbare Zimmer</p>
            </div>

            {/* Doppelzimmer */}
            <div className="bg-white border-2 border-[#E6DEC8] rounded-xl p-6 hover:border-[#74CF6C] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#74CF6C]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#74CF6C]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1D1D1D]">Doppelzimmer</h3>
                  <p className="text-xs text-[#5A544C]">DZ / Double</p>
                </div>
              </div>
              <input
                type="number"
                value={inventory.double}
                onChange={(e) => handleChange('double', e.target.value)}
                min="0"
                className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C] focus:border-transparent"
              />
              <p className="text-xs text-[#5A544C] mt-2 text-center">Verfügbare Zimmer</p>
            </div>

            {/* Twin-Zimmer */}
            <div className="bg-white border-2 border-[#E6DEC8] rounded-xl p-6 hover:border-[#74CF6C] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#74CF6C]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#74CF6C]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1D1D1D]">Zweibettzimmer</h3>
                  <p className="text-xs text-[#5A544C]">Twin</p>
                </div>
              </div>
              <input
                type="number"
                value={inventory.twin}
                onChange={(e) => handleChange('twin', e.target.value)}
                min="0"
                className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C] focus:border-transparent"
              />
              <p className="text-xs text-[#5A544C] mt-2 text-center">Verfügbare Zimmer</p>
            </div>

            {/* Halbes Doppelzimmer (Shared Twin) */}
            <div className="bg-white border-2 border-[#E6DEC8] rounded-xl p-6 hover:border-[#74CF6C] transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#74CF6C]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#74CF6C]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1D1D1D]">Halbes Doppelzimmer</h3>
                  <p className="text-xs text-[#5A544C]">Twin geteilt</p>
                </div>
              </div>
              <input
                type="number"
                value={inventory.shared_twin}
                onChange={(e) => handleChange('shared_twin', e.target.value)}
                min="0"
                className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C] focus:border-transparent"
              />
              <p className="text-xs text-[#5A544C] mt-2 text-center">Verfügbare Plätze</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#74CF6C] hover:bg-[#5eb556] text-white flex items-center gap-2 px-6"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Speichern...' : 'Inventar speichern'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zusammenfassung */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Verfügbarkeit Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Zimmer Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Zimmer
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Gesamt verfügbar:</span>
                  <span className="text-2xl font-bold text-blue-600">{totalAvailableRooms}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Bereits gebucht:</span>
                  <span className="text-2xl font-bold text-orange-600">{totalBookedRooms}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                  <span className="text-gray-900 font-semibold">Noch frei:</span>
                  <span className="text-3xl font-bold text-green-600">{totalAvailableRooms - totalBookedRooms}</span>
                </div>
              </div>
            </div>

            {/* Gäste Stats */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gäste
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Gesamtkapazität:</span>
                  <span className="text-2xl font-bold text-blue-600">{totalAvailableGuests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Bereits gebucht:</span>
                  <span className="text-2xl font-bold text-orange-600">{totalBookedGuests}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-green-200">
                  <span className="text-gray-900 font-semibold">Noch frei:</span>
                  <span className="text-3xl font-bold text-green-600">{totalAvailableGuests - totalBookedGuests}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail-Zusammenfassung */}
      <Card>
        <CardHeader>
          <CardTitle>Zimmer-Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {/* Einzelzimmer */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Einzelzimmer</p>
              <p className="text-2xl font-bold text-blue-600">{inventory.single}</p>
              <p className="text-xs text-gray-500 mt-1">Verfügbar</p>
              <p className="text-lg font-semibold text-orange-600 mt-2">{bookedStats.single}</p>
              <p className="text-xs text-gray-500">Gebucht</p>
              <p className="text-xl font-bold text-green-600 mt-2">{inventory.single - bookedStats.single}</p>
              <p className="text-xs text-gray-500">Frei</p>
            </div>

            {/* Doppelzimmer */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Doppelzimmer</p>
              <p className="text-2xl font-bold text-blue-600">{inventory.double}</p>
              <p className="text-xs text-gray-500 mt-1">Verfügbar</p>
              <p className="text-lg font-semibold text-orange-600 mt-2">{bookedStats.double}</p>
              <p className="text-xs text-gray-500">Gebucht</p>
              <p className="text-xl font-bold text-green-600 mt-2">{inventory.double - bookedStats.double}</p>
              <p className="text-xs text-gray-500">Frei</p>
              <p className="text-xs text-gray-400 mt-2">({(inventory.double - bookedStats.double) * 2} Gäste)</p>
            </div>

            {/* Twin-Zimmer */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Twin-Zimmer</p>
              <p className="text-2xl font-bold text-blue-600">{inventory.twin}</p>
              <p className="text-xs text-gray-500 mt-1">Verfügbar</p>
              <p className="text-lg font-semibold text-orange-600 mt-2">{bookedStats.twin}</p>
              <p className="text-xs text-gray-500">Gebucht</p>
              <p className="text-xl font-bold text-green-600 mt-2">{inventory.twin - bookedStats.twin}</p>
              <p className="text-xs text-gray-500">Frei</p>
              <p className="text-xs text-gray-400 mt-2">({(inventory.twin - bookedStats.twin) * 2} Gäste)</p>
            </div>

            {/* Halbes DZ */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Halbes DZ</p>
              <p className="text-2xl font-bold text-blue-600">{inventory.shared_twin}</p>
              <p className="text-xs text-gray-500 mt-1">Plätze verfügbar</p>
              <p className="text-lg font-semibold text-orange-600 mt-2">{bookedStats.shared}</p>
              <p className="text-xs text-gray-500">Gebucht</p>
              <p className="text-xl font-bold text-green-600 mt-2">{inventory.shared_twin - bookedStats.shared}</p>
              <p className="text-xs text-gray-500">Frei</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TourInventoryManagement;
