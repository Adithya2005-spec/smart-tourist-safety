import { useSafety } from "@/contexts/SafetyContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { allIndianStates } from "@/lib/india-safety-data";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  BotMessageSquare,
  ChevronLeft,
  ClipboardCheck,
  ContactRound,
  Gauge,
  Globe2,
  IdCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  MapPinned,
  Menu,
  RadioTower,
  Settings,
  ShieldCheck,
  Siren,
  Sparkles,
  User,
  UsersRound,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

type NavItem = { href: string; label: string; icon: React.ElementType; danger?: boolean; highlight?: boolean };

const touristNav: NavItem[] = [
  { href: "/tourist", label: "Safety overview", icon: ShieldCheck },
  { href: "/pan-india", label: "Pan-India Explorer", icon: Globe2, highlight: true },
  { href: "/tourist/map", label: "Safety map", icon: MapPinned },
  { href: "/tourist/sos", label: "SOS centre", icon: Siren, danger: true },
  { href: "/tourist/incidents", label: "My incidents", icon: ClipboardCheck },
  { href: "/tourist/identity", label: "Digital identity", icon: IdCard },
  { href: "/tourist/guardian", label: "Guardian AI", icon: BotMessageSquare },
  { href: "/tourist/contacts", label: "Emergency contacts", icon: ContactRound },
  { href: "/tourist/location", label: "Live location", icon: RadioTower },
  { href: "/tourist/settings", label: "Settings", icon: Settings },
];

const authorityNav: NavItem[] = [
  { href: "/authority", label: "Command centre", icon: LayoutDashboard },
  { href: "/pan-india", label: "Pan-India Directory", icon: Globe2, highlight: true },
  { href: "/authority/incidents", label: "Incident queue", icon: Siren },
  { href: "/authority/tourists", label: "Tourists", icon: UsersRound },
  { href: "/authority/risk", label: "Risk zones", icon: Gauge },
  { href: "/authority/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/authority/audit", label: "Blockchain audit", icon: ClipboardCheck },
];

export function RiskBadge({
  score,
  band,
  compact = false,
}: {
  score?: number;
  band: "SAFE" | "CAUTION" | "DANGER" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  compact?: boolean;
}) {
  const tone = ["DANGER", "HIGH", "CRITICAL"].includes(band)
    ? "border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-300"
    : ["CAUTION", "MEDIUM"].includes(band)
      ? "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300"
      : "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-[0.09em]", tone)}>
      {score !== undefined && <span>{score}</span>}
      {band}
      {!compact && " RISK"}
    </span>
  );
}

export function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        online
          ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"
          : "bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]",
      )}
    />
  );
}

