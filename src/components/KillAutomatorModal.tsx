import React from 'react';
import { RefreshCw, CheckCircle2, Shield, X, AlertTriangle, Cpu } from 'lucide-react';
import { useKillApp } from '../context/KillAppContext';

export const KillAutomatorModal: React.FC = () => {
  const { killSession, stopKillSessionEarly, lang } = useKillApp();

  if (!killSession.isActive || !killSession.currentApp) return null;

  const progressPercent = Math.round(
    (killSession.currentIndex / Math.max(1, killSession.totalToKill)) * 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                {lang === 'hi' ? 'Accessibility Automation Runner' : 'Accessibility Automation Runner'}
              </h3>
              <p className="text-[10px] text-emerald-400 font-mono">
                No-Root Force Stop Engine Active
              </p>
            </div>
          </div>
          <button
            onClick={stopKillSessionEarly}
            className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Stop Process"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              {lang === 'hi' ? 'Target App' : 'Target App'}: {killSession.currentIndex + 1} / {killSession.totalToKill}
            </span>
            <span className="text-emerald-400 font-bold">
              +{killSession.freedThisSessionMb} MB {lang === 'hi' ? 'Free Hui' : 'Freed'}
            </span>
          </div>

          {/* Current Target Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${killSession.currentApp.iconBg} flex items-center justify-center text-xl font-bold shadow-md shrink-0`}
              style={{ color: killSession.currentApp.iconColor }}
            >
              {killSession.currentApp.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold text-slate-100 truncate">
                {killSession.currentApp.name}
              </h4>
              <p className="text-xs font-mono text-slate-400 truncate">
                {killSession.currentApp.packageName}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-amber-400 font-mono font-medium">
                  {killSession.currentApp.ramUsageMb} MB RAM
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-rose-400 font-mono">
                  {killSession.currentApp.batteryDrainPerHour}%/hr drain
                </span>
              </div>
            </div>
          </div>

          {/* Simulated Android System Actions Screen */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android Settings Simulation</span>
              </span>
              <span className="text-emerald-400 animate-pulse">Running Node Clicks</span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2.5 text-slate-300 border border-slate-800/60">
              <p className="text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>{killSession.currentStepMessage}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Action:</span>
                <span className="text-slate-200">ACTION_CLICK</span>
              </div>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">View ID:</span>
                <span className="text-slate-200 truncate block">force_stop_button</span>
              </div>
            </div>
          </div>

          {/* Explanation banner */}
          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3 text-[11px] text-emerald-200/90 leading-relaxed flex items-start gap-2.5">
            <span className="text-base shrink-0">💡</span>
            <span>
              {lang === 'hi'
                ? 'Vaibhav Lodhi KillApp bina ROOT ke Android Accessibility Service ke jariye har app ke Settings me jaakar Force Stop ko automate karta hai. Isse app background memory aur battery churana band kar deta hai.'
                : 'Vaibhav Lodhi KillApp uses Android Accessibility Service to automate Force Stop navigation without ROOT. This cleanly stops background memory and battery consumption.'}
            </span>
          </div>

          {/* Stop early button */}
          <div className="pt-1">
            <button
              onClick={stopKillSessionEarly}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              {lang === 'hi' ? 'Rok dein (Cancel)' : 'Cancel Optimization'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
