import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, Filter, Search, ChevronRight, Clock } from 'lucide-react';
import { useAuthStore, useMatchStore, useVenueStore } from '@/store';
import type { SportType } from '@/types';

const sports: { value: SportType | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🏆' },
  { value: 'football', label: 'Football', emoji: '⚽' },
  { value: 'basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'volleyball', label: 'Volleyball', emoji: '🏐' },
  { value: 'tennis', label: 'Tennis', emoji: '🎾' },
  { value: 'swimming', label: 'Swimming', emoji: '🏊' },
  { value: 'boxing', label: 'Boxing', emoji: '🥊' },
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
];

export function MatchesPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { matches, fetchMatches, isLoading } = useMatchStore();
  const { venues, fetchVenues } = useVenueStore();
  const [activeSport, setActiveSport] = useState<SportType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'joined'>('all');

  useEffect(() => { fetchMatches(); fetchVenues(); }, [fetchMatches, fetchVenues]);

  const filtered = matches.filter(m => {
    const sportOk = activeSport === 'all' || m.sport === activeSport;
    const searchOk = !searchQuery || m.venueName.toLowerCase().includes(searchQuery.toLowerCase()) || m.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const joinedOk = viewMode === 'all' || (user && m.players.includes(user.id));
    return sportOk && searchOk && joinedOk && m.status !== 'cancelled';
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Matches</h1>
            <button onClick={() => isAuthenticated ? navigate('/create-match') : navigate('/login')}
              className="flex items-center gap-2 bg-system-green text-black px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-system-green/90 transition-colors">
              <Plus className="w-4 h-4" /> Create
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" placeholder="Search matches, venues..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-[#1C1C1E] border border-white/[0.06] rounded-2xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-system-green/50" />
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide pb-1">
          <div className="flex gap-2">
            {sports.map(s => (
              <button key={s.value} onClick={() => setActiveSport(s.value)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeSport === s.value ? 'bg-system-green text-black' : 'bg-[#1C1C1E] text-white/50 border border-white/[0.06]'}`}>
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex gap-2">
            <button onClick={() => setViewMode('all')} className={`px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${viewMode === 'all' ? 'bg-white/10 text-white' : 'text-white/40'}`}>All</button>
            <button onClick={() => setViewMode('joined')} className={`px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${viewMode === 'joined' ? 'bg-white/10 text-white' : 'text-white/40'}`}>My Matches</button>
          </div>
        </motion.div>

        {/* Matches List */}
        {isLoading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-system-green border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg mb-2">No matches found</p>
            <p className="text-white/30 text-sm mb-6">{viewMode === 'joined' ? "You haven't joined any matches yet" : 'Be the first to create a match!'}</p>
            <button onClick={() => isAuthenticated ? navigate('/create-match') : navigate('/login')}
              className="bg-system-green text-black px-6 py-3 rounded-xl font-semibold hover:bg-system-green/90 transition-colors">
              Create Match
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((match, i) => (
              <motion.div key={match.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/matches/${match.id}`)}
                className="flex items-center gap-4 bg-[#1C1C1E] rounded-2xl p-4 border border-white/[0.06] hover:border-system-green/30 transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-[#2C2C2E] rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-white/40 uppercase">{new Date(match.date).toLocaleDateString([], { month: 'short' })}</span>
                  <span className="text-lg font-bold text-white leading-none">{new Date(match.date).getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-system-green bg-system-green/10 px-2 py-0.5 rounded-full">{match.sport}</span>
                    {match.isPrivate && <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">Private</span>}
                    {match.status === 'full' && <span className="text-xs text-system-orange bg-system-orange/10 px-2 py-0.5 rounded-full">Full</span>}
                  </div>
                  <h3 className="font-semibold text-white text-sm truncate group-hover:text-system-green transition-colors">{match.venueName}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{match.location.address}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{match.players.length}/{match.maxPlayers}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">{match.pricePerPlayer.toLocaleString()}</p>
                  <p className="text-[10px] text-white/40">UZS / player</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-system-green transition-colors flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}