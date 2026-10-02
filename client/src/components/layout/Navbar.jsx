import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { profile } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // highlight the section currently in view
  useEffect(() => {
    if (!isHome) return undefined;
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome, location.key]);

  useEffect(() => setOpen(false), [location]);

  const goTo = (href) => (e) => {
    if (!isHome) {
      e.preventDefault();
      navigate(`/${href}`);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-white/5 bg-ink-950/70 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <nav className="container-x flex h-[72px] items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
              <span className="absolute inset-0 bg-gradient-to-br from-violet/40 to-cyan/30 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative font-display text-base font-bold text-white">N</span>
            </span>
            <span className="font-display text-sm font-semibold tracking-[0.2em] text-white/90">
              NIKHIL<span className="text-violet">.</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={goTo(l.href)}
                  className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    active === l.href && isHome ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {active === l.href && isHome && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/[0.06]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <Magnetic>
              <a href={profile.resumeUrl || '#'} target="_blank" rel="noreferrer" className="btn-outline !py-2.5 !px-5 text-xs">
                <Download size={14} /> Resume
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" onClick={goTo('#contact')} className="btn-primary !py-2.5 !px-5 text-xs">
                Let&apos;s talk
              </a>
            </Magnetic>
          </div>

          <button onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white lg:hidden" aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-950/95 px-8 backdrop-blur-2xl lg:hidden"
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06 }}>
                  <a href={l.href} onClick={goTo(l.href)} className="block font-display text-4xl font-bold text-white/90 transition-colors hover:text-violet-soft">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 flex gap-3">
              <a href={profile.resumeUrl || '#'} target="_blank" rel="noreferrer" className="btn-outline">
                <Download size={14} /> Resume
              </a>
              <a href="#contact" onClick={goTo('#contact')} className="btn-primary">
                Let&apos;s talk
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
