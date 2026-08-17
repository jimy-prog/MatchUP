import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle2, Share2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore, useMatchStore } from '@/store';
import { toast } from 'sonner';

export function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { currentMatch, fetchMatchById, joinMatch, leaveMatch, cancelMatch } = useMatchStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (id) fetchMatchById(id); }, [id, fetchMatchById]);

  const match = currentMatch;
  if (!match) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-system-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isJoined = user ? match.players.includes(user.id) : false;
  const isCreator = user?.id === match.creatorId;
  const isFull = match.players.length >= match.maxPlayers;
  const spotsLeft = match.maxPlayers - match.players.length;

  const handleJoin = async () => {
    if (!isAuthenticated || !user) { navigate('/login'); return; }
    if (isFull) { toast.error('This match is full'); return; }
    setIsLoading(true);
    try {
      await joinMatch(match.id, user.id, user.name);
      toast.success('You joined the match!');
    } catch { toast.error('Failed to join'); }
    finally { setIsLoading(false); }
  };

  const handleLeave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await leaveMatch(match.id, user.id, user.name);
      toast.success('You left the match');
    } catch { toast.error('Failed to leave'); }
    finally { setIsLoading(false); }
  };

  const handleCancel = async () => {
    if (!isCreator) return;
    setIsLoading(true);
    try {
      await cancelMatch(match.id);
      toast.success('Match cancelled');
      navigate('/matches');
    } catch { toast.error('Failed to cancel'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Header Card */}
          <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/[0.06] mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-system-green bg-system-green/10 px-2.5 py-1 rounded-full mb-2">
                  {match.sport}
                </span>
                <h1 className="text-xl font-bold text-white">{match.venueName}</h1>
                <p className="text-sm text-white/40 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{match.location.address}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-system-green">{match.pricePerPlayer.toLocaleString()}</p>
                <p className="text-xs text-white/40">UZS / player</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#2C2C2E] rounded-xl p-3 text-center">
                <Calendar className="w-4 h-4 text-system-blue mx-auto mb-1" />
                <p className="text-xs text-white/40">Date</p>
                <p className="text-sm font-semibold text-white">{new Date(match.date).toLocaleDateString()}</p>
              </div>
              <div className="bg-[#2C2C2E] rounded-xl p-3 text-center">
                <Clock className="w-4 h-4 text-system-orange mx-auto mb-1" />
                <p className="text-xs text-white/40">Time</p>
                <p className="text-sm font-semibold text-white">{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="bg-[#2C2C2E] rounded-xl p-3 text-center">
                <Users className="w-4 h-4 text-system-purple mx-auto mb-1" />
                <p className="text-xs text-white/40">Players</p>
                <p className="text-sm font-semibold text-white">{match.players.length}/{match.maxPlayers}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                <span>{spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining</span>
                <span>{Math.round((match.players.length / match.maxPlayers) * 100)}% full</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-system-green rounded-full transition-all" style={{ width: `${(match.players.length / match.maxPlayers) * 100}%` }} />
              </div>
            </div>

            {/* Actions */}
            {isCreator ? (
              <div className="flex gap-3">
                <Button onClick={handleCancel} disabled={isLoading} className="flex-1 h-12 bg-system-red/20 text-system-red hover:bg-system-red/30 rounded-xl font-semibold">
                  Cancel Match
                </Button>
              </div>
            ) : isJoined ? (
              <div className="flex gap-3">
                <div className="flex-1 h-12 flex items-center justify-center gap-2 bg-system-green/10 text-system-green rounded-xl font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> You're In
                </div>
                <Button onClick={handleLeave} disabled={isLoading} variant="outline" className="h-12 px-6 border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl">
                  Leave
                </Button>
              </div>
            ) : (
              <Button onClick={handleJoin} disabled={isLoading || isFull} className="w-full h-12 bg-system-green text-black hover:bg-system-green/90 rounded-xl font-semibold">
                {isFull ? 'Match Full' : `Join Match • ${match.pricePerPlayer.toLocaleString()} UZS`}
              </Button>
            )}
          </div>

          {/* Description */}
          {match.description && (
            <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/[0.06] mb-4">
              <h3 className="text-sm font-semibold text-white mb-2">About this match</h3>
              <p className="text-sm text-white/50 leading-relaxed">{match.description}</p>
            </div>
          )}

          {/* Players */}
          <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-system-green" /> Players ({match.players.length})
            </h3>
            <div className="space-y-3">
              {match.playerNames.map((name, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-system-green/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-system-green">{name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-white">{name}</span>
                  {i === 0 && <span className="text-[10px] text-system-green bg-system-green/10 px-2 py-0.5 rounded-full">Host</span>}
                </div>
              ))}
              {Array.from({ length: Math.max(0, match.maxPlayers - match.players.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-3 opacity-40">
                  <div className="w-8 h-8 border border-dashed border-white/20 rounded-full flex items-center justify-center" />
                  <span className="text-sm text-white/30">Open spot</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}