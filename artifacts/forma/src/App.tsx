import { NinetailedProvider, useNinetailed } from "@ninetailed/experience.js-react";
import { NinetailedPreviewPlugin } from "@ninetailed/experience.js-plugin-preview";
import { useState, createContext, useContext } from "react";

/* ─────────────────────────────────────────────
   Audience context — drives all personalization
   ───────────────────────────────────────────── */
type AudienceKey = "default" | "enterprise" | "developer" | "smb";

const AudienceCtx = createContext<AudienceKey>("default");
const useAudience = () => useContext(AudienceCtx);

/* ─────────────────────────────────────────────
   Content variants
   ───────────────────────────────────────────── */
const heroContent: Record<AudienceKey, {
  headline: string;
  subheadline: string;
  cta: string;
  ctaSecondary: string;
  badge: string;
  badgeColor: string;
}> = {
  default: {
    headline: "Build products your users will love",
    subheadline: "Forma gives your team the tools to design, ship, and iterate faster than ever — without the complexity.",
    cta: "Start for free",
    ctaSecondary: "See how it works",
    badge: "Trusted by 10,000+ teams",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  enterprise: {
    headline: "Enterprise-grade security. Startup-level speed.",
    subheadline: "Forma meets your compliance requirements — SOC 2 Type II, HIPAA, and GDPR — while keeping your engineering team moving fast.",
    cta: "Schedule a demo",
    ctaSecondary: "See security docs",
    badge: "Trusted by Fortune 500 companies",
    badgeColor: "bg-slate-100 text-slate-700",
  },
  developer: {
    headline: "Ship faster with an API-first platform",
    subheadline: "Fully typed REST + GraphQL APIs, webhooks, CLI tools, and an open-source SDK. Forma fits right into your workflow.",
    cta: "Read the docs",
    ctaSecondary: "Explore the API",
    badge: "Open source core. MIT licensed.",
    badgeColor: "bg-green-100 text-green-700",
  },
  smb: {
    headline: "Everything your small team needs, nothing it doesn't",
    subheadline: "Get set up in minutes, not months. Forma grows with you — from 5 users to 500 — with transparent, predictable pricing.",
    cta: "Try free for 14 days",
    ctaSecondary: "See pricing",
    badge: "No credit card required",
    badgeColor: "bg-amber-100 text-amber-700",
  },
};

const pricingHighlight: Record<AudienceKey, "starter" | "growth" | "enterprise"> = {
  default: "growth",
  enterprise: "enterprise",
  developer: "growth",
  smb: "starter",
};

/* ─────────────────────────────────────────────
   ROOT — wraps everything in NinetailedProvider
   ───────────────────────────────────────────── */
export default function App() {
  const clientId = import.meta.env.VITE_NINETAILED_CLIENT_ID ?? "";
  const [audience, setAudience] = useState<AudienceKey>("default");

  return (
    <NinetailedProvider
      clientId={clientId}
      environment="main"
      plugins={[
        new NinetailedPreviewPlugin({
          experiences: [],
          audiences: [
            { id: "enterprise-visitors", name: "Enterprise Visitors" },
            { id: "developer-visitors",  name: "Developer Visitors"  },
            { id: "smb-visitors",        name: "SMB Visitors"        },
          ],
        }),
      ]}
    >
      <AudienceCtx.Provider value={audience}>
        <Site setAudience={setAudience} currentAudience={audience} />
      </AudienceCtx.Provider>
    </NinetailedProvider>
  );
}

/* ─────────────────────────────────────────────
   SITE SHELL
   ───────────────────────────────────────────── */
function Site({ setAudience, currentAudience }: {
  setAudience: (a: AudienceKey) => void;
  currentAudience: AudienceKey;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Nav />
      <main>
        <HeroSection />
        <LogoBar />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
      <AudienceIdentifier setAudience={setAudience} currentAudience={currentAudience} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV
   ───────────────────────────────────────────── */
function Nav() {
  return (
    <nav className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">F</div>
          <span className="font-semibold text-slate-900 text-lg">Forma</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="#" className="hover:text-slate-900 transition-colors">Product</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Docs</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Blog</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Log in</button>
          <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            Get started
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO — reads audience from context
   ───────────────────────────────────────────── */
function HeroSection() {
  const audience = useAudience();
  const c = heroContent[audience];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-28 transition-all duration-500">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-indigo-50 rounded-full opacity-60 blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Ninetailed experience label */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs text-indigo-400 font-mono">
            ninetailed: audience = <span className="text-indigo-600 font-semibold">{audience}</span>
          </span>
        </div>
        <span key={`badge-${audience}`} className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6 ${c.badgeColor} animate-fade`}>
          {c.badge}
        </span>
        <h1 key={`h-${audience}`} className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
          {c.headline}
        </h1>
        <p key={`p-${audience}`} className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
          {c.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-indigo-200 transition-colors">
            {c.cta}
          </button>
          <button className="w-full sm:w-auto text-slate-600 hover:text-slate-900 font-medium px-8 py-3.5 rounded-xl text-sm border border-slate-200 hover:border-slate-300 transition-colors">
            {c.ctaSecondary} →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   LOGO BAR
   ───────────────────────────────────────────── */
function LogoBar() {
  const logos = ["Stripe", "Linear", "Vercel", "Notion", "Figma", "Loom"];
  return (
    <div className="border-y border-slate-100 py-8 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs text-slate-400 uppercase tracking-widest font-medium mb-6">Used by teams at</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-14">
          {logos.map((l) => (
            <span key={l} className="text-slate-400 font-semibold text-lg tracking-tight">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURES
   ───────────────────────────────────────────── */
const features = [
  { icon: "⚡", title: "Instant setup",       desc: "Connect your stack in under 5 minutes. No infrastructure to manage, no DevOps required." },
  { icon: "🔒", title: "Security first",      desc: "SOC 2 Type II certified. End-to-end encryption, SSO, and granular role-based access control." },
  { icon: "📊", title: "Built-in analytics",  desc: "Track everything that matters. Funnel analysis, session replays, and real-time dashboards." },
  { icon: "🔌", title: "100+ integrations",   desc: "Slack, Salesforce, HubSpot, Jira — Forma connects to every tool your team already uses." },
  { icon: "🌍", title: "Global edge network", desc: "Sub-50ms response times worldwide. Your users get a fast experience no matter where they are." },
  { icon: "🤝", title: "Dedicated support",   desc: "Live chat, email, and phone support. Our team is here to help you succeed." },
];

function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything your team needs</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">One platform that replaces five tools. Reduce complexity, cut costs, ship faster.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRICING — highlighted plan switches per audience
   ───────────────────────────────────────────── */
const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    per: "per month",
    desc: "Perfect for small teams just getting started.",
    features: ["Up to 5 users", "3 projects", "Basic analytics", "Community support"],
    cta: "Start for free",
    ctaStyle: "border border-slate-200 text-slate-700 hover:bg-slate-50",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$49",
    per: "per month",
    desc: "For growing teams that need more power.",
    features: ["Up to 25 users", "Unlimited projects", "Advanced analytics", "Priority support", "Custom integrations"],
    cta: "Start free trial",
    ctaStyle: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    per: "contact us",
    desc: "For large orgs with custom requirements.",
    features: ["Unlimited users", "SSO & SAML", "SOC 2 / HIPAA", "Dedicated SLA", "Custom contracts", "Onboarding support"],
    cta: "Schedule a demo",
    ctaStyle: "border border-slate-800 text-slate-800 hover:bg-slate-900 hover:text-white",
  },
];

function PricingSection() {
  const audience = useAudience();
  const highlighted = pricingHighlight[audience];

  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-slate-500">No surprise fees. Change plans anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => {
            const isHighlighted = plan.id === highlighted;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 transition-all duration-500 ${
                  isHighlighted
                    ? "bg-white border-2 border-indigo-500 shadow-xl shadow-indigo-100 scale-105"
                    : "bg-white border border-slate-200 shadow-sm"
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    Recommended for you ✦
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-slate-400 text-sm">{plan.per}</span>
                  </div>
                  <p className="text-sm text-slate-500">{plan.desc}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-green-500 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${plan.ctaStyle}`}>
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA
   ───────────────────────────────────────────── */
function CtaSection() {
  const audience = useAudience();
  const c = heroContent[audience];
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-16 shadow-2xl shadow-indigo-200">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-indigo-200 text-lg mb-8">Join over 10,000 teams already using Forma to ship faster.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
              {c.cta}
            </button>
            <button className="border border-indigo-400 text-white font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-indigo-700 transition-colors">
              Talk to sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">F</div>
          <span className="font-semibold text-slate-700">Forma</span>
        </div>
        <p className="text-sm text-slate-400">© 2025 Forma, Inc. — Powered by Ninetailed personalization.</p>
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-slate-700">Privacy</a>
          <a href="#" className="hover:text-slate-700">Terms</a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   AUDIENCE SWITCHER
   Calls ninetailed.identify() so the SDK tracks
   the visitor, then updates local state instantly
   ───────────────────────────────────────────── */
const audienceOptions: { key: AudienceKey; label: string; audienceId: string; traits: Record<string, unknown> }[] = [
  { key: "default",    label: "👤 Default",       audienceId: "",                  traits: {} },
  { key: "enterprise", label: "🏢 Enterprise",    audienceId: "enterprise-visitors", traits: { audience: "enterprise-visitors", company_size: 1000, plan: "enterprise" } },
  { key: "developer",  label: "👩‍💻 Developer",    audienceId: "developer-visitors",  traits: { audience: "developer-visitors",  role: "engineer",   github_user: true  } },
  { key: "smb",        label: "🏪 Small Business", audienceId: "smb-visitors",       traits: { audience: "smb-visitors",        company_size: 8,    plan: "starter"    } },
];

function AudienceIdentifier({ setAudience, currentAudience }: {
  setAudience: (a: AudienceKey) => void;
  currentAudience: AudienceKey;
}) {
  const { identify } = useNinetailed();

  const handleSwitch = (opt: typeof audienceOptions[number]) => {
    // 1. Tell Ninetailed who this visitor is (tracked in your dashboard)
    identify("visitor-demo", opt.traits);
    // 2. Update local state → page re-renders with new content immediately
    setAudience(opt.key);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-max">
      <div className="bg-slate-900/95 backdrop-blur text-white rounded-2xl shadow-2xl px-5 py-3.5 flex flex-col sm:flex-row items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-slate-300 text-xs font-medium">Ninetailed identify()</span>
        </div>
        <div className="w-px h-4 bg-slate-700 hidden sm:block" />
        <div className="flex gap-2 flex-wrap justify-center">
          {audienceOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSwitch(opt)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentAudience === opt.key
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-900/30"
                  : "bg-slate-700/80 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
