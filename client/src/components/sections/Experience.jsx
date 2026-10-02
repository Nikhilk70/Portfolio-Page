import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Building2, MapPin } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

export default function Experience() {
  const { experience } = usePortfolio();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="section">
      <div className="container-x">
        <SectionHeading eyebrow="Experience" title="Where I've" highlight="worked." description="Shipping production software with real users, real clients and real deadlines." />

        <div ref={ref} className="relative mt-16">
          {/* timeline line */}
          <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-1/2" />
          <motion.div style={{ scaleY: lineScale }} className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-violet via-cyan to-lime md:left-1/2" />

          <div className="space-y-14">
            {experience.map((job, i) => {
              const left = i % 2 === 0;
              return (
                <div key={job.id} className={`relative grid gap-6 md:grid-cols-2 ${left ? '' : 'md:[&>*:first-child]:order-2'}`}>
                  {/* dot */}
                  <span className="absolute left-4 top-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-ink-950 ring-2 ring-violet md:left-1/2">
                    {job.current && <span className="absolute inset-0 animate-ping rounded-full bg-violet/70" />}
                  </span>

                  <Reveal dir={left ? 'left' : 'right'} className={`pl-12 md:pl-0 ${left ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-violet-soft">
                      {job.start} — {job.end}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-bold text-white">{job.role}</h3>
                    <p className={`mt-2 flex items-center gap-2 text-slate-300 ${left ? 'md:justify-end' : ''}`}>
                      <Building2 size={14} className="text-slate-500" /> {job.company}
                    </p>
                    <p className={`mt-1 flex items-center gap-2 text-sm text-slate-500 ${left ? 'md:justify-end' : ''}`}>
                      <MapPin size={13} /> {job.location} · {job.type}
                    </p>
                    <div className={`mt-4 flex flex-wrap gap-2 ${left ? 'md:justify-end' : ''}`}>
                      {job.tech.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Reveal>

                  <Reveal dir={left ? 'right' : 'left'} delay={0.1} className={`pl-12 md:pl-0 ${left ? 'md:pl-16' : 'md:pr-16'}`}>
                    <div className="card accent-violet spotlight-card p-6">
                      <p className="text-sm text-slate-300">{job.summary}</p>
                      <ul className="mt-4 space-y-3">
                        {job.points.map((p) => (
                          <li key={p} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet to-cyan" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
