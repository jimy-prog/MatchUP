import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, DollarSign, FileText, Lock, ArrowLeft, PlusCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuthStore, useMatchStore, useVenueStore } from '@/store';
import type { SportType } from '@/types';

const sports: { value: SportType; label: string; emoji: string }[] = [
  { value: 'football', label: 'Football', emoji: '⚽' },
  { value: 'basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'volleyball', label: 'Volleyball', emoji: '🏐' },
  { value: 'tennis', label: 'Tennis', emoji: '🎾' },
  { value: 'swimming', label: 'Swimming', emoji: '🏊' },
  { value: 'boxing', label: 'Boxing', emoji: '🥊' },
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
];

const skillLevels = [
  { value: 'any', label: 'Any Level' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function CreateMatchPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createMatch } = useMatchStore();
  const { venues, fetchVenues } = useVenueStore();

  useEffect(() => { fetchVenues(); }, [fetchVenues]);

  const [sport, setSport] = useState<SportType>('football');
  const [venueId, setVenueId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [price, setPrice] = useState(50000);
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [skillLevel, setSkillLevel] = useState('any');
  const [isLoading, setIsLoading] = useState(false);

  const selectedVenue = venues.find(v => v.id === venueId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !venueId || !date || !time) return;
    setIsLoading(true);
    try {
      const matchDate = new Date(`${date}T${time}`);
      await createMatch({
        creatorId: user.id,
        creatorName: user.name,
        sport,
        venueId,
        venueName: selectedVenue?.name || 'Unknown Venue',
        location: {
          lat: selectedVenue?.location.lat || 41.2995,
          lng: selectedVenue?.location.lng || 69.2401,
          address: selectedVenue?.address || 'Tashkent',
        },
        date: matchDate,
        maxPlayers,
        players: [user.id],
        playerNames: [user.name],
        status: 'open',
        pricePerPlayer: price,
        description,
        isPrivate,
        skillLevel: skillLevel as any,
      });
      navigate('/matches');
    } catch (err) {
      console.error('Error creating match:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h1 className="text-2xl font-bold text-white mb-1">Create Match</h1>
          <p className="text-white/40 text-sm mb-6">Set up a game and invite players</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sport */}
            <div>
              <label className="text-sm font-medium text-white/60 mb-2 block">Sport</label>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {sports.map(s => (
                  <button key={s.value} type="button" onClick={() => setSport(s.value)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${sport === s.value ? 'bg-system-green text-black' : 'bg-[#1C1C1E] text-white/50 border border-white/[0.06]'}`}>
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="text-sm font-medium text-white/60 mb-2 block">Venue</label>
              {venues.length === 0 ? (
                <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/[0.06] text-center">
                  <p className="text-sm text-white/40">No venues available yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                  {venues.map(v => (
                    <button key={v.id} type="button" onClick={() => setVenueId(v.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${venueId === v.id ? 'bg-system-green/10 border-system-green/30' : 'bg-[#1C1C1E] border-white/[0.06] hover:border-white/10'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium text-sm ${venueId === v.id ? 'text-system-green' : 'text-white'}`}>{v.name}</p>
                          <p className="text-xs text-white/40 mt-0.5">{v.address}</p>
                        </div>
                        <span className="text-sm font-bold text-white">{v.pricePerHour.toLocaleString()} <span className="text-xs font-normal text-white/40">UZS/hr</span></span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Date</label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required
                  className="h-12 bg-[#1C1C1E] border-white/[0.06] text-white rounded-xl focus:border-system-green" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Time</label>
                <Input type="time" value={time} onChange={e => setTime(e.target.value)} required
                  className="h-12 bg-[#1C1C1E] border-white/[0.06] text-white rounded-xl focus:border-system-green" />
              </div>
            </div>

            {/* Players & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Max Players</label>
                <Input type="number" min={2} max={30} value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} required
                  className="h-12 bg-[#1C1C1E] border-white/[0.06] text-white rounded-xl focus:border-system-green" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 mb-2 block">Price (UZS)</label>
                <Input type="number" min={0} step={1000} value={price} onChange={e => setPrice(Number(e.target.value))} required
                  className="h-12 bg-[#1C1C1E] border-white/[0.06] text-white rounded-xl focus:border-system-green" />
              </div>
            </div>

            {/* Skill Level */}
            <div>
              <label className="text-sm font-medium text-white/60 mb-2 block">Skill Level</label>
              <div className="flex gap-2">
                {skillLevels.map(sl => (
                  <button key={sl.value} type="button" onClick={() => setSkillLevel(sl.value)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${skillLevel === sl.value ? 'bg-system-green text-black' : 'bg-[#1C1C1E] text-white/50 border border-white/[0.06]'}`}>
                    {sl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-white/60 mb-2 block">Description</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add any details about the match..."
                className="bg-[#1C1C1E] border-white/[0.06] text-white placeholder:text-white/20 rounded-xl focus:border-system-green" rows={3} />
            </div>

            {/* Private */}
            <div className="flex items-center justify-between p-4 bg-[#1C1C1E] rounded-2xl border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-sm font-medium text-white">Private Match</p>
                  <p className="text-xs text-white/40">Only invited players can join</p>
                </div>
              </div>
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isLoading || !venueId} className="flex-1 h-12 bg-system-green text-black hover:bg-system-green/90 rounded-xl font-semibold">
                {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Create Match'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/matches')} className="h-12 px-6 border-white/10 text-white hover:bg-white/5 rounded-xl">
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}