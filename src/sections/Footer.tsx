import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, MessageCircle } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t('nav.home'),
      links: [
        { label: t('features.title'), href: '/#features' },
        { label: t('howItWorks.title'), href: '/#how-it-works' },
        { label: t('nav.gyms'), href: '/gyms' },
      ],
    },
    {
      title: t('nav.matches'),
      links: [
        { label: t('nav.createMatch'), href: '/create-match' },
        { label: t('nav.leaderboard'), href: '/leaderboard' },
      ],
    },
    {
      title: t('footer.about'),
      links: [
        { label: t('footer.contact'), href: '/contact' },
        { label: t('footer.terms'), href: '/terms' },
        { label: t('footer.privacy'), href: '/privacy' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: MessageCircle, href: '#', label: 'Telegram' },
  ];

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#CCFF00] rounded-lg flex items-center justify-center">
                <span className="text-[#0A0A0A] font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-2xl text-white">{t('common.appName')}</span>
            </Link>
            <p className="text-white/60 mb-6 max-w-sm">
              {t('common.slogan')}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#CCFF00]/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white/60 hover:text-[#CCFF00]" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-white/60 hover:text-[#CCFF00] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse" />
            <span className="text-white/40 text-sm">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}