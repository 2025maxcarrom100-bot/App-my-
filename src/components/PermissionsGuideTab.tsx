import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Key, Terminal, Check, Copy, AlertTriangle, Layers, ExternalLink } from 'lucide-react';
import { useKillApp } from '../context/KillAppContext';

export const PermissionsGuideTab: React.FC = () => {
  const { permissions, togglePermission, lang } = useKillApp();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const adbCommands = [
    {
      title: 'Grant Usage Stats via ADB (Optional)',
      cmd: 'adb shell pm grant com.vaibhavlodhi.killapp android.permission.PACKAGE_USAGE_STATS',
    },
    {
      title: 'Whitelist KillApp from Doze Mode (Anti-Kill)',
      cmd: 'adb shell dumpsys deviceidle whitelist +com.vaibhavlodhi.killapp',
    },
    {
      title: 'Deep Hibernate Freeze command (Zero background wake)',
      cmd: 'adb shell cmd appops set com.facebook.katana RUN_IN_BACKGROUND ignore',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 font-bold text-lg">
            ✓
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              {lang === 'hi'
                ? 'Bina Root Ke Kaam Karne Ki Pura Engine Guide'
                : '100% No-Root Architecture Guide'}
            </h2>
            <p className="text-xs text-emerald-400 font-mono">
              Zero Root Required · 100% Android Native APIs
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'hi'
            ? 'Aapke phone ko root karne ki koi zaroorat nahi hai. Android me do aisi powerful suvidhayein hoti hain jinse hum RAM kill aur Internet block bina root ke kar sakte hain: 1) Accessibility Service (jo automatically Force Stop button click karta hai) aur 2) Local VpnService (jo internet packets ko phone ke andar hi drop kar deta hai).'
            : 'No rooting is required. Android includes two high-privilege native frameworks designed for system utilities: 1) Accessibility Service (which programmatically automates Force Stop actions), and 2) Local VpnService (which filters and drops network packets locally on-device).'}
        </p>
      </div>

      {/* Permissions Checklist */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-slate-100">
          {lang === 'hi' ? 'Zaroori Android Permissions' : 'Required Android Permissions'}
        </h3>

        <div className="space-y-3">
          {/* Permission 1: Accessibility */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">
                  1. Accessibility Service (Zabardasti Roko / Force Stop)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono border border-emerald-500/30 px-1 rounded">
                  Required
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'Bina root ke Apps ko Force Stop karne ke liye zaroori hai. Ye system settings me jakar "Force Stop" aur "OK" button ko automate karta hai.'
                  : 'Automates user clicks on "Force Stop" and confirmation dialogs in Application Settings without requiring SU binary.'}
              </p>
            </div>
            <button
              onClick={() => togglePermission('accessibilityService')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                permissions.accessibilityService
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {permissions.accessibilityService ? 'Granted (Saksham) ✓' : 'Disabled (Enable Karein)'}
            </button>
          </div>

          {/* Permission 2: VPN Service */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">
                  2. Local VPN Service (Internet Blocker)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono border border-emerald-500/30 px-1 rounded">
                  Required
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'Bina root ke specific apps ka WiFi/Mobile data block karne ke liye. Ye phone ke andar ek local loopback socket banata hai.'
                  : 'Creates an offline loopback tunnel to drop internet packets from blocked apps locally with zero remote server hops.'}
              </p>
            </div>
            <button
              onClick={() => togglePermission('vpnService')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                permissions.vpnService
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {permissions.vpnService ? 'Granted (Saksham) ✓' : 'Disabled (Enable Karein)'}
            </button>
          </div>

          {/* Permission 3: Usage Access */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">
                  3. Usage Access (PACKAGE_USAGE_STATS)
                </span>
                <span className="text-[10px] text-cyan-400 font-mono border border-cyan-500/30 px-1 rounded">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'RAM me kaun kaun se apps abhi chal rahe hain unki accurate list aur memory size janne ke liye.'
                  : 'Allows reading precise active process memory and recent foreground stats.'}
              </p>
            </div>
            <button
              onClick={() => togglePermission('usageAccess')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                permissions.usageAccess
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {permissions.usageAccess ? 'Granted (Saksham) ✓' : 'Disabled (Enable Karein)'}
            </button>
          </div>

          {/* Permission 4: Ignore Battery Optimization */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">
                  4. Ignore Battery Optimization (Anti-Kill for KillApp)
                </span>
                <span className="text-[10px] text-amber-400 font-mono border border-amber-500/30 px-1 rounded">
                  Important
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'Android ko "Vaibhav Lodhi KillApp" ko background se hatane se roko, taaki ye lagatar freeze list ko guard kar sake.'
                  : 'Prevents the Android OS OEM battery management from terminating KillApp background watchdog.'}
              </p>
            </div>
            <button
              onClick={() => togglePermission('batteryOptimizationIgnored')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                permissions.batteryOptimizationIgnored
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {permissions.batteryOptimizationIgnored ? 'Ignored (Safe) ✓' : 'Optimize Off'}
            </button>
          </div>
        </div>
      </div>

      {/* Optional ADB Power User Commands */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">
            {lang === 'hi'
              ? 'Power Users ke liye Optional ADB Commands (Computer ke jariye)'
              : 'Optional ADB Power-User Boost Commands'}
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          {lang === 'hi'
            ? 'Agar aapke paas PC hai, to aap ek baar ye command chala kar deep freeze unlock kar sakte hain bina root ke:'
            : 'Optional 1-time USB debugging commands to grant direct background app management privileges:'}
        </p>

        <div className="space-y-3">
          {adbCommands.map((item, idx) => (
            <div key={idx} className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">{item.title}</span>
              <div className="flex items-center justify-between gap-2 bg-slate-900/90 p-2 rounded-lg font-mono text-[11px] text-amber-300 overflow-x-auto">
                <code className="truncate">{item.cmd}</code>
                <button
                  onClick={() => copyToClipboard(item.cmd)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs shrink-0 flex items-center gap-1 transition-colors"
                >
                  {copiedCmd === item.cmd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
