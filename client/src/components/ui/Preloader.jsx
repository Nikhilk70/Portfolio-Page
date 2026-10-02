import { AnimatePresence, motion } from 'framer-motion';

/** Intro curtain shown while data loads (and for a minimum beat so the animation reads). */
export default function Preloader({ show, name = 'Nikhil' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-ink-950"
          exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="relative text-center">
            <motion.div
              className="absolute -inset-20 rounded-full bg-violet/20 blur-3xl"
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.p
              className="relative font-mono text-[11px] uppercase tracking-[0.5em] text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              portfolio
            </motion.p>
            <h1 className="relative mt-3 overflow-hidden font-display text-5xl font-bold text-white sm:text-7xl">
              {name.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
              <motion.span
                className="inline-block text-violet"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1] }}
                transition={{ delay: 0.7, duration: 1.2 }}
              >
                .
              </motion.span>
            </h1>
            <motion.div className="relative mx-auto mt-8 h-px w-48 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-violet to-cyan"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
