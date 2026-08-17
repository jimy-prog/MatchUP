import { motion } from 'framer-motion';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-6">Privacy Policy</h1>

          <div className="space-y-6 text-white/60 text-sm leading-relaxed">
            <section>
              <h2 className="text-system-green font-semibold text-base mb-2">Data We Collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name, email, phone number for account creation</li>
                <li>Location data for nearby match discovery</li>
                <li>Match history, ratings, and activity data</li>
                <li>Payment information processed through secure third-party providers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-system-green font-semibold text-base mb-2">How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To match you with nearby games and players</li>
                <li>To process venue bookings and payments</li>
                <li>To calculate player ratings and rankings</li>
                <li>To send match reminders and platform updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-system-green font-semibold text-base mb-2">Your Rights</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Request access to your personal data</li>
                <li>Request correction or deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-system-green font-semibold text-base mb-2">Security</h2>
              <p>We use industry-standard SSL/TLS encryption for all data transmission. Your payment information is never stored on our servers.</p>
            </section>

            <p className="text-white/30 text-xs pt-4">Last updated: August 2026. MatchUp Platform.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}