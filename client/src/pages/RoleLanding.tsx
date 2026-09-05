import React from "react";
import { useSafety } from "@/contexts/SafetyContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Activity,
  ArrowRight,
  BotMessageSquare,
  CheckCircle2,
  ChevronRight,
  Compass,
  Globe2,
  Landmark,
  Layers,
  Lock,
  MapPin,
  MapPinned,
  Mountain,
  PhoneCall,
  Radio,
  Shield,
  ShieldCheck,
  Siren,
  Smartphone,
  Sparkles,
  UserCheck,
  UsersRound,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";

// Destination items with verified travel imagery
const DESTINATIONS = [
  {
    name: "Goa",
    tagline: "Beach Paradise",
    state: "Goa",
    riskLevel: "LOW",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Manali",
    tagline: "Himalayan Escape",
    state: "Himachal Pradesh",
    riskLevel: "MEDIUM",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Kerala",
    tagline: "Backwater Bliss",
    state: "Kerala",
    riskLevel: "LOW",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Udaipur",
    tagline: "City of Lakes",
    state: "Rajasthan",
    riskLevel: "LOW",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Leh-Ladakh",
    tagline: "Adventure Awaits",
    state: "Ladakh",
    riskLevel: "MEDIUM",
    imageUrl: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Varanasi",
    tagline: "Sacred Ghats",
    state: "Uttar Pradesh",
    riskLevel: "MEDIUM",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Kashmir",
    tagline: "Paradise Valley",
    state: "Jammu & Kashmir",
    riskLevel: "HIGH",
    imageUrl: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mysuru",
    tagline: "Cultural Heritage",
    state: "Karnataka",
    riskLevel: "LOW",
    imageUrl: "https://images.unsplash.com/photo-1600100397608-f010e423b961?auto=format&fit=crop&w=600&q=80",
  },
];

