import { useState } from "react";
import { NinetailedProvider, useNinetailed } from "@ninetailed/experience.js-react";

const CLIENT_ID = import.meta.env.VITE_NINETAILED_CLIENT_ID ?? "";

type Audience = "default" | "enterprise" | "developer" | "smb";

const AUDIENCE_OPTIONS: { id: Audience; label: string; color: string }[] = [
  { id: "default",    label: "Default",    color: "#6366f1" },
  { id: "enterprise", label: "Enterprise", color: "#0f172a" },
  { id: "developer",  label: "Developer",  color: "#16a34a" },
  { id: "smb",        label: "SMB",        color: "#ea580c" },
];

interface Content {
  badge: string;
  headline: string;
  subheadline: string;
  cta: string;
  secondaryCta: string;
  features: { icon: string; title: string; desc: string }[];
  testimonial: { quote: string; name: string; role: string };
  highlightPlan: string;
}

const CONTENT: Record<Audience, Content> = {
  default: {
    badge: "Now in public beta",
    headline: "Ship products faster with smart analytics",
    subheadline: "Forma gives your team real-time insight into what's working — so you can double down on it.",
    cta: "Start free trial",
    secondaryCta: "See how it works",
    features: [
      { icon: "📊", title: "Live dashboards", desc: "See data update in real time without refreshing." },
      { icon: "🔔", title: "Smart alerts", desc: "Get notified the moment something important changes." },
      { icon: "🤝", title: "Team views", desc: "Share dashboards and annotate charts together." },
      { icon: "⚡", title: "One-click setup", desc: "Connect your stack in minutes, no engineers needed." },
    ],
    testimonial: { quote: "We went from weekly reports to live decisions. Forma changed how we operate.", name: "Taylor Kim", role: "Head of Product, Orbit Labs" },
    highlightPlan: "Growth",
  },
  enterprise: {
    badge: "Enterprise-ready",
    headline: "Analytics at scale for enterprise teams",
    subheadline: "SAML SSO, custom SLAs, dedicated support, and compliance tools built in from day one.",
    cta: "Talk to sales",
    secondaryCta: "Download security brief",
    features: [
      { icon: "🔐", title: "SAML SSO & SCIM", desc: "Plug into your existing IdP with zero friction." },
      { icon: "🛡️", title: "SOC 2 Type II", desc: "Enterprise-grade security and full audit trails." },
      { icon: "🏢", title: "Multi-org support", desc: "Manage multiple business units from one control plane." },
      { icon: "📞", title: "Dedicated CSM", desc: "A named customer success manager available any time." },
    ],
    testimonial: { quote: "The SSO rollout took less than a day. Our InfoSec team approved it immediately.", name: "Jordan Rivera", role: "VP Engineering, Nexus Corp" },
    highlightPlan: "Enterprise",
  },
  developer: {
    badge: "Built API-first",
    headline: "APIs and SDKs crafted for developers",
    subheadline: "Full REST API, GraphQL, CLI tools, and SDKs in 12 languages. Integrate in minutes, not sprints.",
    cta: "Explore the docs",
    secondaryCta: "View on GitHub",
    features: [
      { icon: "⚡", title: "REST & GraphQL", desc: "Query exactly the data you need, the way you want it." },
      { icon: "🔗", title: "Webhooks", desc: "Push events to any endpoint in real time." },
      { icon: "🧰", title: "Official SDKs", desc: "Node, Python, Go, Ruby, Java — all maintained." },
      { icon: "🖥️", title: "CLI tool", desc: "Manage your workspace and automate from the terminal." },
    ],
    testimonial: { quote: "The API is exactly what a well-designed API should be. The docs are actually good.", name: "Sam Patel", role: "Senior Engineer, ByteStack" },
    highlightPlan: "Developer",
  },
  smb: {
    badge: "Perfect for small teams",
    headline: "Analytics that grow with your business",
    subheadline: "Set up in 10 minutes. No engineers needed. Pricing that makes sense when you're not yet at scale.",
    cta: "Start free — no card needed",
    secondaryCta: "View pricing",
    features: [
      { icon: "🚀", title: "10-minute setup", desc: "Connect and start seeing data right away." },
      { icon: "💸", title: "Pay as you grow", desc: "No seat fees. Pay only for what you actually use." },
      { icon: "📱", title: "Mobile-friendly", desc: "Check your numbers on the go from any device." },
      { icon: "🙋", title: "Live chat support", desc: "Get a human answer, not a bot, whenever you're stuck." },
    ],
    testimonial: { quote: "I replaced three tools with Forma and halved my monthly SaaS bill.", name: "Alex Chen", role: "Founder, Bloom Boutique" },
    highlightPlan: "Starter",
  },
};

