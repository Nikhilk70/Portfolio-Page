import Marquee from '@/components/ui/Marquee';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';

export default function TechMarquee() {
  const { marquee } = usePortfolio();
  const half = Math.ceil(marquee.length / 2);
  return (
    <div className="relative border-y border-white/5 py-8">
      <Marquee items={marquee.slice(0, half)} speed={38} />
      <Marquee items={marquee.slice(half)} reverse speed={46} className="mt-4" />
    </div>
  );
}
