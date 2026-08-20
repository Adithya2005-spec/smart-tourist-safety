import { useState } from "react";
import { useSafety, type DemoRole } from "@/contexts/SafetyContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  BotMessageSquare,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Siren,
  Sparkles,
  User,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

export default function SignIn() {
  const { login, setRole } = useSafety();
  const [, setLocation] = useLocation();

  const [selectedRole, setSelectedRole] = useState<DemoRole>("TOURIST");
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("aarav.mehta@tourist-safety.in");
  const [password, setPassword] = useState("••••••••");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error("Please enter your email or mobile number");
      return;
    }

    if (authMode === "otp" && !otpSent) {
      setOtpSent(true);
      setOtpCode("5892");
      toast.info("OTP Sent!", { description: "Simulated 4-digit verification code: 5892" });
      return;
    }

    // Authenticate
    login(identifier, selectedRole);
    toast.success("Welcome back to Suraksha Link!", {
      description: `Signed in as ${selectedRole === "TOURIST" ? "Tourist" : selectedRole === "AUTHORITY" ? "Authority Responder" : "System Administrator"}.`,
    });

    if (selectedRole === "TOURIST") {
      setLocation("/tourist");
    } else if (selectedRole === "AUTHORITY") {
      setLocation("/authority");
    } else {
      setLocation("/admin");
    }
  };

  const handleQuickLogin = (role: DemoRole, email: string, name: string) => {
    setRole(role);
    login(email, role, name);
    toast.success(`Logged in as ${name} (${role})!`);
    setLocation(role === "TOURIST" ? "/tourist" : role === "AUTHORITY" ? "/authority" : "/admin");
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#082235] text-cyan-300 shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">Suraksha Link</p>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan-800 dark:text-cyan-400">
              National Tourist Safety Portal
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/signup"
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="mx-auto w-full max-w-md px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl shadow-slate-900/5">
          <div className="text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 mb-3">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              Sign In to Your Account
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Access real-time safety feeds, verified digital identity, and SOS coordination.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="mt-6 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSelectedRole("TOURIST");
                setIdentifier("aarav.mehta@tourist-safety.in");
              }}
              className={`rounded-lg py-2 transition-all ${
                selectedRole === "TOURIST"
                  ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Tourist
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole("AUTHORITY");
                setIdentifier("unit04.patrol@police.gov.in");
              }}
              className={`rounded-lg py-2 transition-all ${
                selectedRole === "AUTHORITY"
                  ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Authority
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole("ADMIN");
                setIdentifier("admin.central@suraksha.gov.in");
              }}
              className={`rounded-lg py-2 transition-all ${
                selectedRole === "ADMIN"
                  ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Auth Method Switch */}
          <div className="mt-4 flex justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className={`pb-1 transition-all ${
                authMode === "password"
                  ? "border-b-2 border-cyan-600 dark:border-cyan-400 text-cyan-800 dark:text-cyan-300 font-bold"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("otp")}
              className={`pb-1 transition-all ${
                authMode === "otp"
                  ? "border-b-2 border-cyan-600 dark:border-cyan-400 text-cyan-800 dark:text-cyan-300 font-bold"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Instant OTP Login
            </button>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or +91 98765 43210"
                  className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                />
              </div>
            </div>

            {authMode === "password" ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info("Password Reset", { description: "Use one-click demo login or instant OTP for quick testing." })}
                    className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Verification Code (OTP)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder={otpSent ? "Enter 4-digit code (5892)" : "Click Send OTP"}
                    disabled={!otpSent}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                  />
                  {!otpSent ? (
                    <Button
                      type="button"
                      onClick={() => {
                        setOtpSent(true);
                        setOtpCode("5892");
                        toast.success("OTP Sent: 5892 (Demo)");
                      }}
                      className="shrink-0 h-11 rounded-xl bg-[#082235] hover:bg-[#103653] dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-white font-bold text-xs"
                    >
                      Send OTP
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => toast.info("OTP Resent: 5892")}
                      className="shrink-0 h-11 rounded-xl text-xs"
                    >
                      Resend
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Remember this session</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#082235] hover:bg-[#103653] dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-white font-bold text-sm shadow-md"
            >
              Sign In to {selectedRole === "TOURIST" ? "Tourist Portal" : selectedRole === "AUTHORITY" ? "Command Centre" : "Admin Console"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* 1-Click Quick Demo Login Section */}
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 text-center mb-3">
              One-Click Prototype Quick Login
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("TOURIST", "aarav.mehta@tourist-safety.in", "Aarav Mehta")}
                className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Aarav Mehta</p>
                    <p className="text-[10px] text-slate-500">Verified Tourist · Karnataka/Pan-India</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400">Instant Access →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("AUTHORITY", "unit04.patrol@police.gov.in", "Unit 04 · Central Patrol")}
                className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    <UsersRound className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Command Centre Responder</p>
                    <p className="text-[10px] text-slate-500">Official Police Dispatch & Incident Queue</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400">Instant Access →</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-cyan-700 dark:text-cyan-400 hover:underline">
              Create a Tourist Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-7xl px-5 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
        Suraksha Link · Smart Pan-India Tourist Safety Protocol · Edge-Cloud Architecture
      </footer>
    </div>
  );
}