export function SafetyShell({
  children,
  title,
  eyebrow,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow: string;
  actions?: React.ReactNode;
}) {
  const {
    role,
    setRole,
    online,
    pendingSyncCount,
    language,
    setLanguage,
    activeStateId,
    activeState,
    setActiveState,
    userSession,
    logout,
  } = useSafety();

  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const authority = role !== "TOURIST";
  const navigation = authority
    ? role === "ADMIN"
      ? [...authorityNav, { href: "/admin", label: "Admin oversight", icon: Activity }]
      : authorityNav
    : touristNav;

  const handleStateChange = (newId: string) => {
    setActiveState(newId);
    const target = allIndianStates.find((s) => s.id === newId);
    toast.success(`Active State changed to ${target?.name}!`, {
      description: `Loaded local emergency helplines & geofences for ${target?.capital}.`,
    });
  };

  const handleSignOut = () => {
    logout();
    toast.info("Signed Out", { description: "Session ended. You can sign in anytime." });
    setLocation("/signin");
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-slate-200 dark:border-slate-800 bg-[#082235] text-white lg:flex">
        <Brand compact={false} />
        
        {/* Active Indian State Widget in Sidebar */}
        <div className="mx-3 mb-2 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Active Territory
            </span>
            <Link
              href="/pan-india"
              className="text-[10px] font-bold text-cyan-300 hover:text-cyan-200 underline"
            >
              Change
            </Link>
          </div>
          <p className="text-sm font-black text-white">{activeState.name}</p>
          <p className="text-[11px] text-slate-300">
            Police: <strong className="text-cyan-300">{activeState.emergency.touristPolice}</strong>
          </p>
        </div>

        <Navigation items={navigation} path={location} />

        <div className="mt-auto border-t border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/20 text-cyan-300">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">{userSession.fullName}</p>
                <p className="text-[10px] text-slate-400">{role === "TOURIST" ? "Verified Traveller" : role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2">
            <span>Suraksha Link v2.0</span>
            <span className="font-semibold text-cyan-300">Pan-India Mode</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-[280px]">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-7">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-700 dark:text-slate-200"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-800 dark:text-cyan-400">
                {eyebrow}
              </p>
              <h1 className="truncate text-lg font-black tracking-tight text-slate-950 dark:text-white sm:text-xl">
                {title}
              </h1>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2">
              {/* Quick State Switcher Dropdown */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1">
                <MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <select
                  aria-label="Active Indian State"
                  value={activeStateId}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="h-8 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                >
                  {allIndianStates.map((st) => (
                    <option key={st.id} value={st.id} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Edge Connection Badge */}
              <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <StatusDot online={online} />
                <span>{online ? "Edge Connected" : "Offline Safe"}</span>
              </div>

              {pendingSyncCount > 0 && (
                <div className="rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 px-2.5 py-1 text-xs font-bold text-amber-900 dark:text-amber-300">
                  {pendingSyncCount} queued
                </div>
              )}

              {/* Light / Dark Mode Toggle */}
              <ThemeToggle />

              {/* Language Selector */}
              <select
                aria-label="Language"
                className="hidden md:block h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-cyan-600/20"
                value={language}
                onChange={(event) => setLanguage(event.target.value as typeof language)}
              >
                <option value="en" className="bg-white dark:bg-slate-800">EN (English)</option>
                <option value="hi" className="bg-white dark:bg-slate-800">HI (हिन्दी)</option>
                <option value="kn" className="bg-white dark:bg-slate-800">KN (ಕನ್ನಡ)</option>
              </select>

              {/* Demo Role Switcher */}
              <select
                aria-label="Demo role"
                className="h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-cyan-600/20"
                value={role}
                onChange={(event) => setRole(event.target.value as typeof role)}
              >
                <option value="TOURIST" className="bg-white dark:bg-slate-800">Tourist View</option>
                <option value="AUTHORITY" className="bg-white dark:bg-slate-800">Command Responder</option>
                <option value="ADMIN" className="bg-white dark:bg-slate-800">Admin Oversight</option>
              </select>

              {/* Action Slots */}
              {actions}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto max-w-[1600px] p-4 sm:p-7">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[290px] flex-col bg-[#082235] text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand compact />
              <Button
                variant="ghost"
                size="icon"
                className="mr-3 text-white hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile State Switcher */}
            <div className="px-3 pb-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                Active Indian State
              </label>
              <select
                value={activeStateId}
                onChange={(e) => handleStateChange(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/10 p-2.5 text-xs font-bold text-white outline-none"
              >
                {allIndianStates.map((st) => (
                  <option key={st.id} value={st.id} className="text-slate-900">
                    {st.name} ({st.region})
                  </option>
                ))}
              </select>
            </div>

            <Navigation items={navigation} path={location} onNavigate={() => setMobileOpen(false)} />

            <div className="mt-auto border-t border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Mode & Theme</span>
                <ThemeToggle />
              </div>
              <select
                className="w-full rounded-lg bg-white/10 p-2 text-xs text-white"
                value={role}
                onChange={(event) => setRole(event.target.value as typeof role)}
              >
                <option className="text-slate-900" value="TOURIST">Tourist demo</option>
                <option className="text-slate-900" value="AUTHORITY">Authority demo</option>
                <option className="text-slate-900" value="ADMIN">Admin demo</option>
              </select>
              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs text-cyan-300 hover:underline font-bold"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs text-slate-300 hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Brand({ compact }: { compact: boolean }) {
  return (
    <Link href="/" className="flex h-[90px] items-center gap-3 px-5 hover:opacity-90 transition-opacity">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-[#082235] shadow-lg shadow-cyan-400/10">
        <ShieldCheck className="h-6 w-6" strokeWidth={2.4} />
      </div>
      {!compact && (
        <div>
          <p className="text-sm font-bold tracking-tight text-white">Suraksha Link</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-300">
            Pan-India Safety Portal
          </p>
        </div>
      )}
    </Link>
  );
}

function Navigation({
  items,
  path,
  onNavigate,
}: {
  items: NavItem[];
  path: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1 px-3 py-2">
      {items.map((item) => {
        const active = path === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-white/15 text-white shadow-sm font-bold"
                : item.danger
                  ? "text-rose-300 hover:bg-rose-500/15"
                  : item.highlight
                    ? "text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className={cn("h-[18px] w-[18px]", active ? "text-cyan-300" : item.highlight ? "text-cyan-400" : "")} />
            <span>{item.label}</span>
            {item.highlight && !active && (
              <span className="ml-auto rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                36 States
              </span>
            )}
            {active && <ChevronLeft className="ml-auto h-4 w-4 rotate-180 text-cyan-300" />}
          </Link>
        );
      })}
    </nav>
  );
}

export function SafetyNotice({
  children,
  tone = "cyan",
}: {
  children: React.ReactNode;
  tone?: "cyan" | "amber" | "rose" | "slate";
}) {
  const tones = {
    cyan: "border-cyan-200 dark:border-cyan-900/50 bg-cyan-50/80 dark:bg-cyan-950/30 text-cyan-950 dark:text-cyan-200",
    amber: "border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200",
    rose: "border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200",
    slate: "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200",
  };
  return <div className={cn("rounded-2xl border px-4 py-3 text-sm leading-5", tones[tone])}>{children}</div>;
}

export function EdgeConnectivity() {
  const { online, setOnline, syncQueue, pendingSyncCount } = useSafety();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        onClick={() => setOnline(!online)}
      >
        {online ? <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
        {online ? "Go offline" : "Restore connection"}
      </Button>
      {online && pendingSyncCount > 0 && (
        <Button size="sm" className="bg-[#0b6177] hover:bg-[#084b5c] dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold" onClick={syncQueue}>
          Sync edge queue ({pendingSyncCount})
        </Button>
      )}
    </div>
  );
}
