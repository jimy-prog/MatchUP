import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Calendar, Users, Plus, Settings, Bell } from 'lucide-react';
import { useAuthStore, useMatchStore, useVenueStore } from '@/store';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { myMatches, fetchMyMatches } = useMatchStore();
  const { myVenues, fetchMyVenues } = useVenueStore();

  useEffect(() => {
    if (user) {
      fetchMyMatches(user.id);
      if (user.role === 'owner') fetchMyVenues(user.id);
    }
  }, [user, fetchMyMatches, fetchMyVenues]);

  if (!user) return null;

  const winRate = user.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;
  const isOwner = user.role === 'owner';
  const isDeveloper = user.role === 'developer';

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div className="flex gap-2">
              <button onClick={() => navigate('/notifications')} className="p-2.5 rounded-xl bg-[#1C1C1E] border border-white/[0.06] text-white/50 hover:text-white relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-system-green rounded-full" />
              </button>
              <button onClick={() => navigate('/settings')} className="p-2.5 rounded-xl bg-[#1C1C1E] border border-white/[0.06] text-white/50 hover:text-white">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Welcome */}
          <div className="bg-gradient-to-br from-system-green/20 to-system-blue/10 rounded-3xl p-6 border border-system-green/20 mb-6">
            <h2 className="text-lg font-bold text-white">Welcome back, {user.name.split(' ')[0]}!</h2>
            <p className="text-white/50 text-sm mt-1">Ready for your next match?</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => navigate('/create-match')} className="bg-system-green text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-system-green/90 transition-colors">
                <Plus className="w-4 h-4 inline mr-1.5" /> Create Match
              </button>
              <button onClick={() => navigate('/matches')} className="bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/15 transition-colors">
                Find Games
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/[0.06]">
              <Trophy className="w-5 h-5 text-system-green mb-2" />
              <p className="text-2xl font-bold text-white">{user.rating}</p>
              <p className="text-xs text-white/40">Rating</p>
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/[0.06]">
              <Calendar className="w-5 h-5 text-system-blue mb-2" />
              <p className="text-2xl font-bold text-white">{user.gamesPlayed}</p>
              <p className="text-xs text-white/40">Games Played</p>
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/[0.06]">
              <Users className="w-5 h-5 text-system-purple mb-2" />
              <p className="text-2xl font-bold text-white">{winRate}%</p>
              <p className="text-xs text-white/40">Win Rate</p>
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/[0.06]">
              <Trophy className="w-5 h-5 text-system-orange mb-2" />
              <p className="text-2xl font-bold text-white">{user.wins}</p>
              <p className="text-xs text-white/40">Wins</p>
            </div>
          </div>

          {/* My Matches */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">My Matches</h3>
              <button onClick={() => navigate('/matches')} className="text-xs text-system-green hover:text-system-green/80 font-medium">See All</button>
            </div>
            {myMatches.length === 0 ? (
              <div className="bg-[#1C1C1E] rounded-2xl p-6 text-center border border-white/[0.06]">
                <Calendar className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">No matches yet</p>
                <button onClick={() => navigate('/create-match')} className="mt-3 text-system-green text-sm font-medium">Create your first match</button>
              </div>
            ) : (
              <div className="space-y-2">
                {myMatches.slice(0, 3).map(match => (
                  <div key={match.id} onClick={() => navigate(`/matches/${match.id}`)}
                    className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/[0.06] hover:border-system-green/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-system-green bg-system-green/10 px-2 py-0.5 rounded-full">{match.sport}</span>
                        <p className="text-sm font-medium text-white mt-1">{match.venueName}</p>
                        <p className="text-xs text-white/40">{new Date(match.date).toLocaleDateString()} • {match.players.length}/{match.maxPlayers} players</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${match.status === 'open' ? 'bg-system-green/10 text-system-green' : match.status === 'full' ? 'bg-system-orange/10 text-system-orange' : 'bg-white/5 text-white/40'}`}>
                        {match.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Owner Section */}
          {isOwner && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">My Venues</h3>
                <button onClick={() => navigate('/venues')} className="text-xs text-system-green hover:text-system-green/80 font-medium">Manage</button>
              </div>
              {myVenues.length === 0 ? (
                <div className="bg-[#1C1C1E] rounded-2xl p-6 text-center border border-white/[0.06]">
                  <p className="text-white/40 text-sm">No venues registered</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {myVenues.map(venue => (
                    <div key={venue.id} onClick={() => navigate(`/venues/${venue.id}`)}
                      className="bg-[#1C1C1E] rounded-2xl p-4 border border-white/[0.06] hover:border-system-green/30 transition-all cursor-pointer">
                      <p className="text-sm font-medium text-white">{venue.name}</p>
                      <p className="text-xs text-white/40">{venue.address}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Developer Section */}
          {isDeveloper && (
            <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/[0.06]">
              <h3 className="font-semibold text-white mb-3">Admin Overview</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center"><p className="text-lg font-bold text-system-green">--</p><p className="text-[10px] text-white/40">Users</p></div>
                <div className="text-center"><p className="text-lg font-bold text-system-blue">--</p><p className="text-[10px] text-white/40">Venues</p></div>
                <div className="text-center"><p className="text-lg font-bold text-system-orange">--</p><p className="text-[10px] text-white/40">Matches</p></div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}