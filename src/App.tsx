import React, { useState } from 'react';
import {
  Zap,
  Snowflake,
  Shield,
  Code,
  Settings,
  Smartphone,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Battery,
  Flame,
} from 'lucide-react';
import { KillAppProvider, useKillApp } from './context/KillAppContext';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { AntiRestartTab } from './components/AntiRestartTab';
import { FirewallTab } from './components/FirewallTab';
import { PermissionsGuideTab } from './components/PermissionsGuideTab';
import { AndroidSourceExportTab } from './components/AndroidSourceExportTab';
import { KillAutomatorModal } from './components/KillAutomatorModal';
import { AppDetailModal } from './components/AppDetailModal';
import { FloatingWidget } from './components/FloatingWidget';

type TabType = 'dashboard' | 'antirestart' | 'firewall' | 'permissions' | 'source';

const MainContent: React.FC = () => {
  const { lang, toastMessage, runningAppsCount, frozenAppsCount, blockedAppsCount, deviceStats } =
    useKillApp();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/50 text-slate-100 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header />

      {/* View Switcher & Quick Navigation Bar */}
      <div className="border-b border-slate-900 bg-slate-950/60 backdrop-blur px-4 py-2 sticky top-[57px] z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          {/* Main 5 Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'RAM & Apps' : 'RAM & Apps'}</span>
              {runningAppsCount > 0 && (
                <span
                  className={`text-[10px] px-1 rounded font-mono ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-950 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {runningAppsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('antirestart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'antirestart'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'Anti-Restart Guard' : 'Anti-Restart Guard'}</span>
              <span
                className={`text-[10px] px-1 rounded font-mono ${
                  activeTab === 'antirestart'
                    ? 'bg-slate-950 text-cyan-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {frozenAppsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('firewall')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'firewall'
                  ? 'bg-indigo-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'Internet Blocker' : 'No-Root Firewall'}</span>
              <span
                className={`text-[10px] px-1 rounded font-mono ${
                  activeTab === 'firewall'
                    ? 'bg-slate-950 text-indigo-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {blockedAppsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'permissions'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'No-Root Guide' : 'No-Root Setup'}</span>
            </button>

            <button
              onClick={() => setActiveTab('source')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'source'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'Kotlin Code / APK' : 'Kotlin Code / APK'}</span>
            </button>
          </div>

          {/* Toggle Phone Frame Simulator */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-colors shrink-0"
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'hi' ? 'Wide Dashboard' : 'Wide Layout'}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'hi' ? 'Phone Simulator Frame' : 'Phone Mockup'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 py-6 px-4">
        {isPhoneFrame ? (
          /* Android Smartphone Mockup Mode */
          <div className="max-w-sm mx-auto bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 relative ring-1 ring-slate-800">
            {/* Camera Punch Hole */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-30 border border-slate-800" />

            {/* Android Status Bar */}
            <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-mono text-slate-400">
              <span>12:45</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400">5G</span>
                <Wifi className="w-3.5 h-3.5 text-slate-300" />
                <div className="flex items-center gap-1">
                  <span>{deviceStats.batteryLevel}%</span>
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Scrollable Phone Screen Contents */}
            <div className="max-h-[720px] overflow-y-auto px-1 py-2 space-y-4">
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'antirestart' && <AntiRestartTab />}
              {activeTab === 'firewall' && <FirewallTab />}
              {activeTab === 'permissions' && <PermissionsGuideTab />}
              {activeTab === 'source' && <AndroidSourceExportTab />}
            </div>

            {/* Gesture Navigation Bar */}
            <div className="pt-2 pb-1 flex justify-center">
              <div className="w-28 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        ) : (
          /* Full Wide Responsive Dashboard Mode */
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'antirestart' && <AntiRestartTab />}
            {activeTab === 'firewall' && <FirewallTab />}
            {activeTab === 'permissions' && <PermissionsGuideTab />}
            {activeTab === 'source' && <AndroidSourceExportTab />}
          </div>
        )}
      </main>

      {/* Floating RAM Boost Overlay */}
      <FloatingWidget />

      {/* Accessibility Force Stop Visualizer Modal */}
      <KillAutomatorModal />

      {/* App Inspector Detail Modal */}
      <AppDetailModal />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong className="text-slate-400">Vaibhav Lodhi KillApp</strong> · 100% Bina Root Ke Kaam Karne Wala Android System Optimizer & Firewall
          </p>
          <p className="font-mono text-[11px] text-emerald-500/80">
            Engine: AccessibilityService + VpnService Loopback + KeepAlive Watchdog
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <KillAppProvider>
      <MainContent />
    </KillAppProvider>
  );
}
