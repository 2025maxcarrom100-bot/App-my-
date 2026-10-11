export type AppCategory = 'social' | 'games' | 'media' | 'tools' | 'system' | 'finance';

export interface AndroidApp {
  id: string;
  name: string;
  packageName: string;
  iconBg: string;
  iconColor: string;
  category: AppCategory;
  ramUsageMb: number; // e.g. 540 MB
  cachedRamMb: number;
  cpuPercent: number; // e.g. 4.2%
  batteryDrainPerHour: number; // % per hour
  status: 'running' | 'force_stopped' | 'frozen';
  isSystemApp: boolean;
  inFreezeList: boolean; // Anti-restart blacklist
  isWhitelisted: boolean; // Protected from kill
  internetBlocked: {
    wifi: boolean;
    mobile: boolean;
    background: boolean;
  };
  blockedPacketsCount: number;
  lastKilledAt: number | null;
  wakeLockCount: number;
  backgroundServices: string[];
  preventedRestartsCount: number;
}

export interface BlockedTrafficLog {
  id: string;
  timestamp: string;
  appName: string;
  packageName: string;
  domainOrIp: string;
  connectionType: 'wifi' | 'mobile';
  dataSavedKb: number;
  protocol: 'TCP' | 'UDP' | 'HTTPS';
}

export interface PreventedWakeLog {
  id: string;
  timestamp: string;
  appName: string;
  packageName: string;
  triggerSource: 'ALARM_WAKEUP' | 'BOOT_COMPLETED' | 'CONNECTIVITY_CHANGE' | 'FCM_PUSH' | 'PERIODIC_JOB';
  actionTaken: 'Force-Stopped immediately' | 'Prevented Background Process';
  freedRamMb: number;
}

export interface DeviceStats {
  totalRamGb: number;
  batteryLevel: number; // 0 - 100
  batteryTempCelsius: number;
  batteryDrainMa: number;
  batteryHealth: 'Good' | 'Fair';
  batteryHoursRemaining: number;
  storageUsedGb: number;
  storageTotalGb: number;
}

export interface PermissionStatus {
  accessibilityService: boolean;
  vpnService: boolean;
  usageAccess: boolean;
  batteryOptimizationIgnored: boolean;
  overlayPermission: boolean;
}

export type Language = 'hi' | 'en';
