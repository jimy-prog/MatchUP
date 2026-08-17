import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, MapPin, Trophy, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) return null;

  const tabs = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/matches', icon: Calendar, label: 'Matches' },
    { path: '/venues', icon: MapPin, label: 'Venues' },
    { path: '/leaderboard', icon: Trophy, label: 'Rankings' },
    { path: isAuthenticated ? '/profile' : '/login', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-white/[0.06] safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-1 w-16 h-full tap-highlight-none"
            >
              <tab.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-system-green' : 'text-white/40'}`} />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-system-green' : 'text-white/40'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-system-green rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}