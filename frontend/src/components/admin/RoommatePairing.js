import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, User } from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

const RoommatePairing = () => {
  const [sharedRoomBookings, setSharedRoomBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSharedRoomBookings();
  }, []);

  const fetchSharedRoomBookings = async () => {
    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      const response = await axios.get(`${API}/api/admin/shared-room-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSharedRoomBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shared room bookings:', error);
      setMessage({ type: 'error', text: 'Fehler beim Laden der Buchungen' });
      setLoading(false);
    }
  };

  const handleSelectGuest = (bookingId) => {
    if (selectedGuests.includes(bookingId)) {
      setSelectedGuests(selectedGuests.filter(id => id !== bookingId));
    } else if (selectedGuests.length < 2) {
      setSelectedGuests([...selectedGuests, bookingId]);
    }
  };

  const handlePairGuests = async () => {
    if (selectedGuests.length !== 2) {
      setMessage({ type: 'error', text: 'Bitte wählen Sie genau 2 Gäste aus' });
      return;
    }

    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      await axios.post(
        `${API}/api/admin/pair-roommates`,
        { booking_ids: selectedGuests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage({ type: 'success', text: 'Zimmerpartner erfolgreich zugeordnet!' });
      setSelectedGuests([]);
      fetchSharedRoomBookings();
    } catch (error) {
      console.error('Error pairing guests:', error);
      setMessage({ type: 'error', text: 'Fehler beim Zuordnen der Zimmerpartner' });
    }
  };

  const handleUnpairGuest = async (bookingId) => {
    try {
      const token = sessionStorage.getItem('hbh_admin_token');
      await axios.post(
        `${API}/api/admin/unpair-roommate`,
        { booking_id: bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage({ type: 'success', text: 'Paarung aufgehoben' });
      fetchSharedRoomBookings();
    } catch (error) {
      console.error('Error unpairing guest:', error);
      setMessage({ type: 'error', text: 'Fehler beim Aufheben der Paarung' });
    }
  };

  const unpairedGuests = sharedRoomBookings.filter(b => !b.roommate_id);
  const pairedGuests = sharedRoomBookings.filter(b => b.roommate_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#5A544C]">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1D1D1D] mb-2">Zimmerpartner-Verwaltung</h2>
        <p className="text-[#5A544C]">
          Verwalten Sie Gäste mit "Halbes Doppelzimmer" Buchungen und ordnen Sie Zimmerpartner zu.
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#E6DEC8] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-[#74CF6C]" />
            <div>
              <p className="text-2xl font-bold text-[#1D1D1D]">{sharedRoomBookings.length}</p>
              <p className="text-sm text-[#5A544C]">Gesamt Buchungen</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E6DEC8] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-[#1D1D1D]">{unpairedGuests.length}</p>
              <p className="text-sm text-[#5A544C]">Ungepaard</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E6DEC8] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-[#74CF6C]" />
            <div>
              <p className="text-2xl font-bold text-[#1D1D1D]">{pairedGuests.length}</p>
              <p className="text-sm text-[#5A544C]">Gepaard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unpaired Guests */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#1D1D1D] mb-4">Ungepaarte Gäste</h3>
        
        {unpairedGuests.length === 0 ? (
          <div className="bg-gray-50 border border-[#E6DEC8] rounded-lg p-8 text-center">
            <CheckCircle className="w-12 h-12 text-[#74CF6C] mx-auto mb-2" />
            <p className="text-[#5A544C]">Alle Gäste sind bereits gepaard! 🎉</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {unpairedGuests.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => handleSelectGuest(booking.id)}
                  className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedGuests.includes(booking.id)
                      ? 'border-[#74CF6C] bg-[#74CF6C]/5'
                      : 'border-[#E6DEC8] hover:border-[#74CF6C]/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#74CF6C]/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-[#74CF6C]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1D1D1D]">{booking.guest_name}</p>
                        <p className="text-sm text-[#5A544C]">{booking.email}</p>
                        <p className="text-xs text-[#5A544C] mt-1">
                          Gebucht am: {new Date(booking.booking_date).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                    </div>
                    {selectedGuests.includes(booking.id) && (
                      <CheckCircle className="w-5 h-5 text-[#74CF6C]" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedGuests.length > 0 && (
              <div className="bg-[#74CF6C]/10 border border-[#74CF6C] rounded-lg p-4 flex items-center justify-between">
                <p className="text-[#1D1D1D]">
                  <strong>{selectedGuests.length}</strong> {selectedGuests.length === 1 ? 'Gast' : 'Gäste'} ausgewählt
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGuests([])}
                    className="px-4 py-2 text-[#5A544C] hover:bg-white/50 rounded-lg transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handlePairGuests}
                    disabled={selectedGuests.length !== 2}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedGuests.length === 2
                        ? 'bg-[#74CF6C] text-white hover:bg-[#5eb556]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Als Zimmerpartner zuordnen
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Paired Guests */}
      {pairedGuests.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-[#1D1D1D] mb-4">Gepaarte Zimmerpartner</h3>
          <div className="space-y-4">
            {Object.entries(
              pairedGuests.reduce((acc, booking) => {
                const pairKey = [booking.id, booking.roommate_id].sort().join('-');
                if (!acc[pairKey]) {
                  acc[pairKey] = [];
                }
                acc[pairKey].push(booking);
                return acc;
              }, {})
            ).map(([pairKey, pair]) => {
              if (pair.length === 2) {
                return (
                  <div key={pairKey} className="bg-white border border-[#E6DEC8] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#74CF6C]" />
                        <span className="font-bold text-[#1D1D1D]">Zimmer-Paar</span>
                      </div>
                      <button
                        onClick={() => handleUnpairGuest(pair[0].id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Paarung aufheben
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pair.map((booking) => (
                        <div key={booking.id} className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#74CF6C]/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-[#74CF6C]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1D1D1D]">{booking.guest_name}</p>
                            <p className="text-sm text-[#5A544C]">{booking.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoommatePairing;
