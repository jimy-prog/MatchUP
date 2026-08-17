import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';

export function SignupPage() {
  const navigate = useNavigate();
  const { registerWithEmail } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Name, email required. Password min 6 chars.');
      return;
    }
    setIsLoading(true);
    try {
      await registerWithEmail(email, password, name);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch { setError('Registration failed. Try again.'); }
    finally { setIsLoading(false); }
  };

  if (success) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
        <div className="w-16 h-16 bg-system-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-system-green" />
        </div>
        <h2 className="text-xl font-bold text-white">Welcome to MatchUp!</h2>
        <p className="text-white/40 text-sm mt-2">Redirecting...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-system-green/5 rounded-full blur-[128px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-sm">
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-system-green mb-4">
              <Trophy className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">Get Started</h1>
            <p className="text-white/40 text-sm mt-1">Create your player profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
              className="h-12 bg-[#1C1C1E] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-system-green" />
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                className="pl-11 h-12 bg-[#1C1C1E] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-system-green" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input type={showPassword ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-[#1C1C1E] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-system-green" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-sm text-system-red text-center">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-system-green text-black font-semibold rounded-xl hover:bg-system-green/90">
              {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-system-green hover:text-system-green/80 font-medium">Sign In</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}