import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Briefcase, FileText, ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal, { stagger, item } from '@/components/ui/Reveal';
import TiltCard from '@/components/ui/TiltCard';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

export default function About() {
  const { profile } = usePortfolio();
  const about = profile.about || [profile.summary];

  const facts = [
    { icon: Briefcase, label: 'Current role', value: 'Frontend Developer @ Marutiflex' },
    { icon: MapPin, label: 'Based in', value: profile.location },
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${(profile.phone || '').replace(/\s/g, '')}` },
  ];

  return (
    <section id="about" className="section">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionHeading eyebrow="About me" title="Turning ideas into" highlight="polished products." />
          <motion.div variants={stagger(0.1, 0.2)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-8 space-y-5 text-base leading-relaxed text-slate-400 sm:text-lg">
            {about.map((p, i) => (
              <motion.p key={i} variants={item}>
                {p}
              </motion.p>
            ))}
          </motion.div>
          <Reveal dir="up" delay={0.3} className="mt-9 flex flex-wrap gap-4">
            <a href={profile.resumeUrl || '#'} target="_blank" rel="noreferrer" className="btn-primary">
              <FileText size={16} /> View resume
            </a>
            <a href="#contact" className="btn-outline">
              Get in touch <ArrowUpRight size={16} />
            </a>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {facts.map((f, i) => (
            <Reveal key={f.label} dir="up" delay={0.1 + i * 0.08}>
              <TiltCard className="accent-violet h-full p-6">
                <f.icon className="text-violet-soft" size={20} />
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">{f.label}</p>
                {f.href ? (
                  <a href={f.href} className="mt-1 block break-words font-display text-base font-semibold text-white hover:text-violet-soft">
                    {f.value}
                  </a>
                ) : (
                  <p className="mt-1 font-display text-base font-semibold text-white">{f.value}</p>
                )}
              </TiltCard>
            </Reveal>
          ))}
          <Reveal dir="up" delay={0.45} className="sm:col-span-2">
            <TiltCard className="accent-cyan relative overflow-hidden p-6">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan/20 blur-3xl" />
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">Core strengths</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['React.js', 'Node.js', 'Django', 'REST APIs', 'RAG Systems', 'MCP Servers', 'Postman', 'AI in CRM', 'PostgreSQL', 'Firebase'].map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
