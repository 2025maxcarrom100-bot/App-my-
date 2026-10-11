import React from 'react';
import { ShieldCheck, Cpu, BatteryCharging, Globe, Smartphone, Bell, Sliders } from 'lucide-react';
import { useKillApp } from '../context/KillAppContext';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    deviceStats,
    permissions,
    showFloatingWidget,
    setShowFloatingWidget,
    setDeviceRamSpec,
  } = useKillApp();

  const allPermsOk =
    permissions.accessibilityService &&
    permissions.vpnService &&
    permissions.usageAccess;

  return (
    <header className="border-b border-emerald-950/60 bg-slate-950/90 backdrop-blur px-4 py-3 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl border border-emerald-400/30">
            <span>⚡</span>
            {allPermsOk && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
                <span>Vaibhav Lodhi KillApp</span>
              </h1>
              <span className="text-[10px] tracking-wide text-emerald-400 font-mono font-medium border border-emerald-500/30 px-1.5 py-0.5 rounded">
                NO-ROOT V2.6
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {lang === 'hi'
                ? 'RAM Force Stopper · Anti-Restart Guard · Per-App Firewall'
                : 'RAM Force Stopper · Anti-Restart Guard · Per-App Firewall'}
            </p>
          </div>
        </div>

        {/* Top Status & Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Hardware Spec Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs text-slate-400">
            <span className="px-1 text-[11px] text-slate-400 font-mono">RAM:</span>
            {[6, 8, 12, 16].map((ram) => (
              <button
                key={ram}
                onClick={() => setDeviceRamSpec(ram)}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${
                  deviceStats.totalRamGb === ram
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ram}GB
              </button>
            ))}
          </div>

          {/* Floating Widget Toggle */}
          <button
            onClick={() => setShowFloatingWidget(!showFloatingWidget)}
            title={lang === 'hi' ? 'Floating Kill Bubble Toggle' : 'Toggle Floating Bubble'}
            className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
              showFloatingWidget
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline font-mono text-[11px]">Widget</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 text-xs rounded transition-all font-medium ${
                lang === 'hi'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिन्दी / Hinglish
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs rounded transition-all font-medium ${
                lang === 'en'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
