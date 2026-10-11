import React from 'react';
import { X, Zap, Snowflake, Shield, Wifi, WifiOff, Smartphone, Activity, Server, Radio, Play } from 'lucide-react';
import { useKillApp } from '../context/KillAppContext';

export const AppDetailModal: React.FC = () => {
  const {
    selectedAppForDetail,
    setSelectedAppForDetail,
    forceStopSingleApp,
    toggleFreezeList,
    toggleWhitelist,
    toggleAppInternet,
    relaunchApp,
    lang,
    firewallActive,
  } = useKillApp();

  if (!selectedAppForDetail) return null;
  const app = selectedAppForDetail;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-lg font-bold shadow-md shrink-0`}
              style={{ color: app.iconColor }}
            >
              {app.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">{app.name}</h3>
              <p className="text-xs font-mono text-slate-400">{app.packageName}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedAppForDetail(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Status Bar */}
          <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  app.status === 'running'
                    ? 'bg-rose-400 animate-pulse'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="font-medium text-slate-200">
                {app.status === 'running'
                  ? lang === 'hi' ? 'RAM me chal raha hai' : 'Running in RAM'
                  : lang === 'hi' ? 'Force Stopped (Band hai)' : 'Force-Stopped (Suspended)'}
              </span>
            </div>
            {app.status === 'force_stopped' ? (
              <button
                onClick={() => relaunchApp(app.id)}
                className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Play className="w-3 h-3 text-emerald-400" />
                {lang === 'hi' ? 'Simulate Re-open' : 'Simulate Re-open'}
              </button>
            ) : (
              <button
                onClick={() => forceStopSingleApp(app.id)}
                className="flex items-center gap-1 text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 px-2.5 py-1 rounded-lg transition-colors font-medium"
              >
                <Zap className="w-3 h-3" />
                {lang === 'hi' ? 'Force Stop Abhi' : 'Force Stop Now'}
              </button>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block">RAM PSS</span>
              <span className="text-base font-bold text-amber-400 font-mono">
                {app.ramUsageMb} MB
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                +{app.cachedRamMb} MB cache
              </span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block">CPU Usage</span>
              <span className="text-base font-bold text-cyan-400 font-mono">
                {app.cpuPercent}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Background load
              </span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block">Battery Drain</span>
              <span className="text-base font-bold text-rose-400 font-mono">
                {app.batteryDrainPerHour}%/h
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {app.wakeLockCount} Wakelocks
              </span>
            </div>
          </div>

          {/* Anti-Restart Guard & Whitelist Controls */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
              {lang === 'hi' ? 'Background Behavior Settings' : 'Background Behavior Settings'}
            </span>

            {/* Anti-Restart Guard Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <Snowflake
                  className={`w-4 h-4 ${
                    app.inFreezeList ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {lang === 'hi'
                      ? 'Anti-Restart Freeze List (Duwara On Na Hone Dena)'
                      : 'Anti-Restart Freeze List'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'hi'
                      ? 'Agar ye app background me dobara start hota hai, to KillApp ise turant wapas kill kar dega.'
                      : 'Automatically re-kills this app if it tries to wake up in background.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleFreezeList(app.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  app.inFreezeList
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {app.inFreezeList
                  ? lang === 'hi' ? 'Active ✓' : 'Active ✓'
                  : lang === 'hi' ? 'Add Karein' : 'Add'}
              </button>
            </div>

            {/* Whitelist Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <Shield
                  className={`w-4 h-4 ${
                    app.isWhitelisted ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {lang === 'hi' ? 'Whitelist (Surakshit Rakhein)' : 'Whitelist Protection'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'hi'
                      ? 'Kill All dabane par bhi ye app band nahi hoga (WhatsApp ya Phone ke liye)'
                      : 'Never killed during batch cleanup operations.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleWhitelist(app.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  app.isWhitelisted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {app.isWhitelisted
                  ? lang === 'hi' ? 'Protected ✓' : 'Protected ✓'
                  : lang === 'hi' ? 'Protect' : 'Protect'}
              </button>
            </div>
          </div>

          {/* Internet Firewall Toggles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                {lang === 'hi'
                  ? 'Internet Connection Blocker (Bina Root)'
                  : 'No-Root Internet Blocker'}
              </span>
              {!firewallActive && (
                <span className="text-[10px] text-amber-400 font-mono">
                  {lang === 'hi' ? '(VPN Inactive)' : '(VPN Inactive)'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* WiFi Block */}
              <button
                onClick={() => toggleAppInternet(app.id, 'wifi')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  app.internetBlocked.wifi
                    ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {app.internetBlocked.wifi ? (
                  <WifiOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-medium">WiFi</span>
                <span className="text-[10px] font-mono">
                  {app.internetBlocked.wifi
                    ? lang === 'hi' ? 'Blocked' : 'Blocked'
                    : lang === 'hi' ? 'Allowed' : 'Allowed'}
                </span>
              </button>

              {/* Mobile Data Block */}
              <button
                onClick={() => toggleAppInternet(app.id, 'mobile')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  app.internetBlocked.mobile
                    ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {app.internetBlocked.mobile ? (
                  <Radio className="w-4 h-4 text-rose-400" />
                ) : (
                  <Radio className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-medium">Mobile Data</span>
                <span className="text-[10px] font-mono">
                  {app.internetBlocked.mobile
                    ? lang === 'hi' ? 'Blocked' : 'Blocked'
                    : lang === 'hi' ? 'Allowed' : 'Allowed'}
                </span>
              </button>

              {/* Background Data Block */}
              <button
                onClick={() => toggleAppInternet(app.id, 'background')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                  app.internetBlocked.background
                    ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Server className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-medium">Background</span>
                <span className="text-[10px] font-mono">
                  {app.internetBlocked.background
                    ? lang === 'hi' ? 'Blocked' : 'Blocked'
                    : lang === 'hi' ? 'Allowed' : 'Allowed'}
                </span>
              </button>
            </div>
          </div>

          {/* Active Background Services */}
          <div>
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              {lang === 'hi' ? 'Running Android Services (Processes)' : 'Running Android Services'}
            </span>
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
              {app.backgroundServices.map((srv, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-400 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span className="truncate">{srv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setSelectedAppForDetail(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
          >
            {lang === 'hi' ? 'Band karein (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
