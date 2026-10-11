import React from 'react';
import { Zap, RefreshCw, Battery, Thermometer, ShieldAlert, CheckCircle2, Flame } from 'lucide-react';
import { useKillApp } from '../context/KillAppContext';

export const RamGauge: React.FC = () => {
  const {
    lang,
    usedRamMb,
    freeRamMb,
    ramPercentage,
    deviceStats,
    runningAppsCount,
    forceStopAllRunning,
    killSession,
    estimatedBatterySavedHours,
  } = useKillApp();

  const totalRamMb = deviceStats.totalRamGb * 1024;
  const usedGb = (usedRamMb / 1024).toFixed(2);
  const totalGb = deviceStats.totalRamGb.toFixed(1);
  const freeGb = (freeRamMb / 1024).toFixed(2);

  // Status color based on percentage
  const statusColor =
    ramPercentage > 80
      ? 'text-rose-400'
      : ramPercentage > 60
      ? 'text-amber-400'
      : 'text-emerald-400';

  const strokeColor =
    ramPercentage > 80
      ? '#f43f5e'
      : ramPercentage > 60
      ? '#fbbf24'
      : '#10b981';

  // SVG circular arc calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * ramPercentage) / 100;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${
          ramPercentage > 80 ? 'bg-rose-500' : 'bg-emerald-500'
        }`}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive RAM Gauge Meter */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#1e293b"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
                {lang === 'hi' ? 'RAM Load' : 'RAM Used'}
              </span>
              <div className="flex items-baseline justify-center">
                <span className={`text-3xl font-black font-mono tracking-tight ${statusColor}`}>
                  {ramPercentage}
                </span>
                <span className="text-sm font-bold text-slate-400 ml-0.5">%</span>
              </div>
              <span className="text-xs text-slate-300 font-mono mt-0.5">
                {usedGb} / {totalGb} GB
              </span>
              <span className="text-[10px] text-emerald-400 font-mono mt-1">
                {freeGb} GB {lang === 'hi' ? 'Khaali' : 'Free'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {freeGb} GB Free
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {usedGb} GB Used
            </span>
          </div>
        </div>

        {/* Right: Live Diagnostics & Action Trigger */}
        <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-300 tracking-wide uppercase text-[11px]">
                {lang === 'hi' ? 'Background Resource Stats' : 'Background Resource Stats'}
              </span>
              <span className="font-mono text-emerald-400 text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Kernel Monitor
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 my-3">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'hi' ? 'Active Apps' : 'Active Apps'}</span>
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-lg font-black font-mono text-slate-100 mt-1">
                  {runningAppsCount}
                </span>
                <span className="text-[10px] text-slate-400">
                  {lang === 'hi' ? 'RAM me chal rahe' : 'in memory'}
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'hi' ? 'Battery' : 'Battery'}</span>
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-lg font-black font-mono text-slate-100 mt-1">
                  {deviceStats.batteryLevel}%
                </span>
                <span className="text-[10px] text-emerald-400">
                  +{estimatedBatterySavedHours}h {lang === 'hi' ? 'bachegi' : 'saved'}
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex flex-col">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'hi' ? 'Temp' : 'Temp'}</span>
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-lg font-black font-mono text-slate-100 mt-1">
                  {deviceStats.batteryTempCelsius}°C
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {deviceStats.batteryDrainMa} mA drain
                </span>
              </div>
            </div>
          </div>

          {/* Giant Kill Button */}
          <div>
            <button
              onClick={forceStopAllRunning}
              disabled={killSession.isActive || runningAppsCount === 0}
              className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 text-base shadow-xl transition-all active:scale-[0.98] ${
                runningAppsCount === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:brightness-110 shadow-emerald-500/25 border border-emerald-300/40 cursor-pointer'
              }`}
            >
              {killSession.isActive ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                  <span>
                    {lang === 'hi'
                      ? 'FORCE STOPPING CHAL RAHA HAI...'
                      : 'AUTOMATING FORCE STOP...'}
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>
                    {lang === 'hi'
                      ? `SABHI APPS FORCE STOP KAREIN (${runningAppsCount} APPS KILL)`
                      : `FORCE STOP ALL RUNNING APPS (${runningAppsCount} APPS)`}
                  </span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-2">
              <span className="text-emerald-400">✓ 100% Bina Root ke</span>
              <span>·</span>
              <span>Accessibility Automation</span>
              <span>·</span>
              <span>Battery & RAM Saver</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
