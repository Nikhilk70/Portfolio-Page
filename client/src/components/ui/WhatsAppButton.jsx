import { motion } from 'framer-motion';
import { SiWhatsapp } from 'react-icons/si';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

/** Floating "chat on WhatsApp" button, fixed to the bottom-right corner. */
export default function WhatsAppButton() {
  const { profile } = usePortfolio();
  if (!profile.whatsappUrl) return null;

  return (
    <motion.a
      href={profile.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.4, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2.6, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="group fixed bottom-6 right-6 z-50 flex items-center"
    >
      <span className="pointer-events-none mr-3 hidden translate-x-2 rounded-full border border-white/10 bg-ink-900/90 px-4 py-2 text-xs font-medium text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,.7)]">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.4s]" />
        <SiWhatsapp size={26} className="relative" />
      </span>
    </motion.a>
  );
}
