import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, Trophy, Clock, ChevronRight, Flame, TrendingUp } from 'lucide-react';
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

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { matches, fetchMatches } = useMatchStore();
  const { venues, fetchVenues } = useVenueStore();
  const [activeSport, setActiveSport] = useState<SportType | 'all'>('all');

  useEffect(() => { fetchMatches(); fetchVenues(); }, [fetchMatches, fetchVenues]);

  const filtered = activeSport === 'all' ? matches : matches.filter(m => m.sport === activeSport);
  const today = new Date();
  const todayMatches = filtered.filter(m => {
    const d = new Date(m.date);
    return d.toDateString() === today.toDateString() && m.status === 'open';
  });
  const upcoming = filtered.filter(m => new Date(m.date) > today && m.status === 'open').slice(0, 5);

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            {isAuthenticated ? `Hi, ${user?.name.split(' ')[0]}!` : 'Find Your Game'}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {todayMatches.length > 0 ? `${todayMatches.length} games happening today` : 'Discover matches near you'}
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-3 mb-6 overflow-x-auto scrollbar-hide pb-1">
          <button onClick={() => isAuthenticated ? navigate('/create-match') : navigate('/login')}
            className="flex items-center gap-2 bg-system-green text-black px-5 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap hover:bg-system-green/90 transition-colors">
            <Plus className="w-4 h-4" /> Create Match
          </button>
          <button onClick={() => navigate('/venues')}
            className="flex items-center gap-2 bg-[#1C1C1E] text-white px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap border border-white/[0.06] hover:bg-[#2C2C2E] transition-colors">
            <MapPin className="w-4 h-4 text-system-green" /> Find Venue
          </button>
          <button onClick={() => navigate('/leaderboard')}
            className="flex items-center gap-2 bg-[#1C1C1E] text-white px-5 py-3 rounded-2xl font-medium text-sm whitespace-nowrap border border-white/[0.06] hover:bg-[#2C2C2E] transition-colors">
            <Trophy className="w-4 h-4 text-system-orange" /> Rankings
          </button>
        </motion.div>

        {/* Sport Filter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          <button onClick={() => setActiveSport('all')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeSport === 'all' ? 'bg-system-green text-black' : 'bg-[#1C1C1E] text-white/60 border border-white/[0.06]'}`}>
            All Sports
          </button>
          {sports.map(s => (
            <button key={s.value} onClick={() => setActiveSport(s.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeSport === s.value ? 'bg-system-green text-black' : 'bg-[#1C1C1E] text-white/60 border border-white/[0.06]'}`}>
              {s.emoji} {s.label}
            </button>
          ))}
        </motion.div>

        {/* Today's Matches */}
        {todayMatches.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-system-orange" /> Happening Today
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayMatches.map((match, i) => (
                <motion.div key={match.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => navigate(`/matches/${match.id}`)}
                  className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/[0.06] hover:border-system-green/30 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-system-green bg-system-green/10 px-2.5 py-1 rounded-full mb-2">
                        {sports.find(s => s.value === match.sport)?.emoji} {match.sport}
                      </span>
                      <h3 className="font-semibold text-white group-hover:text-system-green transition-colors">{match.venueName}</h3>
                    </div>
                    <span className="text-system-green font-bold text-sm">{match.pricePerPlayer.toLocaleString()} UZS</span>
                  </div>
                  <div className="space-y-1.5 text-sm text-white/50">
                    <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{match.location.address}</div>
                    <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" />{match.players.length}/{match.maxPlayers} players</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-system-green rounded-full transition-all" style={{ width: `${(match.players.length / match.maxPlayers) * 100}%` }} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 ml-3 group-hover:text-system-green transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Upcoming Matches */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-system-blue" /> Upcoming Matches
            </h2>
            <button onClick={() => navigate('/matches')} className="text-sm text-system-green hover:text-system-green/80 font-medium">See All</button>
          </div>
          {upcoming.length === 0 ? (
            <div className="bg-[#1C1C1E] rounded-2xl p-8 text-center border border-white/[0.06]">
              <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No upcoming matches. Be the first to create one!</p>
              <button onClick={() => isAuthenticated ? navigate('/create-match') : navigate('/login')}
                className="mt-4 bg-system-green text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-system-green/90 transition-colors">
                Create Match
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((match) => (
                <div key={match.id} onClick={() => navigate(`/matches/${match.id}`)}
                  className="flex items-center gap-4 bg-[#1C1C1E] rounded-2xl p-4 border border-white/[0.06] hover:border-system-green/30 transition-all cursor-pointer group">
                  <div className="w-14 h-14 bg-[#2C2C2E] rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white/40 uppercase">{new Date(match.date).toLocaleDateString([], { month: 'short' })}</span>
                    <span className="text-lg font-bold text-white leading-none">{new Date(match.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-system-green bg-system-green/10 px-2 py-0.5 rounded-full">{match.sport}</span>
                      <span className="text-xs text-white/30">{match.skillLevel || 'Any level'}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm truncate group-hover:text-system-green transition-colors">{match.venueName}</h3>
                    <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{match.location.address}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">{match.pricePerPlayer.toLocaleString()} <span className="text-xs font-normal text-white/40">UZS</span></p>
                    <p className="text-xs text-white/40">{match.players.length}/{match.maxPlayers} joined</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-system-green transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Popular Venues */}
        {venues.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-system-purple" /> Popular Venues
              </h2>
              <button onClick={() => navigate('/venues')} className="text-sm text-system-green hover:text-system-green/80 font-medium">See All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {venues.slice(0, 3).map((venue) => (
                <div key={venue.id} onClick={() => navigate(`/venues/${venue.id}`)}
                  className="bg-[#1C1C1E] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-system-green/30 transition-all cursor-pointer group">
                  <div className="h-32 bg-gradient-to-br from-[#2C2C2E] to-[#1C1C1E] flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-white/20" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white group-hover:text-system-green transition-colors">{venue.name}</h3>
                    <p className="text-xs text-white/40 mt-1">{venue.address}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-system-green font-bold text-sm">{venue.pricePerHour.toLocaleString()} UZS/hr</span>
                      <div className="flex gap-1">
                        {venue.sports.slice(0, 3).map(s => (
                          <span key={s} className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-white/50">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}