import React from "react";
import { Link } from "react-router-dom";
import Buttons from "../utils/Buttons";
import { motion } from "framer-motion";
import Brands from "./LandingPageCom/Brands/Brands";
import State from "./LandingPageCom/State";
import Testimonial from "./LandingPageCom/Testimonial/Testimonial";
import { useMyContext } from "../store/ContextApi";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const LandingPage = () => {
  const { token } = useMyContext();

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        {/* hero background glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.16),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.14),transparent_38%)]" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-14 lg:pt-24 lg:pb-20">
          {/* top nav spacer if needed */}
          <div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
              Secure • Fast • Synced
            </span>
            <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Turn your thoughts into secure, organized notes And Faster.
            </h1>
            <p className="text-slate-200/80 text-lg leading-relaxed">
              Manage your notes effortlessly and securely. Just type, save, and
              access them from anywhere with robust encryption and seamless
              synchronization.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {token ? (
                <>
                  <Link to="/create-note">
                    <Buttons className="sm:w-48 w-40 bg-white text-slate-900 font-semibold hover:scale-[1.02] transition-all duration-200 px-8 py-3 rounded-full shadow-lg shadow-blue-900/40">
                      Create Note
                    </Buttons>
                  </Link>
                  <Link to="/notes">
                    <Buttons className="sm:w-48 w-40 bg-slate-800 text-slate-100 font-semibold hover:scale-[1.02] transition-all duration-200 px-8 py-3 rounded-full ring-1 ring-white/15">
                      My Notes
                    </Buttons>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Buttons className="sm:w-48 w-40 bg-white text-slate-900 font-semibold hover:scale-[1.02] transition-all duration-200 px-8 py-3 rounded-full shadow-lg shadow-blue-900/40">
                      SignIn
                    </Buttons>
                  </Link>
                  <Link to="/signup">
                    <Buttons className="sm:w-48 w-40 bg-slate-800 text-slate-100 font-semibold hover:scale-[1.02] transition-all duration-200 px-8 py-3 rounded-full ring-1 ring-white/15">
                      SignUp
                    </Buttons>
                  </Link>
                </>
              )}
              <span className="text-sm text-slate-200/70 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Syncs across all devices
              </span>
            </div>
          </div>

          {/* hero mock panel */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            className="mt-12 lg:mt-16"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-black/50 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 text-sm text-slate-200/80">
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 rounded-full bg-blue-500/20 text-blue-200 flex items-center justify-center font-semibold">
                    SN
                  </span>
                  <div>
                    <p className="font-semibold text-slate-50">
                      Noteworthy Workspace
                    </p>
                    <p className="text-xs text-slate-300/80">
                      Encrypted session active
                    </p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-200">
                  Synced
                </span>
              </div>

              <div className="grid lg:grid-cols-2 gap-4 p-6">
                <div className="space-y-3">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-slate-100">
                    <p className="text-sm font-semibold">Multi Factor Authentication</p>
                    <p className="text-sm text-slate-200/80 mt-2">
                      “Secure your notes with multiple factors of authentication to ensure your notes are protected.”
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {["Zero-stress security", "Lock account", "Audit logs", "Last login sessions"].map(
                      (item) => (
                        <div
                          key={item}
                          className="rounded-xl bg-white/5 border border-white/10 p-4 text-slate-100 text-sm"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Active teams", value: "12k+" },
                    { label: "Average uptime", value: "99.9%" },
                    { label: "Faster retrieval", value: "2.5x" },
                    { label: "Sync status", value: "Real-time" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-white/5 border border-white/10 p-4 text-slate-100"
                    >
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-300/80">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Secondary sections on dark base with soft card */}
      <div className="bg-slate-950 text-slate-200/80 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 space-y-12">
          <div className="text-center space-y-3">
            <h1 className="font-montserrat uppercase text-3xl sm:text-4xl text-slate-300 font-bold">
              More Reasons Company Around the world workable
            </h1>
          </div>
          <Brands />

          <div className="pt-4">
            <State />
          </div>

          <div className="pt-6 pb-4">
            <h1
              className="font-montserrat uppercase text-3xl sm:text-4xl font-bold text-slate-300 text-center pb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              Testimonial
            </h1>
            <Testimonial />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;