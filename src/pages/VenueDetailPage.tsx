import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVenueStore } from '@/store';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const createMarkerIcon = () => L.divIcon({
  className: 'bg-transparent',
  html: `<div style="width:16px;height:16px;background:#34C759;border-radius:50%;border:3px solid #1C1C1E;box-shadow:0 0 12px rgba(52,199,89,0.5);"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8],
});

export function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentVenue, fetchVenueById } = useVenueStore();

  useEffect(() => { if (id) fetchVenueById(id); }, [id, fetchVenueById]);

  const venue = currentVenue;
  if (!venue) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-system-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Hero Image Placeholder */}
          <div className="h-56 bg-gradient-to-br from-[#2C2C2E] to-[#1C1C1E] rounded-3xl flex items-center justify-center mb-6 border border-white/[0.06]">
            <MapPin className="w-12 h-12 text-white/15" />
          </div>

          {/* Info */}
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{venue.name}</h1>
                <p className="text-sm text-white/40 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{venue.address}</p>
              </div>
              <div className="flex items-center gap-1 bg-system-green/10 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-system-yellow fill-system-yellow" />
                <span className="text-sm font-bold text-white">{venue.rating}</span>
                <span className="text-xs text-white/40">({venue.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#1C1C1E] rounded-2xl p-4 text-center border border-white/[0.06]">
              <p className="text-lg font-bold text-system-green">{venue.pricePerHour.toLocaleString()}</p>
              <p className="text-[10px] text-white/40 mt-0.5">UZS / hour</p>
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl p-4 text-center border border-white/[0.06]">
              <p className="text-lg font-bold text-system-blue">{venue.sports.length}</p>
              <p className="text-[10px] text-white/40 mt-0.5">Sports</p>
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl p-4 text-center border border-white/[0.06]">
              <p className="text-lg font-bold text-system-orange">{venue.amenities.length}</p>
              <p className="text-[10px] text-white/40 mt-0.5">Amenities</p>
            </div>
          </div>

          {/* Sports */}
          <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/[0.06] mb-4">
            <h3 className="text-sm font-semibold text-white mb-3">Available Sports</h3>
            <div className="flex flex-wrap gap-2">
              {venue.sports.map(s => (
                <span key={s} className="px-3 py-1.5 bg-system-green/10 text-system-green text-sm font-medium rounded-full">{s}</span>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/[0.06] mb-4">
            <h3 className="text-sm font-semibold text-white mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {venue.amenities.map(a => (
                <span key={a} className="px-3 py-1.5 bg-white/5 text-white/60 text-sm rounded-full">{a}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          {venue.description && (
            <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/[0.06] mb-4">
              <h3 className="text-sm font-semibold text-white mb-2">About</h3>
              <p className="text-sm text-white/50 leading-relaxed">{venue.description}</p>
            </div>
          )}

          {/* Map */}
          <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/[0.06] mb-6">
            <div className="h-48">
              <MapContainer center={[venue.location.lat, venue.location.lng]} zoom={14} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                <Marker position={[venue.location.lat, venue.location.lng]} icon={createMarkerIcon()} />
              </MapContainer>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={() => navigate(`/create-match`)} className="flex-1 h-12 bg-system-green text-black hover:bg-system-green/90 rounded-xl font-semibold">
              <Calendar className="w-4 h-4 mr-2" /> Book for Match
            </Button>
            {venue.phone && (
              <Button variant="outline" className="h-12 px-5 border-white/10 text-white hover:bg-white/5 rounded-xl" asChild>
                <a href={`tel:${venue.phone}`}><Phone className="w-4 h-4" /></a>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}