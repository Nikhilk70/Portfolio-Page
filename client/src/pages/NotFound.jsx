import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[140px]" />
      <div className="relative">
        <p className="text-stroke font-display text-[9rem] font-extrabold leading-none sm:text-[14rem]">404</p>
        <h1 className="-mt-6 font-display text-3xl font-bold text-white">This page drifted off the map.</h1>
        <p className="mt-3 text-slate-400">The page you're looking for doesn't exist or was moved.</p>
        <Link to="/" className="btn-primary mt-8">
          <ArrowLeft size={16} /> Back home
        </Link>
      </div>
    </section>
  );
}
