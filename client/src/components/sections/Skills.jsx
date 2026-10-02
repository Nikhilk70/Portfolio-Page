import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { getIcon } from '@/components/ui/icons';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

export default function Skills() {
  const { skills } = usePortfolio();
  const [activeId, setActiveId] = useState(null);
  const active = skills.find((s) => s.id === activeId) ?? skills[0];

  return (
    <section id="skills" className="section">
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet/15 blur-[120px]" />
      <div className="container-x">
        <SectionHeading
          eyebrow="Skills"
          title="A toolkit built for"
          highlight="modern products."
          description="From pixel-perfect frontends to backend APIs, databases and AI integrations — here's what I work with every day."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* category list */}
          <Reveal dir="left" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {skills.map((cat) => {
              const Icon = getIcon(cat.icon);
              const isActive = cat.id === active?.id;
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveId(cat.id)}
                  onClick={() => setActiveId(cat.id)}
                  className={`relative flex shrink-0 items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-all ${
                    isActive ? 'border-violet/50 bg-violet/10 text-white' : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {isActive && <motion.span layoutId="skill-glow" className="absolute inset-0 -z-10 rounded-2xl shadow-glow" />}
                  <span className={`grid h-9 w-9 place-items-center rounded-xl ${isActive ? 'bg-violet text-white' : 'bg-white/5'}`}>
                    <Icon size={16} />
                  </span>
                  <span>
                    <span className="block font-display text-sm font-semibold">{cat.title}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-500">{cat.items.length} skills</span>
                  </span>
                </button>
              );
            })}
          </Reveal>

          {/* bars */}
          <Reveal dir="right" className="card p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div key={active.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
                  <div className="flex items-end justify-between">
                    <h3 className="font-display text-2xl font-bold text-white">{active.title}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">proficiency</span>
                  </div>
                  <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
                    {active.items.map((s, i) => (
                      <li key={s.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-200">{s.name}</span>
                          <span className="font-mono text-xs text-slate-500">{s.level}%</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-violet via-cyan to-lime"
                            initial={{ width: 0 }}
                            animate={{ width: `${s.level}%` }}
                            transition={{ duration: 1, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
