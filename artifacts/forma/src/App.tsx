import React, { useState } from "react";
import { NinetailedProvider, useNinetailed } from "@ninetailed/experience.js-react";

const CLIENT_ID = import.meta.env.VITE_NINETAILED_CLIENT_ID ?? "";

type Audience = "default" | "enterprise" | "developer" | "smb";

const AUDIENCES: { id: Audience; label: string; color: string }[] = [
  { id: "default", label: "Default", color: "#6366f1" },
  { id: "enterprise", label: "Enterprise", color: "#0f172a" },
  { id: "developer", label: "Developer", color: "#16a34a" },
  { id: "smb", label: "SMB", color: "#ea580c" },
];

interface AudienceContent {
  badge: string;
  headline: string;
  sub: string;
  cta: string;
  ctaSecondary: string;
  features: { icon: string; title: string; desc: string }[];
  highlightedPlan: string;
  testimonial: { quote: string; author: string; company: string };
}

const CONTENT: Record<Audience, AudienceContent> = {
  default: {
    badge: "Now in public beta",
    headline: "Ship products faster with\nsmart analytics",
    sub: "Forma gives your team real-time insight into what's working — so you can double down on it.",
    cta: "Start free trial",
    ctaSecondary: "See how it works",
    features: [
      { icon: "📊", title: "Real-time dashboards", desc: "See your data update live without refreshing." },
      { icon: "🔔", title: "Smart alerts", desc: "Get notified the moment something important changes." },
      { icon: "🤝", title: "Team collaboration", desc: "Share views, annotate charts, and work together." },
      { icon: "📁", title: "One data source", desc: "Connect your stack in minutes, no engineers needed." },
    ],
    highlightedPlan: "Growth",
    testimonial: {
      quote: "We went from weekly reports to live decisions. Forma changed how we operate.",
      author: "Taylor Kim",
      company: "Head of Product, Orbit Labs",
    },
  },
  enterprise: {
    badge: "Enterprise-ready",
    headline: "Analytics at scale for\nenterprise teams",
    sub: "SAML SSO, custom SLAs, dedicated support, and compliance tools built in from day one.",
    cta: "Talk to sales",
    ctaSecondary: "Download security brief",
    features: [
      { icon: "🔐", title: "SAML SSO & SCIM", desc: "Plug into your existing IdP with zero friction." },
      { icon: "🛡️", title: "SOC 2 Type II", desc: "Enterprise-grade security and audit trails out of the box." },
      { icon: "🏢", title: "Multi-org support", desc: "Manage multiple business units from one control plane." },
      { icon: "📞", title: "Dedicated CSM", desc: "A named customer success manager available any time." },
    ],
    highlightedPlan: "Enterprise",
    testimonial: {
      quote: "The SSO rollout took less than a day. Our InfoSec team approved it immediately.",
      author: "Jordan Rivera",
      company: "VP Engineering, Nexus Corp",
    },
  },
  developer: {
    badge: "Built API-first",
    headline: "APIs and SDKs crafted\nfor developers",
    sub: "Full REST API, GraphQL, CLI tools, and SDKs in 12 languages. Integrate in minutes, not sprints.",
    cta: "Explore the docs",
    ctaSecondary: "View on GitHub",
    features: [
      { icon: "⚡", title: "REST & GraphQL", desc: "Query exactly the data you need, the way you want it." },
      { icon: "🔗", title: "Webhooks", desc: "Push events to any endpoint in real time." },
      { icon: "🧰", title: "Official SDKs", desc: "Node, Python, Go, Ruby, Java and more — all maintained." },
      { icon: "🖥️", title: "CLI tool", desc: "Manage your workspace and automate tasks from the terminal." },
    ],
    highlightedPlan: "Developer",
    testimonial: {
      quote: "The API is exactly what a well-designed API should be. Docs are actually good.",
      author: "Sam Patel",
      company: "Senior Engineer, ByteStack",
    },
  },
  smb: {
    badge: "Perfect for small teams",
    headline: "Analytics that grow\nwith your business",
    sub: "Set up in 10 minutes. No engineers needed. Pricing that makes sense when you're not yet at scale.",
    cta: "Start free — no card needed",
    ctaSecondary: "View pricing",
    features: [
      { icon: "🚀", title: "10-minute setup", desc: "Connect your store or app and start seeing data right away." },
      { icon: "💸", title: "Pay as you grow", desc: "No seat fees. Pay only for what you actually use." },
      { icon: "📱", title: "Mobile-friendly", desc: "Check your numbers on the go from any device." },
      { icon: "🙋", title: "Live chat support", desc: "Get a human answer, not a bot, whenever you're stuck." },
    ],
    highlightedPlan: "Starter",
    testimonial: {
      quote: "I replaced three tools with Forma and halved my monthly SaaS bill. Couldn't be happier.",
      author: "Alex Chen",
      company: "Founder, Bloom Boutique",
    },
  },
};

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    desc: "Perfect for small teams getting started.",
    features: ["Up to 5 users", "10k events/mo", "30-day data history", "Email support"],
  },
  {
    name: "Growth",
    price: "$99",
    period: "/mo",
    desc: "For teams that want more power and flexibility.",
    features: ["Up to 25 users", "500k events/mo", "1-year history", "Slack + email support", "Custom alerts"],
  },
  {
    name: "Developer",
    price: "$49",
    period: "/mo",
    desc: "API-first plan built for builders.",
    features: ["Unlimited API calls", "Full REST & GraphQL", "Webhooks", "CLI access", "SDK support"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Tailored for large organisations.",
    features: ["Unlimited users", "Unlimited events", "SAML SSO / SCIM", "SLA + dedicated CSM", "On-prem option"],
  },
];

