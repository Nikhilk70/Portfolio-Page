import TechIcon from './TechIcon';

/**
 * Infinite horizontal marquee of technology logos.
 * `items` are `{ name, icon }` objects (plain strings are also accepted).
 * Pass `reverse` to scroll the other way. Hovering the row pauses it.
 */
export default function Marquee({ items = [], reverse = false, speed = 40, className = '' }) {
  const normalised = items.map((it) => (typeof it === 'string' ? { name: it, icon: '' } : it));
  const doubled = [...normalised, ...normalised];
  return (
    <div className={`group/marquee relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ink-950 to-transparent" />
      <div
        className="flex w-max gap-4 animate-marquee group-hover/marquee:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((t, i) => (
          <span
            key={`${t.name}-${i}`}
            className="group/chip flex items-center gap-3 whitespace-nowrap rounded-2xl border border-white/10 bg-white/[0.03] py-2.5 pl-2.5 pr-5 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] transition-transform duration-300 group-hover/chip:scale-110 group-hover/chip:-rotate-6">
              <TechIcon name={t.icon} size={18} />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-300">{t.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