const PLANS = [
  { name: "Starter",    price: "$29",   period: "/mo", desc: "Perfect for small teams.", features: ["Up to 5 users", "10k events/mo", "30-day history", "Email support"] },
  { name: "Growth",     price: "$99",   period: "/mo", desc: "For teams that want more.", features: ["Up to 25 users", "500k events/mo", "1-year history", "Slack + email support", "Custom alerts"] },
  { name: "Developer",  price: "$49",   period: "/mo", desc: "API-first plan for builders.", features: ["Unlimited API calls", "REST & GraphQL", "Webhooks", "CLI access", "SDK support"] },
  { name: "Enterprise", price: "Custom", period: "",   desc: "Tailored for large orgs.", features: ["Unlimited users", "Unlimited events", "SAML SSO / SCIM", "Dedicated CSM", "On-prem option"] },
];

function AudienceSwitcher({ active, onChange }: { active: Audience; onChange: (a: Audience) => void }) {
  const { identify } = useNinetailed();
  const handle = (id: Audience) => {
    onChange(id);
    const traits: Record<string, unknown> = {};
    if (id === "enterprise") traits.plan = "enterprise";
    if (id === "developer")  traits.role = "developer";
    if (id === "smb")        traits.plan = "smb";
    identify(id, traits).catch(() => {});
  };
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 50, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", border: "1px solid #e5e7eb", borderRadius: 999, padding: "8px 16px", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 4 }}>Audience:</span>
      {AUDIENCE_OPTIONS.map(a => (
        <button key={a.id} onClick={() => handle(a.id)} style={{ padding: "4px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.15s", background: active === a.id ? a.color : "transparent", color: active === a.id ? "#fff" : "#6b7280" }}>
          {a.label}
        </button>
      ))}
    </div>
  );
}

