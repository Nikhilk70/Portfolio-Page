import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Github, Globe, Play } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import TiltCard from '@/components/ui/TiltCard';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

const ACCENT_GRADIENT = {
  violet: 'from-violet-600/60 via-violet-900/30 to-ink-900',
  cyan: 'from-cyan-500/50 via-cyan-900/30 to-ink-900',
  emerald: 'from-emerald-500/50 via-emerald-900/30 to-ink-900',
  orange: 'from-orange-500/50 via-orange-900/30 to-ink-900',
  pink: 'from-pink-500/50 via-pink-900/30 to-ink-900',
  blue: 'from-blue-500/50 via-blue-900/30 to-ink-900',
};

export function ProjectCover({ project, className = '' }) {
  const { media = {}, accent = 'violet', title } = project;
  if (media.cover) {
    return <img src={media.cover} alt={title} className={`h-full w-full object-cover ${className}`} />;
  }
  // generated placeholder cover
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${ACCENT_GRADIENT[accent] || ACCENT_GRADIENT.violet} ${className}`}>
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/10" />
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-white/10" />
      <p className="absolute bottom-5 left-6 font-display text-5xl font-extrabold text-white/10">{title.slice(0, 2).toUpperCase()}</p>
    </div>
  );
}

export function ProjectCard({ project, index = 0 }) {
  const { title, tagline, tech = [], links = {}, media = {}, accent = 'violet', category, status, slug } = project;
  return (
    <TiltCard className={`accent-${accent} group flex h-full flex-col overflow-hidden !rounded-3xl`} max={5}>
      <Link to={`/projects/${slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <ProjectCover project={project} className="transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
        <div className="absolute left-5 top-5 flex gap-2">
          <span className="rounded-full bg-ink-950/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-200 backdrop-blur">{category}</span>
          {status && <span className="accent-bg accent-text rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur">{status}</span>}
        </div>
        <span className="absolute right-5 top-5 font-mono text-xs text-white/40">{String(index + 1).padStart(2, '0')}</span>
        {media.video && (
          <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-ink-950">
              <Play size={20} className="ml-0.5" />
            </span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/projects/${slug}`} className="font-display text-xl font-bold text-white transition-colors group-hover:text-violet-soft">
            {title}
          </Link>
          <div className="flex shrink-0 gap-2">
            {links.github && (
              <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-300 transition-all hover:border-white/40 hover:text-white">
                <Github size={15} />
              </a>
            )}
            {links.live && (
              <a href={links.live} target="_blank" rel="noreferrer" aria-label="Live site" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-300 transition-all hover:border-white/40 hover:text-white">
                <Globe size={15} />
              </a>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{tagline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tech.slice(0, 5).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
          {tech.length > 5 && <span className="chip text-slate-500">+{tech.length - 5}</span>}
        </div>
        <Link to={`/projects/${slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-300 transition-colors hover:text-white">
          Case study <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </TiltCard>
  );
}

export default function Projects() {
  const { projects } = usePortfolio();
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const visible = projects.filter((p) => filter === 'All' || p.category === filter);

  return (
    <section id="projects" className="section">
      <div className="pointer-events-none absolute right-0 top-10 h-[28rem] w-[28rem] translate-x-1/3 rounded-full bg-violet/15 blur-[140px]" />
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Projects" title="Selected" highlight="work." description="A mix of production apps, full-stack platforms and AI tooling. Each case study includes a walkthrough video slot, highlights and the full tech stack." />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`relative rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  filter === c ? 'border-violet/60 text-white' : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {filter === c && <motion.span layoutId="proj-filter" className="absolute inset-0 rounded-full bg-violet/15" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <ProjectCard project={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
