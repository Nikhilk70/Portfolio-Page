import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiDjango,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiFirebase,
  SiTailwindcss,
  SiBootstrap,
  SiHtml5,
  SiCss,
  SiPostman,
  SiGit,
  SiGithub,
  SiFigma,
  SiGoogleappsscript,
  SiClaude,
  SiGithubcopilot,
  SiCursor,
  SiVite,
  SiVercel,
  SiSqlite,
  SiWhatsapp,
} from 'react-icons/si';
import { Network, Brain, Plug, Bot, Sparkles } from 'lucide-react';

/**
 * Technology logos keyed by the `icon` field used in data/portfolio.json.
 * `color` is the brand colour (lightened where the real brand colour is too dark for a dark UI).
 */
export const TECH_ICONS = {
  react: { Icon: SiReact, color: '#61DAFB' },
  next: { Icon: SiNextdotjs, color: '#FFFFFF' },
  node: { Icon: SiNodedotjs, color: '#6CC24A' },
  express: { Icon: SiExpress, color: '#FFFFFF' },
  js: { Icon: SiJavascript, color: '#F7DF1E' },
  ts: { Icon: SiTypescript, color: '#4A9EF0' },
  python: { Icon: SiPython, color: '#5AA7E0' },
  django: { Icon: SiDjango, color: '#44B78B' },
  postgres: { Icon: SiPostgresql, color: '#6C9BD9' },
  mysql: { Icon: SiMysql, color: '#5D9CC9' },
  mongodb: { Icon: SiMongodb, color: '#4DB33D' },
  firebase: { Icon: SiFirebase, color: '#FFA611' },
  tailwind: { Icon: SiTailwindcss, color: '#38BDF8' },
  bootstrap: { Icon: SiBootstrap, color: '#9A7BD1' },
  html: { Icon: SiHtml5, color: '#F16529' },
  css: { Icon: SiCss, color: '#8B6CF6' },
  postman: { Icon: SiPostman, color: '#FF6C37' },
  git: { Icon: SiGit, color: '#F05032' },
  github: { Icon: SiGithub, color: '#FFFFFF' },
  figma: { Icon: SiFigma, color: '#F24E1E' },
  appscript: { Icon: SiGoogleappsscript, color: '#4285F4' },
  claude: { Icon: SiClaude, color: '#D97757' },
  copilot: { Icon: SiGithubcopilot, color: '#FFFFFF' },
  cursor: { Icon: SiCursor, color: '#FFFFFF' },
  vite: { Icon: SiVite, color: '#9499FF' },
  vercel: { Icon: SiVercel, color: '#FFFFFF' },
  sqlite: { Icon: SiSqlite, color: '#44A8E0' },
  whatsapp: { Icon: SiWhatsapp, color: '#25D366' },
  // concepts without an official logo
  api: { Icon: Network, color: '#34D399' },
  rag: { Icon: Brain, color: '#A78BFA' },
  mcp: { Icon: Plug, color: '#22D3EE' },
  ai: { Icon: Bot, color: '#F472B6' },
};

const FALLBACK = { Icon: Sparkles, color: '#C4B5FD' };

export default function TechIcon({ name, size = 18, colored = true, className = '', style }) {
  const { Icon, color } = TECH_ICONS[name] ?? FALLBACK;
  return <Icon size={size} className={className} style={{ color: colored ? color : undefined, ...style }} aria-hidden="true" />;
}

export const techColor = (name) => (TECH_ICONS[name] ?? FALLBACK).color;
