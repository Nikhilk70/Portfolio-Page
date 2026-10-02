import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Github, Globe, Play, Video, Check, Calendar, User, Layers } from 'lucide-react';
import Reveal, { stagger, item } from '@/components/ui/Reveal';
import Magnetic from '@/components/ui/Magnetic';
import { ProjectCard, ProjectCover } from '@/components/sections/Projects';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

/** Converts YouTube / Vimeo / direct links into something embeddable. */
function parseVideo(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}?rel=0` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` };
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive) return { type: 'iframe', src: `https://drive.google.com/file/d/${drive[1]}/preview` };
  return { type: 'video', src: url };
}

function VideoBlock({ project }) {
  const [play, setPlay] = useState(false);
  const video = parseVideo(project.media?.video);

  return (
    <div className={`accent-${project.accent} relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-card`}>
      {!video && (
        <>
          <ProjectCover project={project} className="opacity-60" />
          <div className="absolute inset-0 grid place-items-center bg-ink-950/50">
            <div className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70">
                <Video size={24} />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-white">Project walkthrough video</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">coming soon</p>
            </div>
          </div>
        </>
      )}

      {video && !play && (
        <button onClick={() => setPlay(true)} className="group absolute inset-0 w-full" aria-label="Play video">
          <ProjectCover project={project} className="transition-transform duration-1000 group-hover:scale-105" />
          <span className="absolute inset-0 bg-ink-950/40" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-white text-ink-950 shadow-glow transition-transform group-hover:scale-110">
              <Play size={28} className="ml-1" />
            </span>
          </span>
        </button>
      )}

      {video && play && video.type === 'iframe' && (
        <iframe src={`${video.src}${video.src.includes('?') ? '&' : '?'}autoplay=1`} title={`${project.title} video`} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      )}
      {video && play && video.type === 'video' && <video src={video.src} controls autoPlay className="absolute inset-0 h-full w-full bg-black" />}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { projects, loading } = usePortfolio();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [slug]);

  if (loading) return null;
  if (!project) return <Navigate to="/404" replace />;

  const others = projects.filter((p) => p.slug !== slug).slice(0, 3);
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const meta = [
    { icon: Calendar, label: 'Year', value: project.year },
    { icon: User, label: 'Role', value: project.role },
    { icon: Layers, label: 'Category', value: project.category },
  ];

  return (
    <article className="relative overflow-hidden pt-32 pb-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-violet/10 blur-[160px]" />

      <div className="container-x relative">
        <Reveal dir="up">
          <Link to="/#projects" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400 transition-colors hover:text-white">
            <ArrowLeft size={14} /> Back to projects
          </Link>
        </Reveal>

        {/* header */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <Reveal dir="up" delay={0.05} className="flex flex-wrap items-center gap-3">
              <span className="chip">{project.category}</span>
              {project.status && <span className={`accent-${project.accent} accent-bg accent-text rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wide`}>{project.status}</span>}
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">{project.repoName}</span>
            </Reveal>
            <Reveal dir="blur" delay={0.1}>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl">{project.title}</h1>
            </Reveal>
            <Reveal dir="up" delay={0.18}>
              <p className="mt-5 max-w-2xl text-lg text-slate-400">{project.tagline}</p>
            </Reveal>
          </div>
          <Reveal dir="up" delay={0.25} className="flex flex-wrap gap-3 lg:justify-end">
            {project.links?.live && (
              <Magnetic>
                <a href={project.links.live} target="_blank" rel="noreferrer" className="btn-primary">
                  <Globe size={16} /> Live demo
                </a>
              </Magnetic>
            )}
            {project.links?.github && (
              <Magnetic>
                <a href={project.links.github} target="_blank" rel="noreferrer" className="btn-outline">
                  <Github size={16} /> Source code
                </a>
              </Magnetic>
            )}
          </Reveal>
        </div>

        {/* video / hero media */}
        <Reveal dir="scale" delay={0.2} className="mt-12">
          <VideoBlock project={project} />
        </Reveal>

        {/* body */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_340px]">
          <div>
            <Reveal dir="up">
              <h2 className="eyebrow">Overview</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">{project.description}</p>
            </Reveal>

            <Reveal dir="up" className="mt-12">
              <h2 className="eyebrow">Key highlights</h2>
            </Reveal>
            <motion.ul variants={stagger(0.08, 0.1)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.highlights?.map((h) => (
                <motion.li key={h} variants={item} className={`accent-${project.accent} card spotlight-card flex gap-3 p-5 text-sm leading-relaxed text-slate-300`}>
                  <Check size={16} className="accent-text mt-0.5 shrink-0" /> {h}
                </motion.li>
              ))}
            </motion.ul>

            {project.media?.gallery?.length > 0 && (
              <>
                <Reveal dir="up" className="mt-12">
                  <h2 className="eyebrow">Gallery</h2>
                </Reveal>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.media.gallery.map((src, i) => (
                    <Reveal key={src} dir="up" delay={i * 0.08}>
                      <img src={src} alt={`${project.title} screenshot ${i + 1}`} className="w-full rounded-2xl border border-white/10" loading="lazy" />
                    </Reveal>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal dir="right" className="card p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">Project info</h3>
              <ul className="mt-4 space-y-4">
                {meta.map((m) => (
                  <li key={m.label} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-violet-soft">
                      <m.icon size={15} />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{m.label}</p>
                      <p className="text-sm text-white">{m.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal dir="right" delay={0.1} className="card p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">Tech stack</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech?.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
            {next && (
              <Reveal dir="right" delay={0.15}>
                <Link to={`/projects/${next.slug}`} className="card group block p-6 transition-all hover:border-violet/50">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">Next project</p>
                  <p className="mt-2 flex items-center justify-between font-display text-lg font-bold text-white">
                    {next.title} <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </p>
                </Link>
              </Reveal>
            )}
          </aside>
        </div>

        {/* more */}
        {others.length > 0 && (
          <div className="mt-24">
            <Reveal dir="up">
              <h2 className="h-section text-3xl sm:text-4xl">
                More <span className="gradient-text">projects</span>
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {others.map((p, i) => (
                <Reveal key={p.id} dir="up" delay={i * 0.08} className="h-full">
                  <ProjectCard project={p} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
