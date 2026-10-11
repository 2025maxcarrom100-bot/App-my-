import React, { useState } from 'react';
import { Shield, Wifi, WifiOff, Radio, Server, Activity, Lock, CheckCircle2, Search, Zap, AlertCircle } from 'lucide-react';
import { useKillApp } from '../context/KillAppContext';

export const FirewallTab: React.FC = () => {
  const {
    apps,
    firewallActive,
    toggleFirewallMaster,
    toggleAppInternet,
    blockAllBackgroundNet,
    unblockAllNet,
    trafficLogs,
    clearTrafficLogs,
    lang,
    blockedAppsCount,
  } = useKillApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'blocked' | 'allowed'>('all');

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const isAnyBlocked =
      app.internetBlocked.wifi ||
      app.internetBlocked.mobile ||
      app.internetBlocked.background;

    if (filterMode === 'blocked') return isAnyBlocked;
    if (filterMode === 'allowed') return !isAnyBlocked;
    return true;
  });

  const totalPacketsSum = apps.reduce((sum, a) => sum + a.blockedPacketsCount, 0);

  return (
    <div className="space-y-6">
      {/* Firewall Master Header */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                {lang === 'hi'
                  ? 'No-Root Internet Blocker (Per-App Firewall)'
                  : 'No-Root Internet Blocker (Per-App Firewall)'}
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'Bina kisi ROOT access ke kisi bhi app ka WiFi, Mobile Data ya Background Internet block karein. Ye Android ke local VpnService loopback par kaam karta hai — koi bahari server nahi, 100% offline aur surakshit.'
                : 'Block WiFi, Mobile Data, or Background Internet per application without ROOT. Uses Android local VpnService loopback dummy drop — 100% local, offline, and secure.'}
            </p>
          </div>

          {/* Master VPN Switch */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-200 block">
                {lang === 'hi' ? 'VPN Firewall Master' : 'VPN Firewall Master'}
              </span>
              <span className="text-[10px] text-indigo-400 font-mono">
                {firewallActive
                  ? lang === 'hi' ? 'ACTIVE (Loopback Filter ON)' : 'ACTIVE (Loopback Filter ON)'
                  : lang === 'hi' ? 'INACTIVE (Off)' : 'INACTIVE (Off)'}
              </span>
            </div>
            <button
              onClick={toggleFirewallMaster}
              className={`w-13 h-7 rounded-full transition-colors relative p-0.5 ${
                firewallActive ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-slate-950 shadow-md transition-transform ${
                  firewallActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={blockAllBackgroundNet}
            className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Server className="w-3.5 h-3.5" />
            <span>
              {lang === 'hi'
                ? 'Sabhi Apps ka Background Data Block Karein'
                : 'Block All Background Data'}
            </span>
          </button>
          <button
            onClick={unblockAllNet}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 text-xs font-medium transition-colors"
          >
            {lang === 'hi' ? 'Sabhi ko Allow (Unblock) Karein' : 'Allow All Apps'}
          </button>

          <div className="ml-auto flex items-center gap-2 text-xs font-mono text-indigo-300">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>{totalPacketsSum} {lang === 'hi' ? 'Packets Block Kiye Gaye' : 'Packets Dropped'}</span>
          </div>
        </div>
      </div>

      {/* Per-App Control Center */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'App search karein (e.g. YouTube, Instagram, BGMI)...'
                  : 'Search app...'
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'hi' ? 'Sabhi Apps' : 'All Apps'} ({apps.length})
            </button>
            <button
              onClick={() => setFilterMode('blocked')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterMode === 'blocked'
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'hi' ? 'Blocked Apps' : 'Blocked'} ({blockedAppsCount})
            </button>
            <button
              onClick={() => setFilterMode('allowed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterMode === 'allowed'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'hi' ? 'Allowed Apps' : 'Allowed'}
            </button>
          </div>
        </div>

        {/* Apps Network Rules List */}
        <div className="space-y-2">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-sm font-bold shadow-md shrink-0`}
                  style={{ color: app.iconColor }}
                >
                  {app.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{app.name}</h4>
                  <p className="text-xs font-mono text-slate-400 truncate">{app.packageName}</p>
                </div>
              </div>

              {/* Toggles Group */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {/* WiFi Block Toggle */}
                <button
                  onClick={() => toggleAppInternet(app.id, 'wifi')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    app.internetBlocked.wifi
                      ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                  title="Block/Allow WiFi"
                >
                  {app.internetBlocked.wifi ? (
                    <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>WiFi</span>
                </button>

                {/* Mobile Data Block Toggle */}
                <button
                  onClick={() => toggleAppInternet(app.id, 'mobile')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    app.internetBlocked.mobile
                      ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                  title="Block/Allow Mobile Data"
                >
                  <Radio className={`w-3.5 h-3.5 ${app.internetBlocked.mobile ? 'text-rose-400' : 'text-emerald-400'}`} />
                  <span>Data</span>
                </button>

                {/* Background Data Toggle */}
                <button
                  onClick={() => toggleAppInternet(app.id, 'background')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    app.internetBlocked.background
                      ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                  title="Block/Allow Background Data"
                >
                  <Server className={`w-3.5 h-3.5 ${app.internetBlocked.background ? 'text-rose-400' : 'text-cyan-400'}`} />
                  <span>Bg</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Dropped Traffic Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-sm font-bold text-slate-100">
              {lang === 'hi'
                ? 'Live Intercepted Network Traffic (Packets Dropped)'
                : 'Live Intercepted Network Traffic'}
            </h3>
          </div>
          {trafficLogs.length > 0 && (
            <button
              onClick={clearTrafficLogs}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {lang === 'hi' ? 'Logs Saaf Karein' : 'Clear Log'}
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto">
          {trafficLogs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">
              {lang === 'hi' ? 'Koi traffic log nahi hai' : 'No blocked traffic yet'}
            </p>
          ) : (
            trafficLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-rose-400 font-bold shrink-0">[DROP]</span>
                  <span className="text-slate-200 font-semibold">{log.appName}</span>
                  <span className="text-slate-500 truncate max-w-xs">{log.domainOrIp}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-indigo-400 font-bold">
                    +{log.dataSavedKb} KB Saved
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
