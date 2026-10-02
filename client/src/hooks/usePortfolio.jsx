import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchPortfolio } from '@/lib/api';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [state, setState] = useState({ data: null, source: null, loading: true });

  useEffect(() => {
    let alive = true;
    fetchPortfolio().then(({ data, source }) => {
      if (alive) setState({ data, source, loading: false });
    });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => {
    const d = state.data ?? {};
    return {
      loading: state.loading,
      source: state.source,
      profile: d.profile ?? {},
      socials: d.socials ?? [],
      stats: d.stats ?? [],
      marquee: d.marquee ?? [],
      heroCards: d.heroCards ?? [],
      skills: d.skills ?? [],
      services: d.services ?? [],
      experience: d.experience ?? [],
      projects: d.projects ?? [],
      education: d.education ?? [],
      certificates: d.certificates ?? [],
    };
  }, [state]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
}
