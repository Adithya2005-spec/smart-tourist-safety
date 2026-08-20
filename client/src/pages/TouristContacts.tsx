import { SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { ContactRound, Globe2, Phone, Plus, Shield, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function TouristContacts() {
  const { contacts, addContact, deleteContact, activeState } = useSafety();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const add = () => {
    if (!name.trim() || !phone.trim()) return;
    addContact({
      name,
      phone,
      relationship: relationship || "Personal Emergency Contact",
      primary: contacts.length === 0,
    });
    setName("");
    setPhone("");
    setRelationship("");
    setOpen(false);
  };

  return (
    <SafetyShell eyebrow="Traveller workspace" title="Emergency contacts">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header & Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              Emergency Contacts & Helplines
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active for <strong>{activeState.name}</strong> and your personal profile. Stored offline in your local safety layer.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#082235] dark:bg-cyan-500 hover:bg-[#103653] dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-2.5 text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Personal Contact
          </button>
        </div>

        {/* Add Contact Form */}
        {open && (
          <div className="grid gap-3 rounded-2xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/70 dark:bg-cyan-950/30 p-5 sm:grid-cols-3 animate-in fade-in duration-200">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contact Name (e.g. Maya)"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-600/20"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone Number (+91 ...)"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-600/20"
            />
            <input
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
              placeholder="Relationship (e.g. Sister, Hotel)"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-600/20"
            />
            <div className="sm:col-span-3 flex justify-end gap-2 mt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={add}
                className="rounded-xl bg-cyan-700 hover:bg-cyan-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-1.5 text-xs font-bold"
              >
                Save Contact
              </button>
            </div>
          </div>
        )}

        {/* Contacts List */}
        <div className="space-y-3">
          {contacts.map((contact) => {
            const isOfficial = contact.id.startsWith("STATE-");
            return (
              <div
                key={contact.id}
                className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 sm:p-5 shadow-sm transition-all ${
                  isOfficial
                    ? "border-cyan-200 dark:border-cyan-800/60 bg-cyan-50/40 dark:bg-cyan-950/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }`}
              >
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl ${
                    isOfficial
                      ? "bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {isOfficial ? <Shield className="h-5 w-5" /> : <ContactRound className="h-5 w-5" />}
                </div>

                <div className="min-w-[180px] flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</p>
                    {contact.primary && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        PRIMARY
                      </span>
                    )}
                    {isOfficial && (
                      <span className="rounded-full bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-700 px-2 py-0.5 text-[10px] font-bold text-cyan-800 dark:text-cyan-300">
                        OFFICIAL HELPLINE
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{contact.relationship}</p>
                </div>

                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-cyan-800 dark:text-cyan-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  {contact.phone}
                </a>

                {!isOfficial && (
                  <button
                    type="button"
                    onClick={() => deleteContact(contact.id)}
                    className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 transition"
                    aria-label={`Remove ${contact.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Pan-India Switcher Banner */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Travelling to another state?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Switch state in the Pan-India Directory to automatically download the official tourist police number and disaster unit for any state.
            </p>
          </div>
          <Link
            href="/pan-india"
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-950/50 px-3.5 py-2 text-xs font-bold text-cyan-900 dark:text-cyan-300 hover:bg-cyan-100"
          >
            <Globe2 className="h-4 w-4" />
            Pan-India Directory (36 States)
          </Link>
        </div>

        <SafetyNotice tone="slate">
          <p className="text-xs">
            <strong>Emergency numbers:</strong> 112 connects to Central Emergency Dispatch across all 28 states and 8 UTs of India. State tourist police lines are dedicated assistance desks.
          </p>
        </SafetyNotice>
      </div>
    </SafetyShell>
  );
}
