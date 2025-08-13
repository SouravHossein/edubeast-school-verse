import React, { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, Layers, ShieldCheck, BarChart3, Users, Cpu } from "lucide-react";

const SaasHome: React.FC = () => {
  // Basic SEO for the landing page
  useEffect(() => {
    document.title = "EduBeast – School Management SaaS"; // < 60 chars
    const desc =
      "Modular, multi-tenant school management SaaS for admins, teachers, students, and parents."; // < 160 chars
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.origin + "/");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <Navigation />
      </header>

      <main>
        {/* Hero */}
        <section className="hero-gradient">
          <div className="container py-24 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                The School Management SaaS built to scale
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Run any institution — from small coaching centers to large campuses — with modular, themeable features you can toggle on or off.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/onboard">Start free trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/s/public">Explore public site</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                No credit card required • Multi‑role (Admin, Teacher, Student, Parent)
              </p>
            </div>
          </div>
        </section>

        {/* Social proof / KPIs */}
        <section className="border-y border-border">
          <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">2,500+</p>
              <p className="text-sm text-muted-foreground">Students managed</p>
            </div>
            <div>
              <p className="text-3xl font-bold">150+</p>
              <p className="text-sm text-muted-foreground">Teachers onboarded</p>
            </div>
            <div>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-muted-foreground">On‑time results</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50</p>
              <p className="text-sm text-muted-foreground">Countries represented</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need, modular by design</h2>
            <p className="mt-3 text-muted-foreground">
              Enable only what you need today. Add exams, attendance, communications, fees, and more when you’re ready.
            </p>
          </div>
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Feature icon={<Layers className="h-6 w-6" />} title="Modular architecture" desc="Toggle features like Exams, Attendance, Fees, Blog, Gallery, and more." />
            <Feature icon={<Users className="h-6 w-6" />} title="Multi‑role access" desc="Admins, Teachers, Students, and Parents get tailored dashboards." />
            <Feature icon={<ShieldCheck className="h-6 w-6" />} title="Secure by default" desc="Row‑Level Security and role‑based permissions powered by Supabase." />
            <Feature icon={<BarChart3 className="h-6 w-6" />} title="Actionable analytics" desc="Attendance trends, exam analytics, fee reports, and more." />
            <Feature icon={<Cpu className="h-6 w-6" />} title="Themeable UI" desc="Brand your portal with colors, fonts, and layout presets." />
            <Feature icon={<CheckCircle2 className="h-6 w-6" />} title="Ready to scale" desc="Multi‑tenant setup with domain support and onboarding wizard." />
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-card/40">
          <div className="container py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
              <p className="mt-3 text-muted-foreground">Start free, upgrade anytime. Plans for every size of school.</p>
            </div>
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <PricingCard name="Basic" price="$0" period="/mo" features={["Up to 100 students","Attendance & Exams","Public site pages","Email support"]} cta="Get started" />
              <PricingCard name="Premium" price="$49" period="/mo" featured features={["Unlimited students","All modules enabled","Custom branding","Priority support"]} cta="Start Premium" />
              <PricingCard name="Enterprise" price="Custom" features={["Advanced RBAC","SLA & SSO","Dedicated success","Custom integrations"]} cta="Contact sales" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-20">
          <div className="rounded-2xl p-8 md:p-12 card-gradient shadow-medium text-center">
            <h3 className="text-2xl md:text-3xl font-semibold">Launch your school portal in minutes</h3>
            <p className="mt-2 text-muted-foreground">No setup headaches. Import data, invite your team, and go live.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/onboard">Start free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EduBeast. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Feature: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="rounded-xl p-6 bg-card text-card-foreground border border-border shadow-soft">
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-muted-foreground">{desc}</p>
  </div>
);

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  featured?: boolean;
  cta: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ name, price, period, features, featured, cta }) => (
  <div className={`rounded-2xl p-6 border ${featured ? "border-primary shadow-strong" : "border-border shadow-soft"} bg-card text-card-foreground`}>
    <div className="flex items-baseline justify-between">
      <h3 className="text-xl font-semibold">{name}</h3>
      {featured && <span className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground">Popular</span>}
    </div>
    <div className="mt-4 flex items-end gap-1">
      <span className="text-3xl font-bold">{price}</span>
      {period && <span className="text-muted-foreground">{period}</span>}
    </div>
    <ul className="mt-6 space-y-2 text-sm">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />{f}</li>
      ))}
    </ul>
    <div className="mt-6">
      <Button className="w-full" variant={featured ? "default" : "outline"}>{cta}</Button>
    </div>
  </div>
);

export default SaasHome;
