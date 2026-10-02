import {
  Code2,
  Layers,
  Database,
  Sparkles,
  Wrench,
  Users,
  Brain,
  Plug,
  FlaskConical,
  Network,
  Bot,
  LayoutDashboard,
  Github,
  Linkedin,
  Mail,
  Phone,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

/** Maps icon keys from the JSON data to icon components. */
export const ICONS = {
  code: Code2,
  layers: Layers,
  database: Database,
  sparkles: Sparkles,
  wrench: Wrench,
  users: Users,
  brain: Brain,
  plug: Plug,
  flask: FlaskConical,
  network: Network,
  bot: Bot,
  layout: LayoutDashboard,
  github: Github,
  linkedin: Linkedin,
  whatsapp: SiWhatsapp,
  mail: Mail,
  phone: Phone,
  globe: Globe,
  external: ArrowUpRight,
};

export const getIcon = (key) => ICONS[key] ?? Sparkles;
