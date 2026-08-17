import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) return null;

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-system-green rounded-xl flex items-center justify-center">
              <Trophy className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg tracking-tight">MatchUp</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {['/', '/matches', '/venues', '/leaderboard'].map((path) => (
              <Link key={path} to={path} className={`text-sm font-medium transition-colors ${
                location.pathname === path ? 'text-system-green' : 'text-white/50 hover:text-white'
              }`}>
                {path === '/' ? 'Home' : path === '/matches' ? 'Matches' : path === '/venues' ? 'Venues' : 'Rankings'}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <Bell className="w-5 h-5 text-white/60" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-system-green rounded-full" />
                </button>
                <button onClick={() => navigate('/profile')} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-7 h-7 bg-system-green/20 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-system-green" />
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button onClick={() => navigate('/login')} className="text-sm text-white/60 hover:text-white px-3 py-1.5 transition-colors">Sign In</button>
                <button onClick={() => navigate('/signup')} className="text-sm bg-system-green text-black font-semibold px-4 py-1.5 rounded-xl hover:bg-system-green/90 transition-colors">Get Started</button>
              </div>
            )}

            <button className="md:hidden p-2 rounded-xl hover:bg-white/5" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/[0.06]"
          >
            <nav className="flex flex-col p-4 gap-1">
              {['/', '/matches', '/venues', '/leaderboard'].map((path) => (
                <Link key={path} to={path} onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2.5 px-4 rounded-xl text-sm font-medium ${location.pathname === path ? 'bg-system-green/10 text-system-green' : 'text-white/60 hover:bg-white/5'}`}>
                  {path === '/' ? 'Home' : path === '/matches' ? 'Matches' : path === '/venues' ? 'Venues' : 'Rankings'}
                </Link>
              ))}
              {isAuthenticated && (
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="py-2.5 px-4 rounded-xl text-sm font-medium text-system-red hover:bg-white/5 text-left">
                  Sign Out
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}