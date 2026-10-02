import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, highlight, description, align = 'left', className = '' }) {
  const center = align === 'center';
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <Reveal dir="up">
        <span className={`eyebrow ${center ? 'justify-center' : ''}`}>{eyebrow}</span>
      </Reveal>
      <Reveal dir="blur" delay={0.08}>
        <h2 className="h-section mt-5">
          {title} {highlight && <span className="gradient-text">{highlight}</span>}
        </h2>
      </Reveal>
      {description && (
        <Reveal dir="up" delay={0.16}>
          <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