function Nav() {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f3f4f6" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>F</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>Forma</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 14, fontWeight: 500, color: "#6b7280" }}>
          {["Features", "Pricing", "Docs", "Blog"].map(l => <a key={l} href="#" style={{ color: "inherit", textDecoration: "none" }}>{l}</a>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>Log in</button>
          <button style={{ padding: "8px 16px", background: "#6366f1", color: "#fff", fontSize: 14, fontWeight: 600, borderRadius: 10, border: "none", cursor: "pointer" }}>Get started</button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ c }: { c: Content }) {
  return (
    <section style={{ padding: "80px 24px 96px", textAlign: "center" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <span style={{ display: "inline-block", padding: "4px 12px", background: "#eef2ff", color: "#6366f1", fontSize: 12, fontWeight: 700, borderRadius: 999, marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.badge}</span>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: "#111827", lineHeight: 1.15, marginBottom: 24 }}>{c.headline}</h1>
        <p style={{ fontSize: 20, color: "#6b7280", lineHeight: 1.6, marginBottom: 40, maxWidth: 540, margin: "0 auto 40px" }}>{c.subheadline}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{ padding: "14px 28px", background: "#6366f1", color: "#fff", fontSize: 16, fontWeight: 600, borderRadius: 12, border: "none", cursor: "pointer" }}>{c.cta}</button>
          <button style={{ padding: "14px 28px", background: "transparent", color: "#374151", fontSize: 16, fontWeight: 600, borderRadius: 12, border: "1px solid #e5e7eb", cursor: "pointer" }}>{c.secondaryCta} →</button>
        </div>
      </div>
    </section>
  );
}

function LogoBar() {
  return (
    <div style={{ borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", background: "#f9fafb", padding: "32px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>Trusted by 2,000+ teams worldwide</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {["Acme Corp", "Stellar", "Nexus", "ByteStack", "Orbit Labs", "Pulse"].map(l => (
            <span key={l} style={{ color: "#9ca3af", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features({ c }: { c: Content }) {
  return (
    <section style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", marginBottom: 16 }}>Everything you need</h2>
          <p style={{ color: "#6b7280", fontSize: 18 }}>Built for how modern teams actually work.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {c.features.map(f => (
            <div key={f.title} style={{ padding: 28, borderRadius: 16, border: "1px solid #f3f4f6", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 16 }}>{f.icon}</span>
              <h3 style={{ fontWeight: 700, color: "#111827", marginBottom: 8, fontSize: 17 }}>{f.title}</h3>
              <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial({ c }: { c: Content }) {
  const t = c.testimonial;
  return (
    <div style={{ background: "#6366f1", padding: "64px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <blockquote style={{ fontSize: 22, fontWeight: 500, color: "#fff", lineHeight: 1.6, marginBottom: 24 }}>"{t.quote}"</blockquote>
        <p style={{ color: "#c7d2fe", fontWeight: 600 }}>{t.name}</p>
        <p style={{ color: "#a5b4fc", fontSize: 14 }}>{t.role}</p>
      </div>
    </div>
  );
}

function Pricing({ highlight }: { highlight: string }) {
  return (
    <section style={{ padding: "96px 24px", background: "#f9fafb" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", marginBottom: 16 }}>Simple, honest pricing</h2>
          <p style={{ color: "#6b7280", fontSize: 18 }}>No surprises. No seat taxes. Cancel anytime.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {PLANS.map(p => {
            const hl = p.name === highlight;
            return (
              <div key={p.name} style={{ padding: 24, borderRadius: 20, background: hl ? "#6366f1" : "#fff", border: hl ? "none" : "1px solid #f3f4f6", boxShadow: hl ? "0 8px 32px rgba(99,102,241,0.25)" : "0 1px 4px rgba(0,0,0,0.04)", transform: hl ? "scale(1.03)" : "none", display: "flex", flexDirection: "column" }}>
                {hl && <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.2)", color: "#fff", padding: "2px 8px", borderRadius: 999, alignSelf: "flex-start", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Recommended</span>}
                <h3 style={{ fontWeight: 700, fontSize: 18, color: hl ? "#fff" : "#111827", marginBottom: 4 }}>{p.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 8 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: hl ? "#fff" : "#111827" }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: hl ? "#c7d2fe" : "#9ca3af" }}>{p.period}</span>
                </div>
                <p style={{ fontSize: 13, color: hl ? "#c7d2fe" : "#6b7280", marginBottom: 20 }}>{p.desc}</p>
                <ul style={{ listStyle: "none", marginBottom: 24, flex: 1 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: "flex", gap: 8, fontSize: 13, color: hl ? "#c7d2fe" : "#6b7280", marginBottom: 8 }}>
                      <span style={{ color: hl ? "#a5b4fc" : "#6366f1" }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button style={{ width: "100%", padding: "10px 0", borderRadius: 12, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", background: hl ? "#fff" : "#eef2ff", color: hl ? "#6366f1" : "#6366f1" }}>Get started</button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #f3f4f6", padding: "40px 24px", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}>F</span>
          </div>
          <span style={{ fontWeight: 700, color: "#374151" }}>Forma</span>
        </div>
        <p style={{ color: "#9ca3af", fontSize: 13 }}>© {new Date().getFullYear()} Forma, Inc. All rights reserved.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {["Privacy", "Terms", "Security"].map(l => <a key={l} href="#" style={{ color: "#9ca3af", fontSize: 13, textDecoration: "none" }}>{l}</a>)}
        </div>
      </div>
    </footer>
  );
}

function Site() {
  const [audience, setAudience] = useState<Audience>("default");
  const c = CONTENT[audience];
  return (
    <div style={{ minHeight: "100vh" }}>
      <Nav />
      <Hero c={c} />
      <LogoBar />
      <Features c={c} />
      <Testimonial c={c} />
      <Pricing highlight={c.highlightPlan} />
      <Footer />
      <AudienceSwitcher active={audience} onChange={setAudience} />
    </div>
  );
}

export default function App() {
  return (
    <NinetailedProvider clientId={CLIENT_ID} environment="main">
      <Site />
    </NinetailedProvider>
  );
}
