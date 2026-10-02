import { ArrowUp } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';
import { getIcon } from '@/components/ui/icons';
import Magnetic from '@/components/ui/Magnetic';

export default function Footer() {
  const { profile, socials } = usePortfolio();
  const year = new Date().getFullYear();

  const toTop = () => (window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }));

  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-violet/10 to-transparent" />
      <div className="container-x relative py-16">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl font-bold text-white">
              {profile.name}
              <span className="text-violet">.</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-slate-400">{profile.headline}</p>
          </div>

          <div className="flex items-center gap-3">
            {socials.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <Magnetic key={s.id}>
                  <a
                    href={s.url}
                    target={s.url.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition-all hover:border-violet hover:text-white hover:shadow-glow"
                  >
                    <Icon size={18} />
                  </a>
                </Magnetic>
              );
            })}
            <Magnetic>
              <button onClick={toTop} aria-label="Back to top" className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink-950 transition-colors hover:bg-violet-soft">
                <ArrowUp size={18} />
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 sm:flex-row sm:items-center">
          <span>© {year} {profile.name}. All rights reserved.</span>
          <span>Built with React · Node.js · Framer Motion</span>
        </div>
      </div>

      <div className="pointer-events-none select-none overflow-hidden">
        <p className="text-stroke -mb-10 whitespace-nowrap text-center font-display text-[18vw] font-extrabold leading-none opacity-40">
          NIKHIL K K
        </p>
      </div>
    </footer>
  );
}
