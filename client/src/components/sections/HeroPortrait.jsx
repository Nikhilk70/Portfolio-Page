import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, RotateCw, Briefcase, Sparkles } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import TechIcon from '@/components/ui/TechIcon';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

const ease = [0.22, 1, 0.36, 1];

/** Where each floating card sits around the portrait + how it drifts. */
const CARD_LAYOUT = [
  { pos: '-left-20 top-6', float: [0, -12, 0], duration: 5, delay: 0, tilt: -3 },
  { pos: '-right-16 top-20', float: [0, 12, 0], duration: 6, delay: 0.6, tilt: 3 },
  { pos: '-left-16 bottom-32', float: [0, 10, 0], duration: 5.5, delay: 1.1, tilt: 2 },
  { pos: '-right-12 bottom-14', float: [0, -10, 0], duration: 6.5, delay: 0.3, tilt: -2 },
];

function TechCard({ card, className = '' }) {
  return (
    <div className={`accent-${card.accent} group/card relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/80 p-3.5 shadow-card backdrop-blur-xl transition-colors duration-300 hover:border-white/25 ${className}`}>
      {/* accent glow + top hairline */}
      <span className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-60 blur-2xl" style={{ background: 'rgb(var(--accent) / 0.5)' }} />
      <span className="pointer-events-none absolute inset-x-4 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--accent)), transparent)' }} />

      <p className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgb(var(--accent))', boxShadow: '0 0 10px rgb(var(--accent))' }} />
        {card.label}
      </p>
      <div className="relative mt-3 flex gap-2">
        {card.icons.map((ic, i) => (
          <span
            key={ic}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.05] transition-transform duration-300 group-hover/card:-translate-y-1"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <TechIcon name={ic} size={17} />
          </span>
        ))}
      </div>
      <p className="relative mt-3 whitespace-nowrap font-display text-[13px] font-semibold text-white">{card.title}</p>
    </div>
  );
}

export default function HeroPortrait() {
  const { profile, heroCards } = usePortfolio();
  const [flipped, setFlipped] = useState(false);
  const [entered, setEntered] = useState(false); // true once the intro animation has played
  const pointerType = useRef('mouse');
  const photoRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 2400);
    return () => clearTimeout(t);
  }, []);

  /**
   * Mouse: flip while the pointer is inside the photo's box. This is checked geometrically on the
   * wrapper (which also receives events from the floating cards) so that the cards sliding away
   * during the flip can never cause an enter/leave flicker.
   */
  const onWrapperMove = (e) => {
    if (e.pointerType !== 'mouse' || !photoRef.current) return;
    pointerType.current = 'mouse';
    const r = photoRef.current.getBoundingClientRect();
    setFlipped(e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom);
  };

  const name = profile.name || 'Nikhil K K';
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  const facts = [
    { icon: Briefcase, label: 'Role', value: 'Frontend Developer @ Marutiflex' },
    { icon: Sparkles, label: 'Experience', value: `${profile.yearsOfExperience || '1.5+'} years · React, Node, AI` },
    { icon: MapPin, label: 'Based in', value: profile.location },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease, delay: 0.5 }}
        className="relative aspect-[4/5]"
        onPointerMove={onWrapperMove}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setFlipped(false)}
      >
        <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-br from-violet/40 via-transparent to-cyan/30 blur-3xl animate-pulseGlow" />
        <div className="absolute -inset-3 rounded-[2.4rem] border border-dashed border-white/10 animate-spinSlow [animation-duration:60s]" />

        {/* flip card: hover with a mouse, tap on touch screens */}
        <div
          ref={photoRef}
          className="relative h-full w-full [perspective:1400px]"
          onPointerDown={(e) => {
            pointerType.current = e.pointerType;
          }}
          onClick={(e) => {
            if (pointerType.current === 'mouse') return;
            if (e.target.closest('a')) return; // let links on the back work
            setFlipped((f) => !f);
          }}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="relative h-full w-full [transform-style:preserve-3d]"
          >
            {/* FRONT: photo */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-ink-800 shadow-card [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
              <img src={profile.avatar || '/profile.png'} alt={name} className="h-full w-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink-950/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-200 backdrop-blur">
                <RotateCw size={11} className="animate-spinSlow [animation-duration:6s]" /> <span className="hidden sm:inline">hover</span>
                <span className="sm:hidden">tap</span> to flip
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">Currently at</p>
                <p className="mt-1 font-display text-lg font-semibold text-white">Marutiflex Traders LLP</p>
              </div>
            </div>

            {/* BACK: quick profile card */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/15 bg-ink-900 shadow-card [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="absolute inset-0 bg-gradient-to-br from-violet/30 via-ink-900 to-cyan/20" />
              <div className="absolute inset-0 grid-bg opacity-60" />
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-white/10" />

              <div className="relative flex h-full flex-col p-7">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyan font-name text-xl font-extrabold text-white shadow-glow">{initials}</span>
                  <div>
                    <p className="font-name text-2xl font-extrabold leading-tight text-white">{name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-soft">{profile.roles?.[0] || 'Full Stack Developer'}</p>
                  </div>
                </div>

                <ul className="mt-7 space-y-4">
                  {facts.map((f) => (
                    <li key={f.label} className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-violet-soft">
                        <f.icon size={15} />
                      </span>
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">{f.label}</p>
                        <p className="text-sm text-white">{f.value}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">Daily stack</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['react', 'next', 'node', 'django', 'postgres', 'mongodb', 'postman', 'claude'].map((ic) => (
                      <span key={ic} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.05]">
                        <TechIcon name={ic} size={16} />
                      </span>
                    ))}
                  </div>
                </div>

                {profile.availability && (
                  <p className="mt-6 hidden items-center gap-2 self-start rounded-full border border-lime/30 bg-lime/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-lime sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime" /> {profile.availability}
                  </p>
                )}

                <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                  {profile.whatsappUrl && (
                    <a href={profile.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-ink-950 transition-transform hover:scale-[1.03]">
                      <SiWhatsapp size={16} /> WhatsApp
                    </a>
                  )}
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-violet hover:text-violet-soft">
                    <Mail size={16} /> Email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* floating tech cards (desktop / tablet) */}
        {heroCards.slice(0, 4).map((card, i) => {
          const l = CARD_LAYOUT[i];
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.6, x: 0 }}
              // when the photo flips, the cards slide outwards and fade so the back of the card is readable
              animate={flipped ? { opacity: 0, scale: 0.7, x: i % 2 === 0 ? -50 : 50 } : { opacity: 1, scale: 1, x: 0 }}
              transition={entered ? { duration: 0.45, ease, delay: flipped ? 0 : 0.35 + i * 0.05 } : { duration: 0.7, ease, delay: 1.2 + i * 0.15 }}
              className={`absolute z-10 hidden sm:block ${l.pos} ${flipped ? 'pointer-events-none' : ''}`}
            >
              <motion.div
                animate={{ y: l.float, rotate: [l.tilt, 0, l.tilt] }}
                transition={{ duration: l.duration, repeat: Infinity, ease: 'easeInOut', delay: l.delay }}
                whileHover={{ scale: 1.07 }}
              >
                <TechCard card={card} />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* same cards as a grid on phones */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:hidden">
        {heroCards.slice(0, 4).map((card, i) => (
          <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 1.2 + i * 0.1 }}>
            <TechCard card={card} className="[&_p:last-child]:whitespace-normal [&_p:last-child]:text-[11px] [&_span.grid]:h-7 [&_span.grid]:w-7" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