function AudienceSwitcher({
  active,
  onChange,
}: {
  active: Audience;
  onChange: (a: Audience) => void;
}) {
  const { identify } = useNinetailed();

  const handleSwitch = (id: Audience) => {
    onChange(id);
    const traits: Record<string, unknown> = {};
    if (id === "enterprise") traits.company_size = "enterprise";
    else if (id === "developer") traits.role = "developer";
    else if (id === "smb") traits.company_size = "smb";
    identify(id, traits).catch(() => {});
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/95 backdrop-blur border border-gray-200 rounded-full px-4 py-2 shadow-lg">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Audience:</span>
      {AUDIENCES.map((a) => (
        <button
          key={a.id}
          onClick={() => handleSwitch(a.id)}
          style={active === a.id ? { background: a.color, color: "#fff" } : {}}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            active === a.id ? "shadow-sm" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">Forma</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-gray-900 transition-colors">Docs</a>
          <a href="#blog" className="hover:text-gray-900 transition-colors">Blog</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Log in</button>
          <button className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            Get started
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ content }: { content: AudienceContent }) {
  return (
    <section className="pt-20 pb-24 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-6 uppercase tracking-wide">
          {content.badge}
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 whitespace-pre-line">
          {content.headline}
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
          {content.sub}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            {content.cta}
          </button>
          <button className="px-6 py-3 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
            {content.ctaSecondary} →
          </button>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const logos = ["Acme Corp", "Stellar", "Nexus", "ByteStack", "Orbit Labs", "Pulse"];
  return (
    <div className="border-y border-gray-100 py-8 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Trusted by 2,000+ companies worldwide
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {logos.map((l) => (
            <span key={l} className="text-gray-400 font-bold text-sm tracking-tight">
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features({ content }: { content: AudienceContent }) {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Built for how modern teams actually work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {content.features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial({ content }: { content: AudienceContent }) {
  const t = content.testimonial;
  return (
    <div className="bg-indigo-600 py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-6">
          "{t.quote}"
        </blockquote>
        <div>
          <p className="text-indigo-200 font-semibold">{t.author}</p>
          <p className="text-indigo-300 text-sm">{t.company}</p>
        </div>
      </div>
    </div>
  );
}

function Pricing({ highlighted }: { highlighted: string }) {
  return (
    <section id="pricing" className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, honest pricing</h2>
          <p className="text-gray-500 text-lg">No surprises. No seat taxes. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => {
            const isHL = plan.name === highlighted;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col ${
                  isHL
                    ? "bg-indigo-600 text-white shadow-xl scale-[1.03]"
                    : "bg-white border border-gray-100 shadow-sm text-gray-900"
                }`}
              >
                {isHL && (
                  <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full self-start mb-3 uppercase tracking-wider">
                    Recommended
                  </span>
                )}
                <h3 className={`font-bold text-lg mb-1 ${isHL ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-3xl font-extrabold ${isHL ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${isHL ? "text-indigo-200" : "text-gray-400"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mb-5 ${isHL ? "text-indigo-100" : "text-gray-500"}`}>
                  {plan.desc}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`text-sm flex items-start gap-2 ${isHL ? "text-indigo-100" : "text-gray-600"}`}>
                      <span className={isHL ? "text-indigo-200" : "text-indigo-500"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isHL
                      ? "bg-white text-indigo-700 hover:bg-indigo-50"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  }`}
                >
                  Get started
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTA({ content }: { content: AudienceContent }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
        <p className="text-gray-500 text-lg mb-8">
          Join thousands of teams already using Forma to make better decisions.
        </p>
        <button className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-lg">
          {content.cta}
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 py-10 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          <span className="text-gray-700 font-semibold">Forma</span>
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Forma, Inc. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-gray-400">
          <a href="#" className="hover:text-gray-600">Privacy</a>
          <a href="#" className="hover:text-gray-600">Terms</a>
          <a href="#" className="hover:text-gray-600">Security</a>
        </div>
      </div>
    </footer>
  );
}

function FormaApp() {
  const [audience, setAudience] = useState<Audience>("default");
  const content = CONTENT[audience];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Nav />
      <main>
        <Hero content={content} />
        <SocialProof />
        <Features content={content} />
        <Testimonial content={content} />
        <Pricing highlighted={content.highlightedPlan} />
        <CTA content={content} />
      </main>
      <Footer />
      <AudienceSwitcher active={audience} onChange={setAudience} />
    </div>
  );
}

export default function App() {
  return (
    <NinetailedProvider clientId={CLIENT_ID} environment="main">
      <FormaApp />
    </NinetailedProvider>
  );
}
