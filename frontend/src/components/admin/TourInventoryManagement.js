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
    twin: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      const response = await axios.get(`${API}/admin/tour-inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(response.data || { single: 0, double: 0, twin: 0 });
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // If no inventory exists, use defaults
      setInventory({ single: 0, double: 0, twin: 0 });
    } finally {
      setLoading(false);
    }
  };

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

          <div className="grid md:grid-cols-3 gap-6">
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
      <Card>
        <CardHeader>
          <CardTitle>Zusammenfassung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-[#74CF6C]">{inventory.single}</p>
              <p className="text-sm text-[#5A544C]">Einzelzimmer</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#74CF6C]">{inventory.double}</p>
              <p className="text-sm text-[#5A544C]">Doppelzimmer</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#74CF6C]">{inventory.twin}</p>
              <p className="text-sm text-[#5A544C]">Twin-Zimmer</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E6DEC8]">
            <p className="text-center">
              <span className="text-2xl font-bold text-[#1D1D1D]">
                {inventory.single + inventory.double + inventory.twin}
              </span>
              <span className="text-sm text-[#5A544C] ml-2">Zimmer gesamt</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TourInventoryManagement;
