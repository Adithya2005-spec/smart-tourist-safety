import { useState } from "react";
import { useSafety, type DemoRole } from "@/contexts/SafetyContext";
import { allIndianStates } from "@/lib/india-safety-data";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

export default function SignUp() {
  const { signup, addContact } = useSafety();
  const [, setLocation] = useLocation();

  const [role, setSelectedRole] = useState<DemoRole>("TOURIST");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [stateId, setStateId] = useState("KA");
  const [nationality, setNationality] = useState("Indian");
  const [idType, setIdType] = useState("Aadhaar Card");
  const [idNumber, setIdNumber] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("Family");
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full legal name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your mobile phone number");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the Tourist Safety Guidelines & Charter");
      return;
    }

    // Register user in SafetyContext
    signup({
      fullName,
      email,
      phone,
      role,
      stateId,
      nationality,
      idType,
      idNumber: idNumber || "XXXX-XXXX-9082",
    });

    if (emergencyContactName && emergencyContactPhone) {
      addContact({
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relationship: emergencyContactRelation,
        primary: true,
      });
    }

    const selectedStateObj = allIndianStates.find((s) => s.id === stateId);
    toast.success("Account Created Successfully!", {
      description: `Welcome to Suraksha Link, ${fullName}! Digital ID issued with active protection in ${selectedStateObj?.name || "India"}.`,
    });

    if (role === "TOURIST") {
      setLocation("/tourist");
    } else if (role === "AUTHORITY") {
      setLocation("/authority");
    } else {
      setLocation("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#082235] text-cyan-300 shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">Suraksha Link</p>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan-800 dark:text-cyan-400">
              Pan-India Tourist Safety Portal
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/signin"
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Registration Form */}
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-9 shadow-xl shadow-slate-900/5">
          <div className="text-center max-w-md mx-auto">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Register for Pan-India Safety Portal
            </h1>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Create your verified digital tourist ID, configure instant emergency responders, and get real-time zonal alerts across all 36 Indian States & UTs.
            </p>
          </div>

          {/* Role Choice */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("TOURIST")}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                role === "TOURIST"
                  ? "border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 ring-2 ring-cyan-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50"
              }`}
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Tourist / Traveller</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">SOS, Geofencing & Guardian AI</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("AUTHORITY")}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                role === "AUTHORITY"
                  ? "border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 ring-2 ring-cyan-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50"
              }`}
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                <UsersRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Official Responder</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Command Centre & Dispatch</p>
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="mt-7 space-y-5">
            {/* Personal Details */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mb-3">
                1. Personal & Contact Details
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya.sharma@example.com"
                      className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone Number (+91) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Location & Verification Details */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mb-3">
                2. Travel Location & Identity Verification
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary State / Destination *
                  </label>
                  <div className="relative">
                    <select
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/20"
                    >
                      {allIndianStates.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.region} India)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nationality
                  </label>
                  <Input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Indian / International"
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Government ID Document
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                    <option value="Passport">Passport (International/Indian)</option>
                    <option value="Voter ID">Voter ID (Election Commission)</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ID Reference Number (Masked)
                  </label>
                  <Input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="e.g. XXXX-XXXX-9082"
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact Setup */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mb-3">
                3. Primary Emergency Contact (Notified on SOS)
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Full Name
                  </label>
                  <Input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone (+91)
                  </label>
                  <Input
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="+91 98450 11223"
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Relationship
                  </label>
                  <select
                    value={emergencyContactRelation}
                    onChange={(e) => setEmergencyContactRelation(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="Family / Parent">Family / Parent</option>
                    <option value="Spouse / Partner">Spouse / Partner</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend / Co-traveller">Friend / Co-traveller</option>
                    <option value="Hotel Desk">Hotel / Host Desk</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Terms and Consent */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-xs leading-5 text-slate-600 dark:text-slate-400">
                  I agree to the <strong>National Tourist Safety Guidelines</strong> and consent to local edge-cached geofence evaluation for automatic risk alerts and emergency SOS dispatch.
                </span>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#082235] hover:bg-[#103653] dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-white font-bold text-sm shadow-md"
            >
              Complete Registration & Issue Digital ID
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already registered?{" "}
            <Link href="/signin" className="font-bold text-cyan-700 dark:text-cyan-400 hover:underline">
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-7xl px-5 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
        Suraksha Link · Ministry of Tourism Safety Framework · 28 States & 8 Union Territories
      </footer>
    </div>
  );
}
