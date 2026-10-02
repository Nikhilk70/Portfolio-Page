import { useEffect, useRef } from 'react';

/** A two-layer custom cursor: a tiny dot + a lagging ring that grows over links/buttons. */
export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    document.body.classList.add('custom-cursor');

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf;

    let shown = false;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        // keep the cursor hidden until the mouse actually moves
        shown = true;
        rx = x;
        ry = y;
        dot.current?.style.setProperty('opacity', '1');
        ring.current?.style.setProperty('opacity', '1');
      }
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e) => {
      const t = e.target.closest('a, button, [data-cursor="hover"]');
      ring.current?.classList.toggle('is-hover', Boolean(t));
    };
    const down = () => ring.current?.classList.add('is-down');
    const up = () => ring.current?.classList.remove('is-down');

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('custom-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        style={{ opacity: 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 rounded-full bg-white mix-blend-difference md:block"
      />
      <div
        ref={ring}
        style={{ opacity: 0 }}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] hidden h-9 w-9 rounded-full border border-white/60 mix-blend-difference transition-[width,height,border-color,background-color] duration-300 md:block [&.is-down]:scale-75 [&.is-hover]:h-16 [&.is-hover]:w-16 [&.is-hover]:border-violet-soft [&.is-hover]:bg-violet/20"
      />
    </>
  );
}
