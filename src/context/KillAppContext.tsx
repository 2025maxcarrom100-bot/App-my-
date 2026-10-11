import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AndroidApp, BlockedTrafficLog, PreventedWakeLog, DeviceStats, PermissionStatus, Language } from '../types';
import { INITIAL_APPS, INITIAL_PREVENTED_LOGS, INITIAL_BLOCKED_TRAFFIC } from '../data/initialApps';

interface KillSessionState {
  isActive: boolean;
  currentIndex: number;
  totalToKill: number;
  currentApp: AndroidApp | null;
  currentStepMessage: string;
  freedThisSessionMb: number;
}

interface KillAppContextType {
  apps: AndroidApp[];
  deviceStats: DeviceStats;
  permissions: PermissionStatus;
  lang: Language;
  setLang: (l: Language) => void;
  // Computed memory
  usedRamMb: number;
  freeRamMb: number;
  ramPercentage: number;
  runningAppsCount: number;
  frozenAppsCount: number;
  blockedAppsCount: number;
  estimatedBatterySavedHours: number;
  
  // Kill Automator
  killSession: KillSessionState;
  forceStopAllRunning: () => void;
  forceStopSingleApp: (appId: string) => void;
  stopKillSessionEarly: () => void;
  relaunchApp: (appId: string) => void;

  // Anti-Restart / Auto-Freeze
  antiRestartActive: boolean;
  setAntiRestartActive: (v: boolean) => void;
  screenOffKillEnabled: boolean;
  setScreenOffKillEnabled: (v: boolean) => void;
  highRamWatchdogEnabled: boolean;
  setHighRamWatchdogEnabled: (v: boolean) => void;
  toggleFreezeList: (appId: string) => void;
  toggleWhitelist: (appId: string) => void;
  preventedLogs: PreventedWakeLog[];
  clearPreventedLogs: () => void;

  // Firewall / Internet Blocker
  firewallActive: boolean;
  toggleFirewallMaster: () => void;
  toggleAppInternet: (appId: string, type: 'wifi' | 'mobile' | 'background') => void;
  blockAllBackgroundNet: () => void;
  unblockAllNet: () => void;
  trafficLogs: BlockedTrafficLog[];
  clearTrafficLogs: () => void;

  // Permissions & Device
  togglePermission: (perm: keyof PermissionStatus) => void;
  setDeviceRamSpec: (ramGb: number) => void;
  showFloatingWidget: boolean;
  setShowFloatingWidget: (v: boolean) => void;
  selectedAppForDetail: AndroidApp | null;
  setSelectedAppForDetail: (app: AndroidApp | null) => void;

