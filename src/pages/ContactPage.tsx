import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-1">Contact Us</h1>
          <p className="text-white/40 text-sm mb-6">Get in touch with the MatchUp team</p>

          <div className="bg-[#1C1C1E] rounded-3xl p-6 border border-white/[0.06] space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-system-blue/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-system-blue" />
              </div>
              <div>
                <p className="text-xs text-white/40">Email</p>
                <a href="mailto:admin@matchup.uz" className="text-white hover:text-system-green transition-colors">admin@matchup.uz</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-system-green/10 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-system-green" />
              </div>
              <div>
                <p className="text-xs text-white/40">Phone</p>
                <a href="tel:+998901234567" className="text-white hover:text-system-green transition-colors">+998 90 123 45 67</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-system-orange/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-system-orange" />
              </div>
              <div>
                <p className="text-xs text-white/40">Location</p>
                <p className="text-white">Tashkent, Uzbekistan</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}