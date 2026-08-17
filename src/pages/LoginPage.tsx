import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Enter email and password'); return; }
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch { setError('Invalid email or password'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-system-green/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-system-blue/5 rounded-full blur-[128px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-sm">
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-system-green mb-4">
              <Trophy className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/40 text-sm mt-1">Sign in to find your next match</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                className="pl-11 h-12 bg-[#1C1C1E] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-system-green focus:ring-system-green/20" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-[#1C1C1E] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-system-green focus:ring-system-green/20" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-sm text-system-red text-center">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-system-green text-black font-semibold rounded-xl hover:bg-system-green/90">
              {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <Button type="button" variant="outline" onClick={() => loginWithGoogle().then(() => navigate('/'))} className="w-full h-11 border-white/10 text-white hover:bg-white/5 rounded-xl">
              Continue with Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-white/40">
            No account?{' '}
            <button onClick={() => navigate('/signup')} className="text-system-green hover:text-system-green/80 font-medium">Create one</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}