import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Preloader from '@/components/ui/Preloader';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import Home from '@/pages/Home';
import ProjectDetail from '@/pages/ProjectDetail';
import NotFound from '@/pages/NotFound';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';
import { useLenis } from '@/hooks/useLenis';

/** Scroll to hash targets after navigation (e.g. /#projects from a detail page). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        const el = document.querySelector(hash);
        if (!el) return;
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72 });
        else el.scrollIntoView({ behavior: 'smooth' });
      }, 350);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
    window.__lenis?.scrollTo(0, { immediate: true });
    return undefined;
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { loading, profile } = usePortfolio();
  const location = useLocation();
  const [minTimePassed, setMinTimePassed] = useState(false);
  useLenis();

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1700);
    return () => clearTimeout(t);
  }, []);

  const showLoader = loading || !minTimePassed;

  return (
    <>
      <Preloader show={showLoader} name={profile.firstName || 'Nikhil'} />
      <CustomCursor />
      <ScrollProgress />
      <WhatsAppButton />
      <ScrollManager />
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
