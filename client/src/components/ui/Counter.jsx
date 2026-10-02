import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/** Animates a number from 0 to `value` when it scrolls into view. */
export default function Counter({ value, suffix = '', duration = 1.6, className = '' }) {
  const ref = useRef(null);
  const observed = useInView(ref, { once: true, amount: 0.3 });
  const [visibleOnMount, setVisibleOnMount] = useState(false);
  const [n, setN] = useState(0);
  const decimals = String(value).includes('.') ? 1 : 0;

  // Fallback: if the element is already inside the viewport on mount, start without waiting for the observer.
  useEffect(() => {
    const t = setTimeout(() => {
      const r = ref.current?.getBoundingClientRect();
      if (r && r.top < window.innerHeight && r.bottom > 0) setVisibleOnMount(true);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const inView = observed || visibleOnMount;

  useEffect(() => {
    if (!inView) return undefined;
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 4);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}
