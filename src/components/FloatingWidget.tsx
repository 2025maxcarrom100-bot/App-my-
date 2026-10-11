import React, { useState } from 'react';
import { Zap, X, Shield, RefreshCw } from 'lucide-react';
import { useKillApp } from '../context/KillAppContext';

export const FloatingWidget: React.FC = () => {
  const {
    showFloatingWidget,
    setShowFloatingWidget,
    ramPercentage,
    runningAppsCount,
    forceStopAllRunning,
    killSession,
    lang,
  } = useKillApp();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!showFloatingWidget) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {isExpanded ? (
        <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md w-64 space-y-3 animate-in fade-in zoom-in-90 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-100">
                Vaibhav Lodhi KillApp
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-slate-100 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">RAM:</span>
            <span className="text-emerald-400 font-bold">{ramPercentage}% Used</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">{lang === 'hi' ? 'Active Apps:' : 'Active Apps:'}</span>
            <span className="text-amber-400 font-bold">{runningAppsCount} Apps</span>
          </div>

          <button
            onClick={() => {
              forceStopAllRunning();
              setIsExpanded(false);
            }}
            disabled={runningAppsCount === 0 || killSession.isActive}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>{lang === 'hi' ? 'Boost Now (Kill)' : 'Boost Now (Kill)'}</span>
          </button>
        </div>
      ) : (
        <div className="relative group">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-14 h-14 rounded-full bg-slate-900 border-2 border-emerald-400/80 text-emerald-400 flex flex-col items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
            title="Vaibhav Lodhi Quick Kill"
          >
            <div className="text-[11px] font-mono font-black">{ramPercentage}%</div>
            <Zap className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {runningAppsCount}
            </span>
          </button>
          <button
            onClick={() => setShowFloatingWidget(false)}
            className="absolute -top-2 -left-2 w-5 h-5 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-400"
            title="Hide Widget"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
