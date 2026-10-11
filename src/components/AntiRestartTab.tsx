import React, { useState } from 'react';
import { Snowflake, ShieldAlert, Moon, AlertOctagon, CheckCircle2, Trash2, Plus, Zap, RefreshCw, Radio } from 'lucide-react';
import { useKillApp } from '../context/KillAppContext';

export const AntiRestartTab: React.FC = () => {
  const {
    apps,
    toggleFreezeList,
    antiRestartActive,
    setAntiRestartActive,
    screenOffKillEnabled,
    setScreenOffKillEnabled,
    highRamWatchdogEnabled,
    setHighRamWatchdogEnabled,
    preventedLogs,
    clearPreventedLogs,
    lang,
    frozenAppsCount,
  } = useKillApp();

  const [searchQuery, setSearchQuery] = useState('');

  const freezeListApps = apps.filter((a) => a.inFreezeList);
  const nonFreezeApps = apps.filter(
    (a) =>
      !a.inFreezeList &&
      !a.isWhitelisted &&
      (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.packageName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPreventedSum = apps.reduce((sum, a) => sum + a.preventedRestartsCount, 0);

  return (
    <div className="space-y-6">
      {/* Banner / Explanation */}
      <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
                <Snowflake className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                {lang === 'hi'
                  ? 'Anti-Restart Guard (Duwara On Na Hone Dena)'
                  : 'Anti-Restart Guard (Keep-Alive Blocker)'}
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'Android me apps chupke se AlarmManager, Network change ya push messages se RAM me dobara on ho jate hain. Is list me shamil apps ko Vaibhav Lodhi KillApp background me aate hi turant dubara Force Stop kar deta hai, jisse Battery aur RAM hamesha bachi rehti hai.'
                : 'Apps stealthily wake up using Android BroadcastReceivers, AlarmManager, and Network state changes. KillApp intercepts background wakes and immediately terminates blacklisted apps without ROOT.'}
            </p>
          </div>

          {/* Master Watchdog Switch */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-200 block">
                {lang === 'hi' ? 'Guard Status' : 'Guard Status'}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {antiRestartActive
                  ? lang === 'hi' ? 'Active (Pehredari chalu)' : 'Active (Monitoring)'
                  : lang === 'hi' ? 'Disabled' : 'Disabled'}
              </span>
            </div>
            <button
              onClick={() => setAntiRestartActive(!antiRestartActive)}
              className={`w-13 h-7 rounded-full transition-colors relative p-0.5 ${
                antiRestartActive ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-slate-950 shadow-md transition-transform ${
                  antiRestartActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Triggers Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          {/* Trigger 1: Screen Off */}
          <div
            onClick={() => setScreenOffKillEnabled(!screenOffKillEnabled)}
            className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
              screenOffKillEnabled
                ? 'bg-slate-950/80 border-cyan-500/40 text-slate-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-cyan-400" />
              <div>
                <h4 className="text-xs font-semibold">
                  {lang === 'hi' ? 'Screen-Off Auto-Kill' : 'Screen-Off Auto-Kill'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {lang === 'hi' ? 'Screen lock hote hi sab kill' : 'Kill all when display sleeps'}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-mono font-bold ${
                screenOffKillEnabled ? 'text-cyan-400' : 'text-slate-600'
              }`}
            >
              {screenOffKillEnabled ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Trigger 2: High RAM Threshold */}
          <div
            onClick={() => setHighRamWatchdogEnabled(!highRamWatchdogEnabled)}
            className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
              highRamWatchdogEnabled
                ? 'bg-slate-950/80 border-cyan-500/40 text-slate-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="text-xs font-semibold">
                  {lang === 'hi' ? 'High RAM Watchdog (>80%)' : 'High RAM Watchdog (>80%)'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {lang === 'hi' ? 'RAM bharne par auto-purge' : 'Auto-purge if RAM spikes'}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-mono font-bold ${
                highRamWatchdogEnabled ? 'text-amber-400' : 'text-slate-600'
              }`}
            >
              {highRamWatchdogEnabled ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Trigger 3: Intercept Stats */}
          <div className="p-3 rounded-xl border bg-slate-950/80 border-slate-800 text-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-semibold">
                  {lang === 'hi' ? 'Restarts Rokey Gaye' : 'Restarts Blocked'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {lang === 'hi' ? 'Total stealth wakes blocked' : 'Total stealth wakes stopped'}
                </p>
              </div>
            </div>
            <span className="text-base font-black font-mono text-emerald-400">
              {totalPreventedSum}
            </span>
          </div>
        </div>
      </div>

      {/* Freeze List Apps Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100">
              {lang === 'hi'
                ? `Auto-Freeze List (${freezeListApps.length} Apps)`
                : `Auto-Freeze Blacklist (${freezeListApps.length} Apps)`}
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono">
              [Anti-Wakeup Active]
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            {lang === 'hi'
              ? 'Ye apps background me dobara kabhi open nahi honge'
              : 'Apps in this list are forcefully kept dead'}
          </p>
        </div>

        {/* Currently Frozen Apps */}
        {freezeListApps.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-slate-800">
            <Snowflake className="w-8 h-8 text-cyan-500/50 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">
              {lang === 'hi'
                ? 'Freeze List me abhi koi app nahi hai'
                : 'No apps in Auto-Freeze list'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {lang === 'hi'
                ? 'Neeche diye gaye apps me se Add karein taaki wo dobara on na ho sakein.'
                : 'Add apps below to prevent them from restarting.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {freezeListApps.map((app) => (
              <div
                key={app.id}
                className="bg-slate-950/80 border border-cyan-900/40 hover:border-cyan-700/60 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-xs font-bold shrink-0`}
                    style={{ color: app.iconColor }}
                  >
                    {app.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-100 truncate">
                      {app.name}
                    </h4>
                    <p className="text-[10px] text-cyan-400 font-mono">
                      {app.preventedRestartsCount} {lang === 'hi' ? 'baar wake roka' : 'wakes blocked'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFreezeList(app.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                    title="Remove from Freeze list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add more apps section */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              {lang === 'hi' ? 'Aur Apps Add Karein' : 'Add More Apps to Freeze'}
            </h4>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'Filter...' : 'Filter...'}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 w-36 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {nonFreezeApps.length === 0 ? (
              <p className="text-xs text-slate-500 py-2 text-center">
                {lang === 'hi' ? 'Sabhi apps shamil hain' : 'All available apps added'}
              </p>
            ) : (
              nonFreezeApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-950/40 hover:bg-slate-950 border border-slate-800/60 rounded-lg p-2 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-300 font-medium truncate">{app.name}</span>
                    <span className="text-slate-500 font-mono text-[10px] truncate">
                      ({app.ramUsageMb} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFreezeList(app.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/40 px-2 py-1 rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{lang === 'hi' ? 'Freeze Karein' : 'Freeze'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Real-time Prevented Wake-up Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-100">
              {lang === 'hi'
                ? 'Live Intercept Log (Dobara on hone se roka gaya)'
                : 'Live Intercept Log (Prevented Restarts)'}
            </h3>
          </div>
          {preventedLogs.length > 0 && (
            <button
              onClick={clearPreventedLogs}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {lang === 'hi' ? 'Logs Saaf Karein' : 'Clear Log'}
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto">
          {preventedLogs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">
              {lang === 'hi' ? 'Koi wake-up log nahi hai' : 'No wake-up attempts intercepted yet'}
            </p>
          ) : (
            preventedLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <span className="text-slate-200 font-bold">{log.appName}</span>
                  <span className="text-slate-500">[{log.triggerSource}]</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-emerald-400 font-bold">
                    +{log.freedRamMb} MB Saved
                  </span>
                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
