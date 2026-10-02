import { GraduationCap, Award, Calendar, MapPin } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import TiltCard from '@/components/ui/TiltCard';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

export default function Education() {
  const { education, certificates } = usePortfolio();
  return (
    <section id="education" className="section">
      <div className="container-x grid gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Education" title="Academic" highlight="background." />
          <div className="mt-10 space-y-5">
            {education.map((e, i) => (
              <Reveal key={e.id} dir="up" delay={i * 0.1}>
                <TiltCard className="accent-cyan flex gap-5 p-6">
                  <span className="accent-bg accent-text grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                    <GraduationCap size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{e.degree}</h3>
                    <p className="mt-1 text-sm text-slate-300">{e.institution}</p>
                    <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={12} /> {e.start} — {e.end}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={12} /> {e.location}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Certificates" title="Continuous" highlight="learning." />
          <div className="mt-10 space-y-5">
            {certificates.map((c, i) => (
              <Reveal key={c.id} dir="up" delay={i * 0.1}>
                <TiltCard className="accent-violet p-6">
                  <div className="flex items-center gap-4">
                    <span className="accent-bg accent-text grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                      <Award size={22} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">{c.title}</h3>
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{c.issuer}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {c.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet to-cyan" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
