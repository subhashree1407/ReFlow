import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  RefreshCw,
  Leaf,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ChevronRight,
  Package,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Users,
} from "lucide-react";

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-[#fafbff] min-h-screen text-slate-900 selection:bg-violet-200 selection:text-violet-900">
      {/* ─── GOOGLE FONTS (Inter + Outfit) ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { font-family: 'Inter', system-ui, sans-serif; }
        h1,h2,h3,h4,h5,h6,.font-display { font-family: 'Outfit', system-ui, sans-serif; }
      `}</style>

      {/* ─────────────────── NAVBAR ─────────────────── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-b border-slate-200/60"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              <RefreshCw className="text-white w-[18px] h-[18px]" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              ReFlow
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-500">
            {["Product", "Solutions", "Pricing", "Company"].map((item) => (
              <button
                key={item}
                className="px-4 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100/70 transition-all"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <button className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100/70 transition-all">
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all">
                Start Free Trial
              </button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-5 pb-6 pt-2 shadow-xl animate-in slide-in-from-top-2">
            {["Product", "Solutions", "Pricing", "Company"].map((item) => (
              <button
                key={item}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {item}
              </button>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/login">
                <button className="w-full py-3 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-600/20">
                  Start Free Trial
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[72px]">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50 via-white to-indigo-50" />
          <div className="absolute top-20 -left-40 w-[700px] h-[700px] bg-violet-200/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-200/25 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-sky-200/20 rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto w-full px-5 md:px-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-20 py-16 lg:py-0">
          {/* Left */}
          <div className="lg:w-[55%] flex flex-col text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-widest text-violet-700 uppercase bg-violet-100/60 backdrop-blur-sm rounded-full w-fit mx-auto lg:mx-0 border border-violet-200/60 shadow-sm">
              <Zap size={14} className="text-violet-500" />
              Next-Gen Re-Fulfillment Platform
            </div>

            <h2 className="font-display text-5xl md:text-6xl lg:text-[4.25rem] font-black text-slate-900 mb-7 leading-[1.08] tracking-[-0.03em]">
              Turn Returns Into{" "}
              <br className="hidden md:block" />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500">
                  Revenue Streams
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 8C50 2 100 2 150 6C200 10 250 4 298 7"
                    stroke="url(#underline-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#7c3aed" />
                      <stop offset="1" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              ReFlow is a hyperlocal intelligence layer that reroutes returned
              products through nearby warehouses — cutting delivery time by 60%
              and logistics costs by 40%.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Link to="/signup">
                <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-violet-600/25 hover:shadow-2xl hover:shadow-violet-600/35 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.97]">
                  Get Started Free
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>

              <Link to="/login">
                <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-base hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.97] shadow-sm">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Demo
                </button>
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 text-sm text-slate-400 font-medium">
              <div className="flex -space-x-2">
                {[
                  "bg-violet-400",
                  "bg-indigo-400",
                  "bg-sky-400",
                  "bg-emerald-400",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                  >
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <span>
                Trusted by{" "}
                <span className="text-slate-700 font-semibold">2,400+</span>{" "}
                logistics teams worldwide
              </span>
            </div>
          </div>

          {/* Right — Hero Visual */}
          <div className="lg:w-[45%] flex justify-center relative z-10">
            <div className="relative w-full max-w-[540px]">
              {/* Decorative card behind */}
              <div className="absolute inset-4 bg-gradient-to-tr from-violet-100/80 to-indigo-50/80 rounded-[2.5rem] transform rotate-2 shadow-2xl shadow-violet-200/40 border border-violet-100/50" />

              {/* Main image container */}
              <div className="relative bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-white/80">
                <img
                  src="/deliveryman.png"
                  alt="Logistics Delivery"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </div>

              {/* Floating stat cards */}
              <div className="absolute -left-6 top-1/4 bg-white rounded-2xl px-5 py-4 shadow-xl shadow-slate-200/60 border border-slate-100 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      Cost Saved
                    </p>
                    <p className="text-lg font-extrabold text-slate-900 font-display">
                      40%
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl px-5 py-4 shadow-xl shadow-slate-200/60 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      Faster Delivery
                    </p>
                    <p className="text-lg font-extrabold text-slate-900 font-display">
                      60%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── LOGOS STRIP ─────────── */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">
            Powering logistics for forward-thinking brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6 opacity-40 grayscale">
            {[
              "Amazon",
              "Flipkart",
              "Meesho",
              "Delhivery",
              "Myntra",
              "Zepto",
            ].map((brand) => (
              <span
                key={brand}
                className="font-display text-2xl font-black text-slate-900 tracking-tight"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section className="py-24 lg:py-32 bg-[#fafbff] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-100/30 rounded-full blur-[100px] -z-0" />
        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-100/50 rounded-full border border-indigo-200/50">
              <Package size={14} />
              Core Capabilities
            </div>
            <h3 className="font-display text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-[-0.02em]">
              Built for Speed &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                Sustainability
              </span>
            </h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Transform returns from costly liabilities into a competitive
              advantage with our AI-powered hyperlocal redistribution engine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck size={28} />,
                gradient: "from-violet-500 to-violet-600",
                bg: "bg-violet-50",
                iconColor: "text-violet-600",
                shadowColor: "shadow-violet-500/10",
                title: "Hyperlocal Delivery",
                desc: "Route returned products to the nearest warehouse and fulfill new orders in the same zone — cutting last-mile time by up to 60%.",
              },
              {
                icon: <RefreshCw size={28} />,
                gradient: "from-indigo-500 to-indigo-600",
                bg: "bg-indigo-50",
                iconColor: "text-indigo-600",
                shadowColor: "shadow-indigo-500/10",
                title: "AI-Powered Routing",
                desc: "Our algorithms automatically assign the optimal warehouse for inspection, grading, and instant re-listing based on real-time demand signals.",
              },
              {
                icon: <Leaf size={28} />,
                gradient: "from-emerald-500 to-emerald-600",
                bg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                shadowColor: "shadow-emerald-500/10",
                title: "Carbon Neutral Flow",
                desc: "Eliminate redundant cross-country shipping. Our local redistribution model reduces supply chain carbon emissions by an average of 35%.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`group relative bg-white border border-slate-200/60 p-10 rounded-3xl hover:shadow-2xl ${card.shadowColor} hover:-translate-y-2 transition-all duration-500 cursor-default`}
              >
                {/* Top gradient line */}
                <div
                  className={`absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r ${card.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                <div
                  className={`w-14 h-14 ${card.bg} ${card.iconColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}
                >
                  {card.icon}
                </div>

                <h3 className="font-display text-xl font-bold mb-3 text-slate-900 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-[15px] leading-relaxed">
                  {card.desc}
                </p>

                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Learn more <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── STATS SECTION ─────────── */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-100" />

        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "60%", label: "Faster Fulfillment", icon: <Zap size={20} /> },
              { value: "40%", label: "Cost Reduction", icon: <BarChart3 size={20} /> },
              { value: "2.4K+", label: "Active Teams", icon: <Users size={20} /> },
              { value: "35%", label: "Less CO₂ Emissions", icon: <Globe size={20} /> },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-violet-400 mb-4 border border-white/10">
                  {stat.icon}
                </div>
                <p className="font-display text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest text-violet-600 uppercase bg-violet-100/50 rounded-full border border-violet-200/50">
              <Shield size={14} />
              How It Works
            </div>
            <h3 className="font-display text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-[-0.02em]">
              Three Steps to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                Smarter Returns
              </span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-[2px] bg-gradient-to-r from-violet-200 via-indigo-200 to-sky-200" />

            {[
              {
                step: "01",
                title: "Customer Initiates Return",
                desc: "The return request is captured and instantly analyzed. Our system identifies the product category, condition likelihood, and local demand.",
                color: "violet",
              },
              {
                step: "02",
                title: "Smart Warehouse Assignment",
                desc: "AI routes the returned item to the nearest qualifying warehouse based on capacity, demand signals, and inspection capabilities.",
                color: "indigo",
              },
              {
                step: "03",
                title: "Instant Re-Fulfillment",
                desc: "Once inspected and graded, the product is re-listed and fulfilled to a new nearby customer — often within hours, not days.",
                color: "sky",
              },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div
                  className={`w-12 h-12 mx-auto bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center mb-8 text-sm font-black relative z-10 border-4 border-white shadow-lg`}
                >
                  {item.step}
                </div>
                <h4 className="font-display text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-[15px] leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA SECTION ─────────── */}
      <section className="py-24 bg-[#fafbff]">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl shadow-violet-600/20">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="font-display text-4xl md:text-5xl font-black text-white mb-6 tracking-[-0.02em] leading-tight">
                Ready to revolutionize your reverse logistics?
              </h3>
              <p className="text-violet-100 text-lg mb-10 font-medium">
                Join thousands of logistics teams already saving millions with
                smarter return handling. Start your free 14-day trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <button className="group px-8 py-4 bg-white text-violet-700 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.97]">
                    Start Free Trial
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </Link>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold text-base hover:bg-white/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.97]">
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
        {/* Top border gradient */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-16 pb-12">
          {/* Main Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <RefreshCw className="text-white w-[18px] h-[18px]" strokeWidth={2.5} />
                </div>
                <span className="font-display text-xl font-extrabold text-white tracking-tight">
                  ReFlow
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
                The hyperlocal intelligence platform that transforms product
                returns into your fastest fulfillment channel.
              </p>
              <div className="flex gap-3">
                {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-violet-600 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:-translate-y-0.5"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {[
              {
                title: "Product",
                links: ["Features", "Integrations", "Pricing", "Changelog", "API Docs"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press Kit", "Partners"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "Community", "Webinars", "Status"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Security"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-5">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 py-8 border-t border-slate-800 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                <Mail size={14} className="text-violet-400" />
              </div>
              <span className="text-slate-400">hello@reflow.io</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                <Phone size={14} className="text-violet-400" />
              </div>
              <span className="text-slate-400">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                <MapPin size={14} className="text-violet-400" />
              </div>
              <span className="text-slate-400">
                San Francisco, CA · Bangalore, IN
              </span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
            <p className="text-xs text-slate-500 font-medium">
              © {new Date().getFullYear()} ReFlow Technologies Inc. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-300 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-slate-300 transition-colors">
                Cookies
              </a>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All systems operational
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;