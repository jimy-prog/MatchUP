import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, Users, Flame } from 'lucide-react';
import { useAuthStore } from '@/store';

const leaderboardData = [
  { rank: 1, name: 'Azizbek K.', rating: 2450, games: 156, wins: 134, streak: 8, avatar: 'AK' },
  { rank: 2, name: 'Dmitry S.', rating: 2380, games: 142, wins: 118, streak: 5, avatar: 'DS' },
  { rank: 3, name: 'Jasur T.', rating: 2290, games: 128, wins: 105, streak: 3, avatar: 'JT' },
  { rank: 4, name: 'Bobur M.', rating: 2150, games: 98, wins: 76, streak: 2, avatar: 'BM' },
  { rank: 5, name: 'Sardor A.', rating: 2080, games: 112, wins: 82, streak: 4, avatar: 'SA' },
  { rank: 6, name: 'Vladimir P.', rating: 1950, games: 87, wins: 58, streak: 0, avatar: 'VP' },
  { rank: 7, name: 'Komil R.', rating: 1890, games: 76, wins: 48, streak: 1, avatar: 'KR' },
  { rank: 8, name: 'Timur H.', rating: 1820, games: 65, wins: 42, streak: 6, avatar: 'TH' },
  { rank: 9, name: 'Oleg K.', rating: 1750, games: 54, wins: 32, streak: 0, avatar: 'OK' },
  { rank: 10, name: 'Rustam B.', rating: 1680, games: 48, wins: 28, streak: 2, avatar: 'RB' },
];

const getRankColor = (rank: number) => {
  if (rank === 1) return 'from-system-yellow to-system-orange';
  if (rank === 2) return 'from-gray-300 to-gray-400';
  if (rank === 3) return 'from-amber-600 to-amber-700';
  return 'from-system-green to-system-blue';
};

export function LeaderboardPage() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-1">Rankings</h1>
          <p className="text-white/40 text-sm mb-6">Top players this season</p>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {(['all', 'week', 'month'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-system-green text-black' : 'bg-[#1C1C1E] text-white/50 border border-white/[0.06]'}`}>
                {f === 'all' ? 'All Time' : f === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="flex justify-center items-end gap-4 mb-8">
            {/* 2nd */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-2 border-4 border-black shadow-lg">
                <span className="text-xl font-bold text-black">2</span>
              </div>
              <p className="text-white font-medium text-xs">{leaderboardData[1].name}</p>
              <p className="text-system-green font-bold text-sm">{leaderboardData[1].rating}</p>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center -mt-4">
              <div className="w-20 h-20 bg-gradient-to-br from-system-yellow to-system-orange rounded-full flex items-center justify-center mb-2 border-4 border-black shadow-lg shadow-system-yellow/20">
                <Trophy className="w-8 h-8 text-black" />
              </div>
              <p className="text-white font-bold text-sm">{leaderboardData[0].name}</p>
              <p className="text-system-green font-bold text-lg">{leaderboardData[0].rating}</p>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center mb-2 border-4 border-black shadow-lg">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <p className="text-white font-medium text-xs">{leaderboardData[2].name}</p>
              <p className="text-system-green font-bold text-sm">{leaderboardData[2].rating}</p>
            </div>
          </div>

          {/* Full List */}
          <div className="bg-[#1C1C1E] rounded-3xl border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/[0.06] text-white/40 text-xs font-medium">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">Player</div>
              <div className="col-span-2 text-center">Rating</div>
              <div className="col-span-2 text-center">Games</div>
              <div className="col-span-2 text-center">Wins</div>
            </div>
            {leaderboardData.map((player, index) => (
              <motion.div key={player.rank}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.04 }}
                className={`grid grid-cols-12 gap-3 px-4 py-3 items-center ${index < leaderboardData.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.02] transition-colors`}>
                <div className="col-span-1 flex justify-center">
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getRankColor(player.rank)} flex items-center justify-center`}>
                    {player.rank <= 3 ? <Medal className="w-3.5 h-3.5 text-white" /> : <span className="text-white text-xs font-bold">{player.rank}</span>}
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#2C2C2E] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-xs">{player.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-white text-sm font-medium truncate block">{player.name}</span>
                    {player.streak > 3 && <span className="text-[10px] text-system-orange flex items-center gap-0.5"><Flame className="w-3 h-3" />{player.streak} streak</span>}
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-white font-bold text-sm">{player.rating}</span>
                </div>
                <div className="col-span-2 text-center text-white/50 text-sm">{player.games}</div>
                <div className="col-span-2 text-center">
                  <span className="text-system-green text-sm font-medium">{player.wins}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Your Rank */}
          {user && (
            <div className="mt-4 bg-system-green/10 rounded-2xl p-4 border border-system-green/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-system-green/20 rounded-full flex items-center justify-center">
                    <span className="text-system-green font-bold text-sm">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Your Ranking</p>
                    <p className="text-white/40 text-xs">{user.rating} rating • {user.gamesPlayed} games</p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-system-green" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}