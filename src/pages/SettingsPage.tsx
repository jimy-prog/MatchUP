import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Moon, Sun, Bell, Shield, User, Lock, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useThemeStore } from '@/store';
import { toast } from 'sonner';

const languages = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

          <div className="space-y-4">
            {/* Language */}
            <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-system-blue/10 rounded-xl flex items-center justify-center">
                  <Globe className="w-4 h-4 text-system-blue" />
                </div>
                <h3 className="font-semibold text-white">Language</h3>
              </div>
              <div className="flex gap-2">
                {languages.map(lang => (
                  <button key={lang.code} onClick={() => toast.success(`Language set to ${lang.label}`)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${lang.code === 'en' ? 'bg-system-blue/10 border-system-blue/30 text-system-blue' : 'bg-[#2C2C2E] border-white/[0.06] text-white/50'}`}>
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-system-purple/10 rounded-xl flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-system-purple" /> : <Sun className="w-4 h-4 text-system-yellow" />}
                </div>
                <h3 className="font-semibold text-white">Appearance</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setTheme('dark')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${theme === 'dark' ? 'bg-system-purple/10 border-system-purple/30 text-system-purple' : 'bg-[#2C2C2E] border-white/[0.06] text-white/50'}`}>
                  <Moon className="w-4 h-4 inline mr-1.5" /> Dark
                </button>
                <button onClick={() => setTheme('light')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${theme === 'light' ? 'bg-system-yellow/10 border-system-yellow/30 text-system-yellow' : 'bg-[#2C2C2E] border-white/[0.06] text-white/50'}`}>
                  <Sun className="w-4 h-4 inline mr-1.5" /> Light
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/[0.06] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-system-green/10 rounded-xl flex items-center justify-center">
                  <Bell className="w-4 h-4 text-system-green" />
                </div>
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              {[
                { label: 'Push Notifications', desc: 'Get notified about match updates', defaultChecked: true },
                { label: 'Email Notifications', desc: 'Receive email summaries', defaultChecked: true },
                { label: 'Match Reminders', desc: 'Reminders before your games', defaultChecked: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="text-xs text-white/40">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </div>

            {/* Privacy */}
            <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/[0.06] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-system-blue/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-4 h-4 text-system-blue" />
                </div>
                <h3 className="font-semibold text-white">Privacy</h3>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-white">Public Profile</p>
                  <p className="text-xs text-white/40">Allow others to see your stats</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            {/* Account */}
            <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-system-red/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-4 h-4 text-system-red" />
                </div>
                <h3 className="font-semibold text-white">Account</h3>
              </div>
              <button className="w-full text-left py-3 px-4 bg-[#2C2C2E] rounded-xl text-sm text-white hover:bg-white/5 transition-colors">
                Change Password
              </button>
              <button className="w-full text-left py-3 px-4 bg-system-red/10 rounded-xl text-sm text-system-red hover:bg-system-red/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}