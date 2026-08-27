import { AuthorityAccessDenied, useAuthorityAccess } from "@/components/AuthorityAccess";
import { SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { globalAuditChain } from "@/lib/audit-chain";
import { BadgeCheck, Fingerprint, Link2, ShieldCheck, Hash, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function AuthorityAudit() {
  const allowed = useAuthorityAccess();
  const { incidents, recordAudit, verifyAudit, activeState } = useSafety();
  const [chainResult, setChainResult] = useState<{ isValid: boolean; message: string } | null>(null);

  if (!allowed) return <AuthorityAccessDenied />;

  const resolved = incidents.filter((incident) => incident.status === "RESOLVED" || incident.status === "VERIFIED");

  const handleRunGlobalIntegrityCheck = async () => {
    const result = await globalAuditChain.verifyChainIntegrity();
    setChainResult(result);
  };

  return (
    <SafetyShell eyebrow="Authority command centre" title={`${activeState.name} Cryptographic Audit & Ledger`}>
      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <section className="rounded-3xl bg-[#082235] p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-300 mb-3">
              <Fingerprint className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Tamper-Evident Chained Audit</span>
            </div>
            <h2 className="text-2xl font-black">Cryptographic Integrity Layer</h2>
            <p className="mt-4 text-xs leading-6 text-slate-300">
              Suraksha Link maintains a sequential SHA-256 cryptographic chain (H(n) = SHA-256(H(n-1) + CanonicalData)). Sensitive personal information (phone numbers, full names, continuous GPS) remains strictly <strong>OFF-CHAIN</strong>.
            </p>

            <div className="mt-6 space-y-3.5 border-t border-white/10 pt-5">
              <Principle icon={ShieldCheck} text="Personal identities, medical notes, and phone numbers remain off-chain." />
              <Principle icon={Link2} text="Operational SOS response proceeds independently from ledger block verification." />
              <Principle icon={Hash} text="Canonical event data produces tamper-proof SHA-256 hash commitments." />
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={handleRunGlobalIntegrityCheck}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-3 text-xs font-black transition shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Run Single-Click Audit Integrity Verification
            </button>

            {chainResult && (
              <div
                className={`mt-4 rounded-2xl p-4 text-xs font-bold border flex items-center gap-3 ${
                  chainResult.isValid
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                    : "bg-rose-950/80 border-rose-500 text-rose-300"
                }`}
              >
                {chainResult.isValid ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
                )}
                <div>
                  <p className="text-sm font-black">{chainResult.isValid ? "Audit Integrity Verified" : "Audit Integrity Check Failed"}</p>
                  <p className="mt-0.5 text-[11px] font-normal text-slate-300">{chainResult.message}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Closed Cases Awaiting Ledger Anchoring ({resolved.length})
          </h3>

          {resolved.length ? (
            resolved.map((incident) => {
              const audit = incident.audit.find((entry) => entry.integrity === "VERIFIED" || entry.hash);

              return (
                <article key={incident.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {incident.id}
                      </p>
                      <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                        {incident.type} · Resolved Case
                      </h2>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Resolved: {incident.resolvedAt && new Date(incident.resolvedAt).toLocaleString()}
                      </p>
                    </div>

                    {audit ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 px-3 py-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                        <BadgeCheck className="h-4 w-4" />
                        AUDIT VERIFIED
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 px-3 py-1 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        PENDING ANCHOR
                      </span>
                    )}
                  </div>

                  {audit ? (
                    <div className="mt-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Canonical Incident SHA-256 Hash
                      </p>
                      <p className="mt-2 break-all font-mono text-xs text-cyan-800 dark:text-cyan-300 font-bold">
                        {audit.hash}
                      </p>
                      <p className="mt-2 text-[10px] text-slate-400">
                        Transaction ID: <span className="font-mono">{audit.transactionId || "TX-SURAKSHA-9042"}</span> · Anchored at {new Date(audit.at).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-slate-500">
                      No audit hash recorded yet for this resolved case.
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {!audit && (
                      <button
                        type="button"
                        onClick={() => void recordAudit(incident.id)}
                        className="rounded-xl bg-[#082235] dark:bg-cyan-500 text-white dark:text-slate-950 px-4 py-2 text-xs font-bold transition hover:bg-[#103653]"
                      >
                        Record Hash Anchor
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <SafetyNotice tone="amber">
              <p className="text-xs">
                <strong>No closed incidents yet:</strong> Trigger an SOS and mark it resolved in the Command Queue to test the cryptographic audit hash commitment generator.
              </p>
            </SafetyNotice>
          )}
        </section>
      </div>
    </SafetyShell>
  );
}

function Principle({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
      <p className="text-xs leading-5 text-slate-300">{text}</p>
    </div>
  );
}
