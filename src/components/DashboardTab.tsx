import React, { useState } from 'react';
import { Search, Zap, CheckCircle2, Shield, Snowflake, Filter, WifiOff, Play, Info, ArrowUpDown } from 'lucide-react';
import { useKillApp } from '../context/KillAppContext';
import { RamGauge } from './RamGauge';
import { AndroidApp } from '../types';

export const DashboardTab: React.FC = () => {
  const {
    apps,
    forceStopSingleApp,
    relaunchApp,
    toggleFreezeList,
    toggleWhitelist,
    setSelectedAppForDetail,
    lang,
    runningAppsCount,
  } = useKillApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'running' | 'stopped' | 'heavy'>('running');
  const [sortBy, setSortBy] = useState<'ram' | 'battery' | 'name'>('ram');

  // Filter and sort apps
  const filteredApps = apps
    .filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterType === 'running') return app.status === 'running';
      if (filterType === 'stopped') return app.status === 'force_stopped';
      if (filterType === 'heavy') return app.ramUsageMb > 500;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'ram') return b.ramUsageMb - a.ramUsageMb;
      if (sortBy === 'battery') return b.batteryDrainPerHour - a.batteryDrainPerHour;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6">
      {/* Top RAM Gauge & Diagnostics */}
      <RamGauge />

      {/* Process & Apps Manager Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'App ya package search karein (e.g. Instagram, BGMI)...'
                  : 'Search app or package (e.g. Instagram, BGMI)...'
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800/80 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setFilterType('running')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'running'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'hi' ? 'Active Apps' : 'Running'} ({runningAppsCount})
            </button>
            <button
              onClick={() => setFilterType('heavy')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'heavy'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'hi' ? 'Heavy RAM (>500MB)' : 'Heavy (>500MB)'}
            </button>
            <button
              onClick={() => setFilterType('stopped')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'stopped'
                  ? 'bg-slate-800 text-slate-200 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'hi' ? 'Stopped' : 'Stopped'}
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-slate-800 text-slate-200 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'hi' ? 'Sabhi' : 'All'} ({apps.length})
            </button>
          </div>
        </div>

        {/* Apps List */}
        <div className="space-y-2">
          {filteredApps.length === 0 ? (
            <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-slate-800/60">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-200">
                {lang === 'hi'
                  ? 'Koi chalne wala app nahi mila!'
                  : 'No running background apps!'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'hi'
                  ? 'RAM bilkul saaf hai aur background battery bachi hui hai.'
                  : 'Memory is clean and battery is preserved.'}
              </p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className="group bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 sm:p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left: Icon & Info */}
                <div
                  onClick={() => setSelectedAppForDetail(app)}
                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-sm font-bold shadow-md shrink-0`}
                    style={{ color: app.iconColor }}
                  >
                    {app.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors truncate">
                        {app.name}
                      </h4>
                      {app.isWhitelisted && (
                        <span className="text-[10px] text-emerald-400 font-mono font-medium border border-emerald-500/30 px-1 rounded">
                          Protected
                        </span>
                      )}
                      {app.inFreezeList && (
                        <span className="text-[10px] text-cyan-400 font-mono font-medium border border-cyan-500/30 px-1 rounded">
                          Freeze
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5 truncate">
                      <span className="truncate">{app.packageName}</span>
                      <span>·</span>
                      <span className="text-slate-400">{app.wakeLockCount} wakelocks</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Resource Numbers */}
                <div className="flex items-center gap-4 text-xs font-mono self-start sm:self-auto pl-13 sm:pl-0">
                  <div className="text-right">
                    <span className="text-amber-400 font-bold block">
                      {app.ramUsageMb} MB
                    </span>
                    <span className="text-[10px] text-slate-400 block">RAM PSS</span>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold block">
                      {app.batteryDrainPerHour}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">Drain/hr</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {/* Freeze list toggle */}
                  <button
                    onClick={() => toggleFreezeList(app.id)}
                    title={
                      app.inFreezeList
                        ? 'Remove from Anti-Restart list'
                        : 'Add to Anti-Restart list (Prevent waking up)'
                    }
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      app.inFreezeList
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Snowflake className="w-4 h-4" />
                  </button>

                  {/* Whitelist toggle */}
                  <button
                    onClick={() => toggleWhitelist(app.id)}
                    title={
                      app.isWhitelisted
                        ? 'Remove from Whitelist'
                        : 'Whitelist (Protect from killing)'
                    }
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      app.isWhitelisted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                  </button>

                  {/* Inspect Detail */}
                  <button
                    onClick={() => setSelectedAppForDetail(app)}
                    title="View App Details & Net Block"
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  {/* Force Stop / Relaunch */}
                  {app.status === 'running' ? (
                    <button
                      onClick={() => forceStopSingleApp(app.id)}
                      disabled={app.isWhitelisted}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        app.isWhitelisted
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 active:scale-95'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'Force Stop' : 'Force Stop'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => relaunchApp(app.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'hi' ? 'Reopen' : 'Reopen'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
