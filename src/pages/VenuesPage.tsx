import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, ChevronRight, Search, List, Map as MapIcon } from 'lucide-react';
import { useVenueStore } from '@/store';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createMarkerIcon = () => L.divIcon({
  className: 'bg-transparent',
  html: `<div style="width:14px;height:14px;background:#34C759;border-radius:50%;border:3px solid #1C1C1E;box-shadow:0 0 8px rgba(52,199,89,0.4);"></div>`,
  iconSize: [14, 14], iconAnchor: [7, 7],
});

export function VenuesPage() {
  const navigate = useNavigate();
  const { venues, fetchVenues, isLoading } = useVenueStore();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchVenues(); }, [fetchVenues]);

  const filtered = venues.filter(v =>
    !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Venues</h1>
            <div className="flex bg-[#1C1C1E] rounded-xl p-1 border border-white/[0.06]">
              <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-system-green text-black' : 'text-white/40'}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-system-green text-black' : 'text-white/40'}`}>
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" placeholder="Search venues..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-[#1C1C1E] border border-white/[0.06] rounded-2xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-system-green/50" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-system-green border-t-transparent rounded-full animate-spin" /></div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((venue, i) => (
              <motion.div key={venue.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/venues/${venue.id}`)}
                className="bg-[#1C1C1E] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-system-green/30 transition-all cursor-pointer group">
                <div className="h-40 bg-gradient-to-br from-[#2C2C2E] to-[#1C1C1E] flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-white/15" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-system-green transition-colors">{venue.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-system-yellow fill-system-yellow" />
                      <span className="text-sm font-medium text-white">{venue.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 mb-3">{venue.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-system-green font-bold text-sm">{venue.pricePerHour.toLocaleString()} <span className="text-xs font-normal text-white/40">UZS/hr</span></span>
                    <div className="flex gap-1">
                      {venue.sports.slice(0, 2).map(s => (
                        <span key={s} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/50">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[600px] bg-[#1C1C1E] rounded-2xl overflow-hidden border border-white/[0.06] z-0">
            <MapContainer center={[41.3111, 69.2406]} zoom={12} style={{ height: '100%', width: '100%', zIndex: 0 }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap &copy; CARTO' />
              {filtered.map(v => (
                <Marker key={v.id} position={[v.location.lat, v.location.lng]} icon={createMarkerIcon()}>
                  <Popup className="custom-popup">
                    <div className="text-center min-w-[140px]">
                      <p className="font-bold text-sm text-black mb-0.5">{v.name}</p>
                      <p className="text-xs text-gray-600">{v.pricePerHour.toLocaleString()} UZS/hr</p>
                      <button onClick={() => navigate(`/venues/${v.id}`)} className="mt-2 bg-system-green text-black text-xs font-bold px-3 py-1 rounded-lg">View</button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
}