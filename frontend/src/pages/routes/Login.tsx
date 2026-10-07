import { Eye, Mail, Lock, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5f6f8] font-sans text-slate-900 lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-slate-800 lg:block">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80"
          alt="Contemporary building facade"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-blue/55" />
        <div className="relative flex min-h-screen flex-col justify-between p-8 xl:p-10">
          <div className="flex items-center gap-3 text-xl font-bold tracking-tight text-white">
            <span className="h-7 w-7 rounded-full bg-cyan-50" />
            The Cold Place
          </div>
          <div className="max-w-xl pb-14">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Precision Cold Storage Management.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/80">
              Enterprise-grade administrative utility for monitoring inventory,
              logistics, and environmental stability across your entire network.
            </p>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
            System version 2.4.0-beta
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-5 flex items-center justify-center gap-2 text-lg font-bold text-[#0d4b4d] lg:hidden">
              <span className="h-6 w-6 rounded-full bg-teal-blue" /> The Cold
              Place
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to continue
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div
                className="flex h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 shadow-sm 
              focus-within:border-teal-blue focus-within:ring-2 focus-within:ring-teal-blue/15"
              >
                <Mail size={18} className="text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@thecoldplace.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div
                className="flex h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 shadow-sm 
              focus-within:border-teal-blue focus-within:ring-2 focus-within:ring-teal-blue/15"
              >
                <Lock size={18} className="text-slate-400" />
                <input
                  id="password"
                  type={isVisible ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  aria-label="Show password"
                  className="text-slate-400 hover:text-slate-700"
                >
                  {!isVisible ? (
                    <Eye
                      size={18}
                      className="text-slate-400"
                      onClick={() => setIsVisible(true)}
                    />
                  ) : (
                    <EyeOff
                      size={18}
                      className="text-slate-400"
                      onClick={() => setIsVisible(false)}
                    />
                  )}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-darker-teal-blue"
              />
              Remember this device for 30 days
            </label>
            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-blue text-sm font-semibold 
              text-white shadow-sm transition hover:bg-darker-teal-blue focus:outline-none focus:ring-2 focus:ring-teal-blue
              focus:ring-offset-2"
            >
              <span>Sign in</span> <ArrowRight size={18} />
            </button>
          </form>
        </div>
        <p className="mt-auto pt-12 text-center text-[10px] font-medium uppercase tracking-wide text-slate-400">
          Secure administrative portal © 2024 The Cold Place Management
        </p>
      </section>
    </main>
  );
}
