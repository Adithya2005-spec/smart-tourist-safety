import { SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export function useAuthorityAccess() {
  return useSafety().role !== "TOURIST";
}

export function useAdminAccess() {
  return useSafety().role === "ADMIN";
}

export function AuthorityAccessDenied() {
  const { setRole } = useSafety();
  return (
    <SafetyShell eyebrow="Protected workspace" title="Authority access required">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm text-slate-900 dark:text-slate-100">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
          Command-Centre Access is Restricted
        </h2>
        <p className="mt-3 text-xs leading-6 text-slate-600 dark:text-slate-300">
          This portal isolates traveller permissions from official police and responder operations. Select an authorized demo role or sign in as an authority responder.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRole("AUTHORITY")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#082235] dark:bg-cyan-500 hover:bg-[#103653] dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md transition"
          >
            <ShieldCheck className="h-4 w-4" />
            Switch to Authority Role
          </button>
          <Link
            href="/tourist"
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            Return to Tourist View
          </Link>
        </div>
      </div>
    </SafetyShell>
  );
}

export function AdminAccessDenied() {
  const { setRole } = useSafety();
  return (
    <SafetyShell eyebrow="Protected workspace" title="Administrator access required">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm text-slate-900 dark:text-slate-100">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
          Administrative Oversight is Restricted
        </h2>
        <p className="mt-3 text-xs leading-6 text-slate-600 dark:text-slate-300">
          This workspace houses national-level governance controls not available to ordinary travellers or field responders.
        </p>
        <button
          type="button"
          onClick={() => setRole("ADMIN")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#082235] dark:bg-cyan-500 hover:bg-[#103653] dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md transition"
        >
          <ShieldCheck className="h-4 w-4" />
          Switch to Administrator Role
        </button>
      </div>
    </SafetyShell>
  );
}