  // Quick Notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const KillAppContext = createContext<KillAppContextType | undefined>(undefined);

export const KillAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AndroidApp[]>(() => {
    const saved = localStorage.getItem('vl_killapp_apps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_APPS;
  });

  const [lang, setLang] = useState<Language>('hi');
  const [antiRestartActive, setAntiRestartActive] = useState<boolean>(true);
  const [screenOffKillEnabled, setScreenOffKillEnabled] = useState<boolean>(true);
  const [highRamWatchdogEnabled, setHighRamWatchdogEnabled] = useState<boolean>(true);
  const [firewallActive, setFirewallActive] = useState<boolean>(true);
  const [showFloatingWidget, setShowFloatingWidget] = useState<boolean>(true);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<AndroidApp | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [preventedLogs, setPreventedLogs] = useState<PreventedWakeLog[]>(INITIAL_PREVENTED_LOGS);
  const [trafficLogs, setTrafficLogs] = useState<BlockedTrafficLog[]>(INITIAL_BLOCKED_TRAFFIC);

  const [permissions, setPermissions] = useState<PermissionStatus>({
    accessibilityService: true,
    vpnService: true,
    usageAccess: true,
    batteryOptimizationIgnored: true,
    overlayPermission: true,
  });

  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    totalRamGb: 8,
    batteryLevel: 82,
    batteryTempCelsius: 33.8,
    batteryDrainMa: 260,
    batteryHealth: 'Good',
    batteryHoursRemaining: 18.5,
    storageUsedGb: 64.2,
    storageTotalGb: 128,
  });

  const [killSession, setKillSession] = useState<KillSessionState>({
    isActive: false,
    currentIndex: 0,
    totalToKill: 0,
    currentApp: null,
    currentStepMessage: '',
    freedThisSessionMb: 0,
  });

  // Save apps state to localStorage
  useEffect(() => {
    localStorage.setItem('vl_killapp_apps', JSON.stringify(apps));
  }, [apps]);

  // Compute memory
  const systemBaseRamMb = 1750; // Android OS, Kernel, Display buffer
  const runningAppsRamMb = apps
    .filter((a) => a.status === 'running')
    .reduce((sum, a) => sum + a.ramUsageMb, 0);

  const totalRamMb = deviceStats.totalRamGb * 1024;
  const usedRamMb = Math.min(totalRamMb - 300, systemBaseRamMb + runningAppsRamMb);
  const freeRamMb = Math.max(300, totalRamMb - usedRamMb);
  const ramPercentage = Math.round((usedRamMb / totalRamMb) * 100);

  const runningAppsCount = apps.filter((a) => a.status === 'running' && !a.isWhitelisted).length;
  const frozenAppsCount = apps.filter((a) => a.inFreezeList).length;
  const blockedAppsCount = apps.filter(
    (a) => a.internetBlocked.wifi || a.internetBlocked.mobile || a.internetBlocked.background
  ).length;

  // Battery savings calculation
  const stoppedCount = apps.filter((a) => a.status === 'force_stopped').length;
  const estimatedBatterySavedHours = Number(((stoppedCount * 0.75) + (firewallActive ? 1.4 : 0)).toFixed(1));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Automated Force Stop sequence (No-Root Accessibility simulation)
  const forceStopAllRunning = () => {
    if (!permissions.accessibilityService) {
      showToast(lang === 'hi' ? 'Pehle Accessibility Service enable karein!' : 'Enable Accessibility Service first!');
      return;
    }

    const targets = apps.filter((a) => a.status === 'running' && !a.isWhitelisted);
    if (targets.length === 0) {
      showToast(lang === 'hi' ? 'Sabhi background apps pehle se hi band hain!' : 'All background apps are already stopped!');
      return;
    }

    setKillSession({
      isActive: true,
      currentIndex: 0,
      totalToKill: targets.length,
      currentApp: targets[0],
      currentStepMessage: `Opening App Settings for ${targets[0].name}...`,
      freedThisSessionMb: 0,
    });
  };

  const stopKillSessionEarly = () => {
    setKillSession((prev) => ({ ...prev, isActive: false }));
    showToast(lang === 'hi' ? 'Optimization rok di gayi' : 'Optimization stopped');
  };

  // Step-by-step kill effect runner
  useEffect(() => {
    if (!killSession.isActive) return;

    const targets = apps.filter((a) => a.status === 'running' && !a.isWhitelisted);
    if (killSession.currentIndex >= targets.length) {
      // Completed!
      setKillSession((prev) => ({ ...prev, isActive: false }));
      
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b'],
        });
      } catch (e) {
        // ignore
      }

      showToast(
        lang === 'hi'
          ? `🎉 Zabardast! ${targets.length} Apps Force Stop kiye gaye, ${killSession.freedThisSessionMb} MB RAM free hui!`
          : `🎉 Success! ${targets.length} Apps Force-Stopped, ${killSession.freedThisSessionMb} MB RAM freed!`
      );
      return;
    }

    const targetApp = targets[killSession.currentIndex];
    const steps = [
      `Settings > Apps > ${targetApp.name}`,
      `Accessibility Service clicking: [FORCE STOP]`,
      `Confirming Dialog [OK] (Process PID terminated)`,
      `Clearing Dalvik/ART cache (${targetApp.ramUsageMb} MB freed)`,
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setKillSession((prev) => ({
          ...prev,
          currentApp: targetApp,
          currentStepMessage: steps[stepIdx],
        }));
      } else {
        clearInterval(interval);
        // Mark app as force_stopped
        setApps((prevApps) =>
          prevApps.map((a) =>
            a.id === targetApp.id
              ? {
                  ...a,
                  status: 'force_stopped',
                  lastKilledAt: Date.now(),
                }
              : a
          )
        );

        setKillSession((prev) => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          freedThisSessionMb: prev.freedThisSessionMb + targetApp.ramUsageMb,
        }));
      }
    }, 180);

    return () => clearInterval(interval);
  }, [killSession.isActive, killSession.currentIndex, apps]);

  // Single app force stop
  const forceStopSingleApp = (appId: string) => {
    const target = apps.find((a) => a.id === appId);
    if (!target) return;

    setApps((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'force_stopped',
              lastKilledAt: Date.now(),
            }
          : a
      )
    );

    showToast(
      lang === 'hi'
        ? `${target.name} ko Force Stop kar diya gaya (${target.ramUsageMb} MB free)`
        : `${target.name} Force-Stopped (${target.ramUsageMb} MB freed)`
    );
  };

  const relaunchApp = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'running' } : a))
    );
    const target = apps.find((a) => a.id === appId);
    showToast(
      lang === 'hi'
        ? `${target?.name || 'App'} dubara RAM me shuru hua (Simulated)`
        : `${target?.name || 'App'} started in RAM (Simulated)`
    );
  };

  // Toggle Freeze list (Anti-Restart Guard)
  const toggleFreezeList = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const next = !a.inFreezeList;
          showToast(
            next
              ? lang === 'hi'
                ? `${a.name} ko Anti-Restart Freeze List me daala gaya (Duwara on nahi hoga)`
                : `${a.name} added to Anti-Restart Freeze List`
              : lang === 'hi'
              ? `${a.name} Freeze List se hata diya gaya`
              : `${a.name} removed from Freeze List`
          );
          return { ...a, inFreezeList: next };
        }
        return a;
      })
    );
  };

  // Toggle Whitelist
  const toggleWhitelist = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const next = !a.isWhitelisted;
          showToast(
            next
              ? lang === 'hi'
                ? `${a.name} ko Whitelist (Surakshit) kiya gaya (Kabhi kill nahi hoga)`
                : `${a.name} whitelisted (Protected from kill)`
              : lang === 'hi'
              ? `${a.name} Whitelist se hata diya gaya`
              : `${a.name} removed from whitelist`
          );
          return { ...a, isWhitelisted: next, inFreezeList: next ? false : a.inFreezeList };
        }
        return a;
      })
    );
  };

  // Firewall toggle per app
  const toggleAppInternet = (appId: string, type: 'wifi' | 'mobile' | 'background') => {
    if (!firewallActive) {
      showToast(lang === 'hi' ? 'Pehle Master Firewall VPN on karein!' : 'Enable Master Firewall VPN first!');
    }
    setApps((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const updatedNet = {
            ...a.internetBlocked,
            [type]: !a.internetBlocked[type],
          };
          const isNowBlocked = updatedNet[type];
          showToast(
            isNowBlocked
              ? lang === 'hi'
                ? `${a.name} ka ${type.toUpperCase()} Internet block kar diya!`
                : `${a.name}'s ${type.toUpperCase()} internet blocked!`
              : lang === 'hi'
              ? `${a.name} ka ${type.toUpperCase()} Internet allow kiya gaya`
              : `${a.name}'s ${type.toUpperCase()} internet allowed`
          );
          return { ...a, internetBlocked: updatedNet };
        }
        return a;
      })
    );
  };

  const blockAllBackgroundNet = () => {
    setApps((prev) =>
      prev.map((a) => ({
        ...a,
        internetBlocked: {
          ...a.internetBlocked,
          background: true,
        },
      }))
    );
    showToast(
      lang === 'hi'
        ? 'Sabhi apps ka Background Internet block kar diya gaya!'
        : 'All background app internet access blocked!'
    );
  };

  const unblockAllNet = () => {
    setApps((prev) =>
      prev.map((a) => ({
        ...a,
        internetBlocked: { wifi: false, mobile: false, background: false },
      }))
    );
    showToast(
      lang === 'hi' ? 'Sabhi apps ka internet unblock kar diya gaya' : 'All app internet unblocked'
    );
  };

  const toggleFirewallMaster = () => {
    const next = !firewallActive;
    setFirewallActive(next);
    showToast(
      next
        ? lang === 'hi'
          ? '🛡️ Local VPN Firewall shuru ho gaya (Bina Root ke internet block active)'
          : '🛡️ Local VPN Firewall active (No-Root packet filter online)'
        : lang === 'hi'
        ? 'Firewall band kar diya gaya'
        : 'Firewall stopped'
    );
  };

  const togglePermission = (perm: keyof PermissionStatus) => {
    setPermissions((prev) => {
      const next = !prev[perm];
      showToast(
        next
          ? `Permission granted: ${perm}`
          : `Permission revoked: ${perm}`
      );
      return { ...prev, [perm]: next };
    });
  };

  const setDeviceRamSpec = (ramGb: number) => {
    setDeviceStats((prev) => ({ ...prev, totalRamGb: ramGb }));
    showToast(
      lang === 'hi'
        ? `Device RAM set: ${ramGb} GB`
        : `Device RAM set: ${ramGb} GB`
    );
  };

  const clearPreventedLogs = () => {
    setPreventedLogs([]);
    showToast(lang === 'hi' ? 'Logs clear kar diye gaye' : 'Logs cleared');
  };

  const clearTrafficLogs = () => {
    setTrafficLogs([]);
    showToast(lang === 'hi' ? 'Traffic logs clear kar diye gaye' : 'Traffic logs cleared');
  };

  // Realistic background simulation: occasionally intercepts a wake-up if Anti-Restart Guard is active!
  useEffect(() => {
    if (!antiRestartActive) return;

    const interval = setInterval(() => {
      const frozenApps = apps.filter((a) => a.inFreezeList);
      if (frozenApps.length === 0) return;

      const randomTarget = frozenApps[Math.floor(Math.random() * frozenApps.length)];
      const triggers: PreventedWakeLog['triggerSource'][] = [
        'ALARM_WAKEUP',
        'CONNECTIVITY_CHANGE',
        'FCM_PUSH',
        'PERIODIC_JOB',
      ];
      const randomTrigger = triggers[Math.floor(Math.random() * triggers.length)];

      const newLog: PreventedWakeLog = {
        id: `wake-${Date.now()}`,
        timestamp: 'Just now',
        appName: randomTarget.name,
        packageName: randomTarget.packageName,
        triggerSource: randomTrigger,
        actionTaken: 'Force-Stopped immediately',
        freedRamMb: randomTarget.ramUsageMb,
      };

      setPreventedLogs((prev) => [newLog, ...prev.slice(0, 19)]);
      setApps((prev) =>
        prev.map((a) =>
          a.id === randomTarget.id
            ? { ...a, preventedRestartsCount: a.preventedRestartsCount + 1 }
            : a
        )
      );
    }, 18000); // every 18 seconds simulated background wake interception

    return () => clearInterval(interval);
  }, [antiRestartActive, apps]);

  // Simulated firewall traffic packet interception
  useEffect(() => {
    if (!firewallActive) return;

    const interval = setInterval(() => {
      const blockedApps = apps.filter(
        (a) => a.internetBlocked.wifi || a.internetBlocked.mobile || a.internetBlocked.background
      );
      if (blockedApps.length === 0) return;

      const randomTarget = blockedApps[Math.floor(Math.random() * blockedApps.length)];
      const isWifi = randomTarget.internetBlocked.wifi;
      const endpoints = [
        'graph.facebook.com:443',
        'adservice.google.com:443',
        'analytics.tiktok.com:443',
        'telemetry.sdk.cloud:8080',
        'crashlyticsreports-pa.googleapis.com:443',
      ];
      const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const randomKb = Math.floor(Math.random() * 600) + 80;

      const newLog: BlockedTrafficLog = {
        id: `net-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        appName: randomTarget.name,
        packageName: randomTarget.packageName,
        domainOrIp: randomEndpoint,
        connectionType: isWifi ? 'wifi' : 'mobile',
        dataSavedKb: randomKb,
        protocol: 'HTTPS',
      };

      setTrafficLogs((prev) => [newLog, ...prev.slice(0, 24)]);
      setApps((prev) =>
        prev.map((a) =>
          a.id === randomTarget.id
            ? { ...a, blockedPacketsCount: a.blockedPacketsCount + 1 }
            : a
        )
      );
    }, 9000);

    return () => clearInterval(interval);
  }, [firewallActive, apps]);

  return (
    <KillAppContext.Provider
      value={{
        apps,
        deviceStats,
        permissions,
        lang,
        setLang,
        usedRamMb,
        freeRamMb,
        ramPercentage,
        runningAppsCount,
        frozenAppsCount,
        blockedAppsCount,
        estimatedBatterySavedHours,
        killSession,
        forceStopAllRunning,
        forceStopSingleApp,
        stopKillSessionEarly,
        relaunchApp,
        antiRestartActive,
        setAntiRestartActive,
        screenOffKillEnabled,
        setScreenOffKillEnabled,
        highRamWatchdogEnabled,
        setHighRamWatchdogEnabled,
        toggleFreezeList,
        toggleWhitelist,
        preventedLogs,
        clearPreventedLogs,
        firewallActive,
        toggleFirewallMaster,
        toggleAppInternet,
        blockAllBackgroundNet,
        unblockAllNet,
        trafficLogs,
        clearTrafficLogs,
        togglePermission,
        setDeviceRamSpec,
        showFloatingWidget,
        setShowFloatingWidget,
        selectedAppForDetail,
        setSelectedAppForDetail,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </KillAppContext.Provider>
  );
};

export const useKillApp = () => {
  const context = useContext(KillAppContext);
  if (!context) {
    throw new Error('useKillApp must be used within a KillAppProvider');
  }
  return context;
};
