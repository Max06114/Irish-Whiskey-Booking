import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HotelManager = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    stars: 4,
    price_per_person: 0
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get(`${API}/hotels`);
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setAdding(true);
    setFormData({
      name: '',
      description: '',
      location: '',
      stars: 4,
      price_per_person: 0
    });
  };

  const handleEdit = (hotel) => {
    setEditing(hotel.id);
    setFormData({
      name: hotel.name || '',
      description: hotel.description || '',
      location: hotel.location || '',
      stars: hotel.stars || 4,
      price_per_person: hotel.price_per_person || 0
    });
  };

  const handleSave = async () => {
    const token = sessionStorage.getItem('hbh_admin_token');
    
    try {
      if (adding) {
        // Create new hotel with all required fields
        const hotelPayload = {
          name: formData.name,
          name_en: formData.name,
          description: formData.description || '',
          description_en: formData.description || '',
          stars: formData.stars,
          address: formData.location,
          distance_to_venue: '',
          distance_to_venue_en: '',
          amenities: [],
          amenities_en: [],
          images: [],
          single_price: formData.price_per_person || 0,
          double_price: formData.price_per_person || 0,
          breakfast_included: true,
          tax_included: true,
          active: true,
          inventory_type: 'fixed',
          has_comfort_rooms: false
        };
        
        await axios.post(`${API}/admin/hotels`,
          hotelPayload,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        alert('✅ Hotel wurde hinzugefügt');
      } else if (editing) {
        // Update existing hotel
        const updatePayload = {
          name: formData.name,
          name_en: formData.name,
          description: formData.description || '',
          description_en: formData.description || '',
          stars: formData.stars,
          address: formData.location,
          distance_to_venue: '',
          distance_to_venue_en: '',
          amenities: [],
          amenities_en: [],
          images: [],
          single_price: formData.price_per_person || 0,
          double_price: formData.price_per_person || 0,
          breakfast_included: true,
          tax_included: true,
          active: true,
          inventory_type: 'fixed',
          has_comfort_rooms: false
        };
        
        await axios.put(`${API}/admin/hotels/${editing}`,
          updatePayload,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        alert('✅ Hotel wurde aktualisiert');
      }
      
      setAdding(false);
      setEditing(null);
      fetchHotels();
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Speichern fehlgeschlagen');
    }
  };

  const handleDelete = async (hotelId, hotelName) => {
    if (!window.confirm(`Hotel "${hotelName}" wirklich löschen?`)) return;
    
    const token = sessionStorage.getItem('hbh_admin_token');
    try {
      await axios.delete(`${API}/admin/hotels/${hotelId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('✅ Hotel wurde gelöscht');
      fetchHotels();
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Löschen fehlgeschlagen');
    }
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1D1D1D] mb-2">Hotel-Verwaltung</h1>
            <p className="text-[#5A544C]">Verwalten Sie Hotels für die Irish Whiskey Tour</p>
          </div>
          
          {!adding && !editing && (
            <Button
              onClick={handleAdd}
              className="bg-[#74CF6C] hover:bg-[#5eb556] text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Hotel hinzufügen
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(adding || editing) && (
          <div className="bg-white rounded-xl p-6 border border-[#E6DEC8] mb-8">
            <h2 className="text-xl font-bold text-[#1D1D1D] mb-4">
              {adding ? 'Neues Hotel' : 'Hotel bearbeiten'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#5A544C] mb-2">
                  Hotel-Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="z.B. Victoria Hotel Galway"
                  className="w-full px-4 py-2 border border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A544C] mb-2">
                  Standort *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="z.B. Galway"
                  className="w-full px-4 py-2 border border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#5A544C] mb-2">
                  Beschreibung
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Kurze Beschreibung des Hotels"
                  rows="3"
                  className="w-full px-4 py-2 border border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A544C] mb-2">
                  Sterne
                </label>
                <select
                  value={formData.stars}
                  onChange={(e) => setFormData({...formData, stars: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C]"
                >
                  {[3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Sterne</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5A544C] mb-2">
                  Preis pro Person (optional)
                </label>
                <input
                  type="number"
                  value={formData.price_per_person}
                  onChange={(e) => setFormData({...formData, price_per_person: parseFloat(e.target.value)})}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-[#E6DEC8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74CF6C]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                disabled={!formData.name || !formData.location}
                className="bg-[#74CF6C] hover:bg-[#5eb556] text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Speichern
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Abbrechen
              </Button>
            </div>
          </div>
        )}

        {/* Hotels List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#5A544C]">Lade Hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#E6DEC8]">
            <p className="text-[#5A544C] mb-4">Noch keine Hotels angelegt</p>
            <p className="text-sm text-[#5A544C]">Klicken Sie auf "Hotel hinzufügen" um zu starten</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map(hotel => (
              <div key={hotel.id} className="bg-white rounded-xl border border-[#E6DEC8] overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">{hotel.name}</h3>
                      <p className="text-sm text-[#5A544C]">📍 {hotel.location}</p>
                    </div>
                    {hotel.stars && (
                      <div className="text-yellow-500">
                        {'⭐'.repeat(hotel.stars)}
                      </div>
                    )}
                  </div>

                  {hotel.description && (
                    <p className="text-sm text-[#5A544C] mb-4 line-clamp-2">{hotel.description}</p>
                  )}

                  {hotel.price_per_person > 0 && (
                    <p className="text-sm font-medium text-[#74CF6C] mb-4">
                      €{hotel.price_per_person} pro Person
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(hotel)}
                      className="flex-1 flex items-center justify-center gap-2"
                      disabled={adding || editing}
                    >
                      <Edit2 className="w-3 h-3" />
                      Bearbeiten
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(hotel.id, hotel.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={adding || editing}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HotelManager;
