import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Magnetic from '@/components/ui/Magnetic';
import { getIcon } from '@/components/ui/icons';
import { usePortfolio } from '@/hooks/usePortfolio.jsx';
import { sendContact } from '@/lib/api';
import { SiWhatsapp } from 'react-icons/si';

const EMPTY = { name: '', email: '', subject: '', message: '' };

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </label>
  );
}

const inputCls =
  'mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-violet/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet/10';

export default function Contact() {
  const { profile, socials } = usePortfolio();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverMsg, setServerMsg] = useState('');

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrors({});
    try {
      const res = await sendContact(form);
      setServerMsg(res.message);
      setStatus('sent');
      setForm(EMPTY);
    } catch (err) {
      setErrors(err.errors || {});
      setServerMsg(err.errors ? '' : 'Could not reach the server. Please email me directly.');
      setStatus('error');
    }
  };

  const details = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${(profile.phone || '').replace(/\s/g, '')}` },
    { icon: SiWhatsapp, label: 'WhatsApp', value: 'Chat with me on WhatsApp', href: profile.whatsappUrl, external: true },
    { icon: MapPin, label: 'Location', value: profile.location },
  ];

  return (
    <section id="contact" className="section">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/50 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/10 blur-[160px]" />
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeading eyebrow="Contact" title="Let's build" highlight="something great." description="Have a project, a role, or an idea that needs React, Node.js and a touch of AI? My inbox is open." />
          <Reveal dir="up" delay={0.2} className="mt-10 space-y-4">
            {details.map((d) => (
              <div key={d.label} className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-violet-soft">
                  <d.icon size={18} />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">{d.label}</p>
                  {d.href ? (
                    <a href={d.href} target={d.external ? "_blank" : undefined} rel="noreferrer" className="text-white hover:text-violet-soft">
                      {d.value}
                    </a>
                  ) : (
                    <p className="text-white">{d.value}</p>
                  )}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal dir="up" delay={0.3} className="mt-10 flex gap-3">
            {socials.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <Magnetic key={s.id}>
                  <a href={s.url} target={s.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={s.label} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-slate-300 transition-all hover:border-violet hover:text-white hover:shadow-glow">
                    <Icon size={18} />
                  </a>
                </Magnetic>
              );
            })}
          </Reveal>
        </div>

        <Reveal dir="right">
          <form onSubmit={submit} className="card relative p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" error={errors.name}>
                <input className={inputCls} placeholder="John Doe" value={form.name} onChange={update('name')} required />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" className={inputCls} placeholder="you@company.com" value={form.email} onChange={update('email')} required />
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Subject">
                <input className={inputCls} placeholder="Project / Job opportunity / Collaboration" value={form.subject} onChange={update('subject')} />
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Message" error={errors.message}>
                <textarea rows={5} className={`${inputCls} resize-none`} placeholder="Tell me about what you're building..." value={form.message} onChange={update('message')} required />
              </Field>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Magnetic>
                <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-60">
                  {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </Magnetic>
              <AnimatePresence>
                {status === 'sent' && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 size={16} /> {serverMsg}
                  </motion.p>
                )}
                {status === 'error' && serverMsg && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2 text-sm text-rose-400">
                    <AlertCircle size={16} /> {serverMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
