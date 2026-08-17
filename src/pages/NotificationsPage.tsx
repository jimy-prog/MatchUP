import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Calendar, Users, Trophy, CheckCircle2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface NotificationItem {
  id: string;
  type: 'match_invite' | 'player_joined' | 'match_reminder' | 'system';
  title: string;
  message: string;
  read: boolean;
  time: string;
}

const mockNotifications: NotificationItem[] = [
  { id: '1', type: 'match_reminder', title: 'Match Starting Soon', message: 'Your football match at Arena Tashkent starts in 2 hours.', read: false, time: '2h ago' },
  { id: '2', type: 'player_joined', title: 'New Player Joined', message: 'Azizbek K. joined your basketball match.', read: false, time: '5h ago' },
  { id: '3', type: 'match_invite', title: 'Match Invitation', message: 'You are invited to a volleyball match at Sport City.', read: true, time: '1d ago' },
  { id: '4', type: 'system', title: 'Welcome to MatchUp!', message: 'Complete your profile to start finding matches.', read: true, time: '3d ago' },
];

const typeIcons = {
  match_invite: Calendar,
  player_joined: Users,
  match_reminder: Trophy,
  system: Bell,
};

const typeColors = {
  match_invite: 'text-system-blue bg-system-blue/10',
  player_joined: 'text-system-green bg-system-green/10',
  match_reminder: 'text-system-orange bg-system-orange/10',
  system: 'text-system-purple bg-system-purple/10',
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-white/40 text-sm">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className="text-sm text-system-green hover:text-system-green/80 font-medium">
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif, i) => {
                const Icon = typeIcons[notif.type];
                return (
                  <motion.div key={notif.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className={`relative bg-[#1C1C1E] rounded-2xl p-4 border transition-all ${notif.read ? 'border-white/[0.04]' : 'border-system-green/20'}`}>
                    {!notif.read && <div className="absolute top-4 right-4 w-2 h-2 bg-system-green rounded-full" />}
                    <div className="flex items-start gap-3 pr-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${notif.read ? 'text-white/60' : 'text-white'}`}>{notif.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">{notif.message}</p>
                        <p className="text-[10px] text-white/25 mt-2">{notif.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 ml-[52px]">
                      {!notif.read && (
                        <button onClick={() => markRead(notif.id)} className="text-xs text-system-green hover:text-system-green/80 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Mark read
                        </button>
                      )}
                      <button onClick={() => deleteNotification(notif.id)} className="text-xs text-white/30 hover:text-system-red flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}