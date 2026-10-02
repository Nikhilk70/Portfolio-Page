import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, FileText, MapPin } from 'lucide-react';
import ParticleField from '@/components/ui/ParticleField';
import Magnetic from '@/components/ui/Magnetic';
import Typewriter from '@/components/ui/Typewriter';
import Counter from '@/components/ui/Counter';
import { getIcon } from '@/components/ui/icons';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';
import HeroPortrait from './HeroPortrait';

const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  const { profile, socials, stats } = usePortfolio();
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 600], [0, 120]);
  const yImg = useTransform(scrollY, [0, 600], [0, 60]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const name = profile.name || 'Nikhil K K';
  // 'Nikhil' stays white; the rest ('K K') shares one continuous gradient
  const [first, ...rest] = name.split(' ');
  const words = [first, rest.join(' ')].filter(Boolean);

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16 noise">
      {/* backdrop */}
      <div className="absolute inset-0 grid-bg" />
      <ParticleField />
      <div className="pointer-events-none absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-violet/25 blur-[140px] animate-blob" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-cyan/20 blur-[140px] animate-blob [animation-delay:-8s]" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-24">
        {/* text */}
        <motion.div style={{ y: yText, opacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 }} className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-lime">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
              {profile.availability || 'Available for work'}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
              <MapPin size={12} /> {profile.location}
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.2 }} className="mt-8 font-mono text-sm tracking-[0.2em] text-slate-400">
            <span className="text-violet-soft">&lt;</span> Hello, I&apos;m <span className="text-violet-soft">/&gt;</span>
          </motion.p>

          {/* name: single line, sized to the column width (container query) so it never wraps */}
          <div className="mt-3" style={{ containerType: 'inline-size' }}>
            <h1
              className="relative inline-flex items-baseline whitespace-nowrap font-name font-extrabold leading-none tracking-[-0.035em] text-white"
              style={{ fontSize: 'clamp(2.4rem, 16cqi, 6.5rem)' }}
              aria-label={name}
            >
              {words.map((word, wi) => (
                <span key={wi} className="inline-block overflow-hidden pb-[0.12em]" style={{ marginRight: wi < words.length - 1 ? '0.22em' : 0 }}>
                  <motion.span
                    className={wi === 0 ? 'inline-block' : 'name-gradient inline-block'}
                    initial={{ y: '115%', rotate: 4 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ duration: 1, ease, delay: 0.3 + wi * 0.12 }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
              <motion.span
                className="inline-block text-lime"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 12, delay: 0.9 }}
              >
                .
              </motion.span>
              {/* animated underline */}
              <motion.span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-violet via-cyan to-lime"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease, delay: 1 }}
              />
            </h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.7 }} className="mt-6 font-display text-2xl font-semibold text-slate-200 sm:text-3xl">
            <span className="gradient-text">
              <Typewriter words={profile.roles || []} />
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.85 }} className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {profile.headline} I specialise in <span className="text-white">React.js</span>, <span className="text-white">Node.js</span> and bringing <span className="text-white">AI (RAG, MCP, CRM automation)</span> into real products.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 1 }} className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href="#projects" className="btn-primary">
                View projects <ArrowUpRight size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.resumeUrl || '#'} target="_blank" rel="noreferrer" className="btn-outline">
                <FileText size={16} /> View resume
              </a>
            </Magnetic>
            <div className="ml-1 flex items-center gap-2">
              {socials
                .filter((s) => ['github', 'linkedin', 'whatsapp'].includes(s.id))
                .map((s) => {
                  const Icon = getIcon(s.icon);
                  const wa = s.id === 'whatsapp';
                  return (
                    <Magnetic key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className={`grid h-11 w-11 place-items-center rounded-full border transition-all ${
                          wa ? 'border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-ink-950' : 'border-white/10 text-slate-300 hover:border-violet hover:text-white'
                        }`}
                      >
                        <Icon size={18} />
                      </a>
                    </Magnetic>
                  );
                })}
            </div>
          </motion.div>

          <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 1.15 }} className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <li key={s.id} className="border-l border-white/10 pl-4">
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs leading-snug text-slate-500">{s.label}</p>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* portrait with flip + floating tech cards */}
        <motion.div style={{ y: yImg }}>
          <HeroPortrait />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 [@media(min-width:1280px)_and_(min-height:980px)]:flex"
      >
        scroll
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown size={14} />
        </motion.span>
      </motion.a>
    </section>
  );
}
