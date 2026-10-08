import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Save, Loader2, Euro } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

const API = process.env.REACT_APP_BACKEND_URL;

const TripPriceManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trip, setTrip] = useState(null);
  const [prices, setPrices] = useState({
    price_per_person_single: 0,
    price_per_person_double: 0,
    price_per_person_twin: 0,
    price_per_person_shared: 0
  });

  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip = async () => {
    try {
      const res = await axios.get(`${API}/api/trips`);
      if (res.data && res.data.length > 0) {
        const tripData = res.data[0];
        setTrip(tripData);
        setPrices({
          price_per_person_single: tripData.price_per_person_single,
          price_per_person_double: tripData.price_per_person_double,
          price_per_person_twin: tripData.price_per_person_twin,
          price_per_person_shared: tripData.price_per_person_shared
        });
      }
    } catch (error) {
      toast.error('Fehler beim Laden der Reisedaten');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (field, value) => {
    setPrices(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      await axios.put(
        `${API}/api/admin/trips/${trip.id}`,
        prices,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Preise erfolgreich aktualisiert');
      fetchTrip();
    } catch (error) {
      toast.error('Fehler beim Speichern: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#74CF6C]" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="w-5 h-5" />
          Reisepreise
        </CardTitle>
        <CardDescription>
          Preise pro Person für die Irish Whiskey Tour 2027
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="single">Einzelzimmer (€)</Label>
            <Input
              id="single"
              type="number"
              step="0.01"
              value={prices.price_per_person_single}
              onChange={(e) => handlePriceChange('price_per_person_single', e.target.value)}
              className="text-lg font-semibold"
            />
            <p className="text-sm text-gray-500">
              Anzahlung (25%): €{(prices.price_per_person_single * 0.25).toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="double">Doppelzimmer (€)</Label>
            <Input
              id="double"
              type="number"
              step="0.01"
              value={prices.price_per_person_double}
              onChange={(e) => handlePriceChange('price_per_person_double', e.target.value)}
              className="text-lg font-semibold"
            />
            <p className="text-sm text-gray-500">
              Anzahlung (25%): €{(prices.price_per_person_double * 0.25).toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twin">Twin-Zimmer (€)</Label>
            <Input
              id="twin"
              type="number"
              step="0.01"
              value={prices.price_per_person_twin}
              onChange={(e) => handlePriceChange('price_per_person_twin', e.target.value)}
              className="text-lg font-semibold"
            />
            <p className="text-sm text-gray-500">
              Anzahlung (25%): €{(prices.price_per_person_twin * 0.25).toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shared">Halbes Doppelzimmer (€)</Label>
            <Input
              id="shared"
              type="number"
              step="0.01"
              value={prices.price_per_person_shared}
              onChange={(e) => handlePriceChange('price_per_person_shared', e.target.value)}
              className="text-lg font-semibold"
            />
            <p className="text-sm text-gray-500">
              Anzahlung (25%): €{(prices.price_per_person_shared * 0.25).toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#74CF6C] hover:bg-[#5eb556]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Wird gespeichert...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Preise speichern
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TripPriceManagement;
