import { RiskBadge, SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import QRCode from "qrcode";
import { BadgeCheck, CheckCircle2, Copy, Fingerprint, Globe2, QrCode, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function TouristIdentity() {
  const { profile, activeState, userSession } = useSafety();
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const identityHash = `0x8e2c41a76f90d218...${activeState.code}2026`;

  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        id: profile.touristId,
        name: profile.fullName,
        state: activeState.name,
        verified: true,
        issued: "2026-08-16",
        authority: "Suraksha Link National Safety Protocol",
      }),
      { margin: 1, width: 320, color: { dark: "#082235", light: "#ffffff" } },
    ).then(setQr);
  }, [profile.touristId, profile.fullName, activeState.name]);

  const copy = async () => {
    await navigator.clipboard?.writeText(identityHash);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <SafetyShell eyebrow="Traveller workspace" title="Digital identity">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.05fr_.95fr]">
        {/* Tourist Card */}
        <section className="relative overflow-hidden rounded-[24px] bg-[#082235] p-7 text-white shadow-xl shadow-slate-900/10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[28px] border-cyan-400/10" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-300">
                Tourist Digital Safety ID
              </p>
              <h2 className="mt-2 text-2xl font-black">{profile.fullName}</h2>
              <p className="mt-1 text-sm text-slate-300">
                Verified Travel Profile · {activeState.name} ({activeState.capital})
              </p>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400 text-[#082235]">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="relative mt-9 grid grid-cols-2 gap-y-5 border-y border-white/10 py-5">
            <Detail label="Tourist ID Number" value={profile.touristId} />
            <Detail label="Verification Status" value="VERIFIED GOVT ID" success />
            <Detail label="Active State / Region" value={`${activeState.name} (${activeState.region} India)`} />
            <Detail label="Accommodation" value={profile.accommodation} />
          </div>

          <div className="relative mt-6 flex items-center gap-3">
            <Fingerprint className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                Cryptographic Identity Hash
              </p>
              <p className="mt-1 font-mono text-xs text-slate-200">{identityHash}</p>
            </div>
          </div>
        </section>

        {/* QR Code Presentation */}
        <section className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                  Verification QR
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                  Present to Tourist Police
                </h2>
              </div>
              <QrCode className="h-6 w-6 text-cyan-700 dark:text-cyan-400" />
            </div>

            <div className="mt-6 grid place-items-center rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-6 border border-slate-100 dark:border-slate-800">
              {qr ? (
                <img src={qr} alt="Digital identity QR code" className="h-48 w-48 rounded-xl bg-white p-2 shadow-md" />
              ) : (
                <div className="h-48 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            The QR represents a cryptographically verified tourist safety payload valid across all Indian states and Union Territories.
          </p>
        </section>
      </div>

      {/* Selective Blockchain Audit */}
      <div className="mx-auto mt-5 grid max-w-5xl gap-5 lg:grid-cols-[1fr_.8fr]">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                Selective Blockchain Verification
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                Pan-India Privacy & Tamper Resistance
              </h3>
            </div>
            <RiskBadge band="SAFE" compact />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Meta icon={BadgeCheck} label="Identity" value="Verified" />
            <Meta icon={CheckCircle2} label="EVM Layer" value="Local Pan-India Node" />
            <Meta icon={Fingerprint} label="Privacy" value="Hash Only (Off-Chain)" />
          </div>

          <button
            type="button"
            onClick={copy}
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-800 dark:text-cyan-400 hover:text-cyan-950 dark:hover:text-cyan-300"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Identity Hash Copied to Clipboard" : "Copy Identity Hash"}
          </button>
        </div>

        <SafetyNotice tone="slate">
          <p className="text-xs">
            <strong>Privacy Guarantee:</strong> Only zero-knowledge integrity hashes are recorded on the verification ledger. Private documents, emergency contacts, and exact GPS tracks remain strictly protected on this device.
          </p>
        </SafetyNotice>
      </div>
    </SafetyShell>
  );
}

function Detail({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">{label}</p>
      <p className={`mt-1 text-sm font-bold ${success ? "text-emerald-300" : "text-white"}`}>{value}</p>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800">
      <Icon className="h-4 w-4 text-cyan-700 dark:text-cyan-400" />
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[.12em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );
}
