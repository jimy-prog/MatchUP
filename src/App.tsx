import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import './i18n';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { HomePage } from '@/pages/HomePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MatchesPage } from '@/pages/MatchesPage';
import { MatchDetailPage } from '@/pages/MatchDetailPage';
import { CreateMatchPage } from '@/pages/CreateMatchPage';
import { VenuesPage } from '@/pages/VenuesPage';
import { VenueDetailPage } from '@/pages/VenueDetailPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ContactPage } from '@/pages/ContactPage';
import { PrivacyPage } from '@/pages/PrivacyPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-system-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pb-24 lg:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}

function App() {
  const { initAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/matches" element={<AppLayout><MatchesPage /></AppLayout>} />
        <Route path="/matches/:id" element={<AppLayout><MatchDetailPage /></AppLayout>} />
        <Route path="/venues" element={<AppLayout><VenuesPage /></AppLayout>} />
        <Route path="/venues/:id" element={<AppLayout><VenueDetailPage /></AppLayout>} />
        <Route path="/leaderboard" element={<AppLayout><LeaderboardPage /></AppLayout>} />
        <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
        <Route path="/privacy" element={<AppLayout><PrivacyPage /></AppLayout>} />
        
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
        <Route path="/create-match" element={<ProtectedRoute><AppLayout><CreateMatchPage /></AppLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1C1C1E', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' },
      }} />
    </BrowserRouter>
  );
}

export default App;
