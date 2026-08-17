import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, MapPin, TrendingUp, Calendar, Search, Shield } from 'lucide-react';

const features = [
  {
    icon: Search,
    titleKey: 'features.feature1Title',
    descKey: 'features.feature1Desc',
  },
  {
    icon: Shield,
    titleKey: 'features.feature2Title',
    descKey: 'features.feature2Desc',
  },
  {
    icon: TrendingUp,
    titleKey: 'features.feature3Title',
    descKey: 'features.feature3Desc',
  },
  {
    icon: Calendar,
    titleKey: 'features.feature4Title',
    descKey: 'features.feature4Desc',
  },
];

const problems = [
  { icon: Users, textKey: 'features.problem1' },
  { icon: MapPin, textKey: 'features.problem2' },
  { icon: Calendar, textKey: 'features.problem3' },
];

export function FeaturesSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="features" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#CCFF00]/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t('features.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Problems Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-white/80 mb-6 text-center">
            {t('features.problemTitle')}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10"
              >
                <problem.icon className="w-5 h-5 text-[#FF4444]" />
                <span className="text-white/70">{t(problem.textKey)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <div className="flex flex-col items-center">
            <span className="text-[#CCFF00] font-semibold mb-2">{t('features.solutionTitle')}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-[#CCFF00] text-2xl"
            >
              ↓
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative p-6 bg-[#141414] rounded-xl border border-white/5 hover:border-[#CCFF00]/30 transition-all duration-300"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#CCFF00]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#CCFF00]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#CCFF00]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-white/60 text-sm">
                  {t(feature.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}