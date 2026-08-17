import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { UserPlus, Dumbbell, Play } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    titleKey: 'howItWorks.step1Title',
    descKey: 'howItWorks.step1Desc',
    number: '01',
  },
  {
    icon: Dumbbell,
    titleKey: 'howItWorks.step2Title',
    descKey: 'howItWorks.step2Desc',
    number: '02',
  },
  {
    icon: Play,
    titleKey: 'howItWorks.step3Title',
    descKey: 'howItWorks.step3Desc',
    number: '03',
  },
];

export function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7000FF]/5 rounded-full blur-[150px]" />
      </div>

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
            {t('howItWorks.title')}
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#CCFF00]/30 to-transparent -translate-y-1/2" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-[#141414] rounded-2xl p-8 border border-white/5 hover:border-[#CCFF00]/30 transition-all duration-300 group">
                {/* Step Number */}
                <div className="absolute -top-4 left-8 px-3 py-1 bg-[#CCFF00] rounded-full">
                  <span className="text-[#0A0A0A] font-bold text-sm">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-[#CCFF00]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#CCFF00]/20 transition-colors mt-4">
                  <step.icon className="w-8 h-8 text-[#CCFF00]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t(step.titleKey)}
                </h3>
                <p className="text-white/60">
                  {t(step.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}