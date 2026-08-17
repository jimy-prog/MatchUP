import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Trophy, Calendar, Edit, Camera, Check, LogOut, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const winRate = user.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile({ name, city, phone });
      setIsEditing(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <div className="flex gap-2">
              <button onClick={() => navigate('/settings')} className="p-2.5 rounded-xl bg-[#1C1C1E] border border-white/[0.06] text-white/50 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-system-green text-black text-sm font-semibold hover:bg-system-green/90 transition-colors">
                {isEditing ? <><Check className="w-4 h-4" /> Save</> : <><Edit className="w-4 h-4" /> Edit</>}
              </button>
            </div>
          </div>

          {/* Avatar & Name */}
          <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/[0.06] text-center mb-4">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-system-green/30 to-system-blue/30 rounded-full flex items-center justify-center mx-auto">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white/60" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-system-green rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-black" />
                </button>
              )}
            </div>
            {isEditing ? (
              <Input value={name} onChange={e => setName(e.target.value)} className="max-w-xs mx-auto bg-[#2C2C2E] border-white/[0.06] text-white text-center rounded-xl" />
            ) : (
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
            )}
            <p className="text-sm text-white/40 mt-1 capitalize">{user.role} • {user.city}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#1C1C1E] rounded-2xl p-4 text-center border border-white/[0.06]">
              <p className="text-xl font-bold text-system-green">{user.rating}</p>
              <p className="text-[10px] text-white/40 mt-0.5">Rating</p>
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl p-4 text-center border border-white/[0.06]">
              <p className="text-xl font-bold text-white">{user.gamesPlayed}</p>
              <p className="text-[10px] text-white/40 mt-0.5">Games</p>
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl p-4 text-center border border-white/[0.06]">
              <p className="text-xl font-bold text-system-blue">{winRate}%</p>
              <p className="text-[10px] text-white/40 mt-0.5">Win Rate</p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/[0.06] mb-4 space-y-4">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Email</label>
              <p className="text-sm text-white">{user.email}</p>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block flex items-center gap-1"><MapPin className="w-3 h-3" /> City</label>
              {isEditing ? (
                <Input value={city} onChange={e => setCity(e.target.value)} className="bg-[#2C2C2E] border-white/[0.06] text-white rounded-xl" />
              ) : (
                <p className="text-sm text-white">{user.city}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Phone</label>
              {isEditing ? (
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998..." className="bg-[#2C2C2E] border-white/[0.06] text-white rounded-xl" />
              ) : (
                <p className="text-sm text-white">{user.phone || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block flex items-center gap-1"><Trophy className="w-3 h-3" /> Preferred Sports</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.preferredSports.map(s => (
                  <span key={s} className="px-3 py-1 bg-system-green/10 text-system-green text-xs font-medium rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block flex items-center gap-1"><Calendar className="w-3 h-3" /> Member Since</label>
              <p className="text-sm text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Logout */}
          <Button onClick={handleLogout} variant="outline" className="w-full h-12 border-system-red/30 text-system-red hover:bg-system-red/10 rounded-xl font-semibold">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}