export default function RoleLanding() {
  const { setRole, activeState } = useSafety();
  const [, setLocation] = useLocation();

  const enterRole = (role: "TOURIST" | "AUTHORITY") => {
    setRole(role);
    setLocation(role === "TOURIST" ? "/tourist" : "/authority");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#071827] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#071827]/90 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8">
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#082235] dark:bg-cyan-500 text-cyan-300 dark:text-slate-950 shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-slate-950 dark:text-white">
                Suraksha Link
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-700 dark:text-cyan-400">
                SMART TOURIST SAFETY PORTAL
              </p>
            </div>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/pan-india"
              className="hidden md:inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 dark:border-cyan-500/30 bg-cyan-50/80 dark:bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-900 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 transition"
            >
              <Globe2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>Pan-India (36 States)</span>
            </Link>

            {/* Theme Toggle Button */}
            <ThemeToggle showLabel={false} />

            <Link
              href="/signin"
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="hidden sm:inline-flex rounded-xl bg-[#082235] dark:bg-cyan-500 hover:bg-[#0c314c] dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-2 text-xs font-bold transition shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Historical India → Travel / Journey → Modern India → Suraksha Link */}
      <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-[#faf9f5]/80 dark:bg-[#071827] transition-colors duration-300">
        {/* Subtle Historical Map Watermark Backdrop (Bounded strictly to Hero) */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden opacity-10 dark:opacity-15">
          <svg className="w-full h-full text-amber-900 dark:text-cyan-400" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* Subtle Map Grids & Compass Lines */}
            <circle cx="950" cy="350" r="280" strokeWidth="0.75" strokeDasharray="4 6" />
            <circle cx="950" cy="350" r="180" strokeWidth="0.5" />
            <path d="M 950 50 L 950 650 M 650 350 L 1250 350" strokeWidth="0.5" strokeDasharray="3 6" />
            <path d="M 100 200 Q 300 150 500 280 T 900 350 T 1150 250" strokeWidth="1" strokeDasharray="6 8" />
            <path d="M 150 500 Q 400 420 650 480 T 1050 420" strokeWidth="0.75" strokeDasharray="4 6" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#faf9f5]/50 dark:via-[#071827]/50 to-[#faf9f5] dark:to-[#071827]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            {/* Hero Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 dark:border-amber-400/20 bg-amber-50/90 dark:bg-amber-950/40 px-4 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 backdrop-blur-md shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Historical Trails · Modern Safety Protection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08]">
                EVERY JOURNEY HAS A STORY.{" "}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-cyan-600 dark:from-amber-400 dark:via-cyan-400 dark:to-teal-300">
                  EVERY JOURNEY DESERVES SAFETY.
                </span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 max-w-xl font-normal">
                From ancient routes and timeless destinations to the journeys of today, Suraksha Link helps make travel across India safer, smarter and more connected.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("features");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-6 py-4 text-sm font-bold shadow-lg transition active:scale-[.98]"
                >
                  <span>EXPLORE SURAKSHA LINK</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => enterRole("TOURIST")}
                  className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0d2233] text-slate-900 dark:text-slate-100 px-6 py-4 text-sm font-bold hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
                >
                  <span>ENTER TOURIST PORTAL</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => enterRole("AUTHORITY")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/40 dark:border-cyan-500/30 bg-cyan-50/80 dark:bg-cyan-950/40 px-5 py-4 text-sm font-bold text-cyan-950 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 transition"
                >
                  <span>COMMAND CENTRE</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Active Region Indicator */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1">
                <MapPin className="h-4 w-4 text-amber-600 dark:text-cyan-400 flex-shrink-0" />
                <span>
                  Active Region: <strong className="text-slate-900 dark:text-white font-bold">{activeState.name} ({activeState.capital})</strong> · Instant switching available across all 36 territories.
                </span>
              </div>
            </div>

            {/* Hero Right Visual Composition: Single strong visual (Historical India → Modern Safety Route) */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0d2233] shadow-2xl overflow-hidden group">
                {/* Visual Canvas Container */}
                <div className="relative h-96 sm:h-[420px] w-full overflow-hidden bg-slate-950">
                  {/* Base Travel & Heritage Imagery */}
                  <img
                    src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
                    alt="Indian Heritage & Travel Scene"
                    className="h-full w-full object-cover object-center filter saturate-[1.15] contrast-105 group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

                  {/* Historical Map Overlay Effect on the Left Portion of the Visual */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />

                  {/* SVG Route Line: Transitioning from Ancient Dashed Gold to Modern Glowing Cyan */}
                  <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 500 400" preserveAspectRatio="none">
                    {/* Ancient Route (Left / Top-Left): Gold Dashed Line */}
                    <path
                      d="M 40 80 Q 120 160 220 190"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3"
                      strokeDasharray="6 6"
                      className="opacity-90"
                    />
                    {/* Modern Protection Route (Centre to Right): Glowing Cyan Solid Line */}
                    <path
                      d="M 220 190 Q 320 220 440 310"
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="4"
                      className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    />

                    {/* Node 1: Historical Route Marker */}
                    <circle cx="40" cy="80" r="6" fill="#D97706" />
                    <circle cx="40" cy="80" r="10" fill="none" stroke="#F59E0B" strokeWidth="1.5" />

                    {/* Node 2: Transition Milestone */}
                    <circle cx="220" cy="190" r="6" fill="#F59E0B" />

                    {/* Node 3: Suraksha Link Protected Destination */}
                    <circle cx="440" cy="310" r="8" fill="#06B6D4" className="animate-pulse" />
                    <circle cx="440" cy="310" r="16" fill="none" stroke="#06B6D4" strokeWidth="2" className="animate-ping opacity-75" />
                  </svg>

                  {/* Top Badge Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                      <Landmark className="h-3.5 w-3.5 text-amber-400" />
                      <span>Ancient Trails</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-cyan-300 border border-cyan-500/30">
                      <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Suraksha Link Protected</span>
                    </span>
                  </div>

                  {/* Route Label Badges Floating over SVG Nodes */}
                  <div className="absolute top-[60px] left-[55px] bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-amber-200 border border-amber-500/40 rounded-lg px-2 py-0.5 shadow-md">
                    Ancient Silk & Spice Route
                  </div>

                  <div className="absolute bottom-[90px] right-[70px] bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-cyan-200 border border-cyan-500/40 rounded-lg px-2 py-0.5 shadow-md flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    AI Safe Route Active
                  </div>

                  {/* Bottom Visual Card Banner */}
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-md p-4 border-t border-white/10 flex items-center justify-between text-white">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                        HISTORICAL INDIA → MODERN PROTECTION
                      </p>
                      <p className="text-xs font-bold text-slate-200 mt-0.5">
                        Smart Safety Infrastructure for All 36 States & UTs
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                      <span>SHA-256 Sync</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Travel Destinations Showcase */}
      <section id="destinations" className="py-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#050f1a]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                DISCOVER INDIA SAFELY
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                Popular Travel Destinations & Safety Coverage
              </h2>
            </div>
            <Link
              href="/pan-india"
              className="text-xs font-bold text-cyan-700 dark:text-cyan-300 hover:underline flex items-center gap-1"
            >
              <span>Explore All Destinations</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                className="flex-shrink-0 w-64 snap-start rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0d2233] p-3 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className={`absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    dest.riskLevel === "LOW" ? "bg-emerald-500/90 text-white" :
                    dest.riskLevel === "MEDIUM" ? "bg-amber-500/90 text-white" : "bg-rose-500/90 text-white"
                  }`}>
                    {dest.riskLevel} RISK
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-base font-black leading-tight">{dest.name}</p>
                    <p className="text-[11px] font-medium text-slate-300">{dest.tagline}</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                  <span>{dest.state}</span>
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 font-mono">Protected ●</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Main Value Proposition Cards */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
              NATIONAL SAFETY ARCHITECTURE
            </p>
            <h2 className="text-3xl font-black text-slate-950 dark:text-white">
              Built to Protect Every Step of Your Journey
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0d2233] p-7 shadow-lg space-y-4 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                Smart Travel Safety
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                AI-powered risk predictions, live geofencing alerts, and safe route recommendations tailored to your immediate coordinates.
              </p>
              <div className="rounded-2xl bg-slate-50 dark:bg-[#050f1a] p-4 border border-slate-200/60 dark:border-slate-800 text-xs font-mono space-y-1">
                <p className="text-cyan-700 dark:text-cyan-400 font-bold">● Risk Prediction Engine</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Dynamic zone calculation & route risk score</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0d2233] p-7 shadow-lg space-y-4 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                Connected & Verified
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Verified digital identity, trusted contact alerts, and blockchain-anchored incident logs for cryptographic tamper-proofing.
              </p>
              <div className="rounded-2xl bg-slate-50 dark:bg-[#050f1a] p-4 border border-slate-200/60 dark:border-slate-800 text-xs font-mono space-y-1">
                <p className="text-purple-700 dark:text-purple-400 font-bold">● Digital ID & SHA-256 Ledger</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Private off-chain identity with public state anchor</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0d2233] p-7 shadow-lg space-y-4 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                <PhoneCall className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                Prepared for Emergencies
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                One-tap SOS dispatch, offline SMS queueing, and direct connection to local state tourist police anytime, anywhere.
              </p>
              <div className="rounded-2xl bg-slate-50 dark:bg-[#050f1a] p-4 border border-slate-200/60 dark:border-slate-800 text-xs font-mono space-y-1">
                <p className="text-rose-700 dark:text-rose-400 font-bold">● Emergency SOS Protocol</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Zero-latency dispatch & location broadcasting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology Capabilities Strip */}
      <section className="py-12 border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-100/80 dark:bg-[#050f1a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Radio className="h-5 w-5" />
              </div>
              <p className="text-sm font-black text-slate-950 dark:text-white pt-2">Offline-First Support</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Works even with zero network</p>
            </div>

            <div className="space-y-1">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Layers className="h-5 w-5" />
              </div>
              <p className="text-sm font-black text-slate-950 dark:text-white pt-2">Tamper-Evident Records</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Blockchain-backed audit trails</p>
            </div>

            <div className="space-y-1">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Globe2 className="h-5 w-5" />
              </div>
              <p className="text-sm font-black text-slate-950 dark:text-white pt-2">Multi-Language Support</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">English, Hindi & Kannada</p>
            </div>

            <div className="space-y-1">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Shield className="h-5 w-5" />
              </div>
              <p className="text-sm font-black text-slate-950 dark:text-white pt-2">Privacy First</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your data. Your control.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
            Explore India with confidence.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Stay informed, stay connected, and stay safer wherever your journey takes you across India's 36 States & Union Territories.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => enterRole("TOURIST")}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#082235] dark:bg-cyan-500 hover:bg-[#0c314c] dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-7 py-4 text-sm font-bold shadow-xl transition"
            >
              <span>Enter Traveller Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/pan-india"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0d2233] px-7 py-4 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <span>View Safety Network</span>
              <Globe2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050f1a] py-12 text-slate-600 dark:text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#082235] dark:bg-cyan-500 text-cyan-300 dark:text-slate-950">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white">Suraksha Link</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Smart Tourist Safety Portal providing real-time safety intelligence, emergency response, and verified digital identity across all 36 Indian states and union territories.
            </p>
            <p className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
              Built for Smart India Hackathon 2026
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Quick Links</p>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => enterRole("TOURIST")} className="hover:underline">Traveller Portal</button></li>
              <li><button onClick={() => enterRole("AUTHORITY")} className="hover:underline">Command Centre</button></li>
              <li><Link href="/tourist/map" className="hover:underline">Safety Map</Link></li>
              <li><Link href="/tourist/guardian" className="hover:underline">Guardian AI</Link></li>
              <li><Link href="/tourist/contacts" className="hover:underline">Emergency Contacts</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Technology</p>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/authority/intelligence" className="hover:underline">AI Risk Intelligence</Link></li>
              <li><Link href="/authority/digital-twin" className="hover:underline">Digital Twin & Edge Computing</Link></li>
              <li><Link href="/authority/audit" className="hover:underline">Blockchain Audit Ledger</Link></li>
              <li><Link href="/authority/ml-monitoring" className="hover:underline">AI / ML Model Observatory</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Emergency Directory</p>
            <ul className="space-y-1.5 text-[11px]">
              <li>National Emergency: <strong>112</strong></li>
              <li>Women Helpline: <strong>1091</strong></li>
              <li>Tourist Helpline: <strong>1363 / 1800-11-1363</strong></li>
              <li>Medical Emergency: <strong>108</strong></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-8 mt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-[10px] text-slate-400">
          © 2026 Suraksha Link • Smart Tourist Safety Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function PreviewCard({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#050f1a]/80 p-4 transition hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:bg-cyan-50/50 dark:hover:bg-slate-800/60 group"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
        <p className="text-xs font-bold text-slate-900 dark:text-white">{title}</p>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{body}</p>
    </Link>
  );
}
