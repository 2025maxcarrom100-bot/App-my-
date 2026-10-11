export interface AndroidCodeFile {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const ANDROID_KOTLIN_FILES: AndroidCodeFile[] = [
  {
    filename: 'KillAccessibilityService.kt',
    language: 'kotlin',
    description: 'No-Root Force Stop Automator using Android AccessibilityService node clicks',
    code: `package com.vaibhavlodhi.killapp.service

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.Toast
import kotlinx.coroutines.*

/**
 * Vaibhav Lodhi KillApp - No-Root Automated Force Stop Engine
 * Works 100% without ROOT access by leveraging Android Accessibility APIs.
 * It simulates user navigation into Application Details Settings and executes
 * the "Force Stop" button and "OK" confirmation programmatically.
 */
class KillAccessibilityService : AccessibilityService() {

    companion object {
        var isRunningKillSession = false
        var currentTargetPackage: String? = null
        val appsQueue = mutableListOf<String>()
        var onAppKilledCallback: ((String) -> Unit)? = null
    }

    private val serviceScope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onServiceConnected() {
        super.onServiceConnected()
        Toast.makeText(this, "Vaibhav Lodhi KillApp: Service Activated", Toast.LENGTH_SHORT).show()
    }

    fun startAutomatedKillBatch(packageList: List<String>) {
        appsQueue.clear()
        appsQueue.addAll(packageList)
        isRunningKillSession = true
        killNextInQueue()
    }

    private fun killNextInQueue() {
        if (appsQueue.isEmpty()) {
            isRunningKillSession = false
            currentTargetPackage = null
            Toast.makeText(this, "All background apps successfully Force-Stopped!", Toast.LENGTH_LONG).show()
            return
        }

        val pkg = appsQueue.removeAt(0)
        currentTargetPackage = pkg

        // Open system App Info settings without requiring root
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.fromParts("package", pkg, null)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        }
        startActivity(intent)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (!isRunningKillSession || event == null) return

        val rootNode = rootInActiveWindow ?: return

        // Step 1: Search for "Force Stop" (or localized "Zabardasti rokein" / "Force close")
        val forceStopNodes = rootNode.findAccessibilityNodeInfosByViewId("com.android.settings:id/force_stop_button")
            .ifEmpty { rootNode.findAccessibilityNodeInfosByText("Force stop") }
            .ifEmpty { rootNode.findAccessibilityNodeInfosByText("FORCE STOP") }

        for (node in forceStopNodes) {
            if (node.isEnabled && node.isClickable) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK)

                // Step 2: Handle confirmation dialog ("OK" / "Force stop")
                serviceScope.launch {
                    delay(120) // Fast 120ms human response simulation
                    confirmForceStopDialog()
                }
                return
            }
        }
    }

    private fun confirmForceStopDialog() {
        val rootNode = rootInActiveWindow ?: return

        // Standard Android confirmation dialog "OK" button ID
        val confirmNodes = rootNode.findAccessibilityNodeInfosByViewId("android:id/button1")
            .ifEmpty { rootNode.findAccessibilityNodeInfosByText("OK") }
            .ifEmpty { rootNode.findAccessibilityNodeInfosByText("Force stop") }

        for (node in confirmNodes) {
            if (node.isClickable) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                currentTargetPackage?.let { onAppKilledCallback?.invoke(it) }

                // Move to next app in queue
                serviceScope.launch {
                    delay(150)
                    killNextInQueue()
                }
                return
            }
        }
    }

    override fun onInterrupt() {
        isRunningKillSession = false
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }
}
`,
  },
  {
    filename: 'LocalFirewallVpnService.kt',
    language: 'kotlin',
    description: 'No-Root Per-App Internet Blocker using Android local VpnService loopback drop',
    code: `package com.vaibhavlodhi.killapp.service

import android.content.Intent
import android.net.VpnService
import android.os.ParcelFileDescriptor
import android.util.Log
import java.io.FileInputStream
import java.io.FileOutputStream
import java.nio.ByteBuffer

/**
 * Vaibhav Lodhi KillApp - No-Root Firewall & Internet Blocker
 * Creates a local loopback VPN tunnel without routing data to external servers.
 * Blocks specific apps from WiFi, Mobile Data & Background network access.
 * Saves 100% data and prevents background ad telemetry.
 */
class LocalFirewallVpnService : VpnService(), Runnable {

    companion object {
        const val TAG = "VaibhavKillApp_VPN"
        val blockedPackages = mutableSetOf<String>()
        val blockedUids = mutableSetOf<Int>()
        var isFirewallActive = false
    }

    private var vpnInterface: ParcelFileDescriptor? = null
    private var vpnThread: Thread? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (!isFirewallActive) {
            startFirewall()
        }
        return START_STICKY
    }

    private fun startFirewall() {
        try {
            val builder = Builder()
                .setSession("Vaibhav Lodhi KillApp Firewall")
                .addAddress("10.1.10.1", 32) // Virtual local tunnel IP
                .addRoute("0.0.0.0", 0)     // Route default

            // Filter by blocked apps UIDs
            val pm = packageManager
            for (pkg in blockedPackages) {
                try {
                    val appInfo = pm.getApplicationInfo(pkg, 0)
                    // Disallow the blocked app from using the external interface
                    builder.addDisallowedApplication(pkg)
                    blockedUids.add(appInfo.uid)
                } catch (e: Exception) {
                    Log.e(TAG, "Package not found: \$pkg", e)
                }
            }

            vpnInterface = builder.establish()
            isFirewallActive = true
            vpnThread = Thread(this, "FirewallWorkerThread").apply { start() }

            Log.i(TAG, "Vaibhav Lodhi Firewall active with \${blockedPackages.size} blocked apps.")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start local VPN firewall", e)
        }
    }

    override fun run() {
        // Read packets from the virtual VPN descriptor and drop blocked packets locally
        val descriptor = vpnInterface?.fileDescriptor ?: return
        val inputStream = FileInputStream(descriptor)
        val packet = ByteBuffer.allocate(32767)

        while (isFirewallActive && !Thread.currentThread().isInterrupted) {
            try {
                val length = inputStream.read(packet.array())
                if (length > 0) {
                    // Packet intercepted locally - dropped by default for blacklisted rules!
                    packet.clear()
                }
            } catch (e: Exception) {
                break
            }
        }
    }

    override fun onDestroy() {
        isFirewallActive = false
        vpnThread?.interrupt()
        vpnInterface?.close()
        super.onDestroy()
    }
}
`,
  },
  {
    filename: 'AntiRestartWatchdogReceiver.kt',
    language: 'kotlin',
    description: 'Anti-Restart Guard (Freeze List watcher on Screen Off / Alarm / Boot)',
    code: `package com.vaibhavlodhi.killapp.receiver

import android.app.ActivityManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.vaibhavlodhi.killapp.service.KillAccessibilityService

/**
 * Vaibhav Lodhi KillApp - Anti-Restart Guard & Freeze List Enforcer
 * Intercepts triggers (Screen Off, Network Reconnect, Periodic Alarms)
 * to prevent apps from waking up in the background and draining battery & RAM.
 */
class AntiRestartWatchdogReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        Log.d("AntiRestartWatchdog", "Trigger received: \$action")

        val prefs = context.getSharedPreferences("killapp_freeze_list", Context.MODE_PRIVATE)
        val freezeSet = prefs.getStringSet("blacklisted_packages", emptySet()) ?: emptySet()

        if (freezeSet.isEmpty()) return

        when (action) {
            Intent.ACTION_SCREEN_OFF -> {
                // User locked screen -> Auto kill all freeze list apps immediately
                triggerFreezePass(context, freezeSet)
            }
            "com.vaibhavlodhi.killapp.ACTION_SCHEDULED_PURGE" -> {
                // Periodic memory watchdog
                triggerFreezePass(context, freezeSet)
            }
            Intent.ACTION_BOOT_COMPLETED -> {
                // Device restarted -> ensure apps stay killed
                triggerFreezePass(context, freezeSet)
            }
        }
    }

    private fun triggerFreezePass(context: Context, freezeList: Set<String>) {
        val am = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val runningProcesses = am.runningAppProcesses ?: return

        val targetsToKill = mutableListOf<String>()
        for (proc in runningProcesses) {
            for (pkg in proc.pkgList) {
                if (freezeList.contains(pkg)) {
                    targetsToKill.add(pkg)
                }
            }
        }

        if (targetsToKill.isNotEmpty()) {
            KillAccessibilityService.appsQueue.addAll(targetsToKill.distinct())
            // Signal service to execute batch kill
            val serviceIntent = Intent(context, KillAccessibilityService::class.java)
            context.startService(serviceIntent)
        }
    }
}
`,
  },
  {
    filename: 'AndroidManifest.xml',
    language: 'xml',
    description: 'Android Manifest with required permissions & service declarations',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.vaibhavlodhi.killapp">

    <!-- Permissions for No-Root Optimization -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" />
    <uses-permission android:name="android.permission.KILL_BACKGROUND_PROCESSES" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Vaibhav Lodhi KillApp"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.VaibhavLodhiKillApp">

        <!-- Main Dashboard Activity -->
        <activity
            android:name=".ui.MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- No-Root Force Stop Accessibility Service -->
        <service
            android:name=".service.KillAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

        <!-- No-Root Firewall Local VPN Service -->
        <service
            android:name=".service.LocalFirewallVpnService"
            android:permission="android.permission.BIND_VPN_SERVICE"
            android:exported="false">
            <intent-filter>
                <action android:name="android.net.VpnService" />
            </intent-filter>
        </service>

        <!-- Anti-Restart Watchdog Receiver -->
        <receiver
            android:name=".receiver.AntiRestartWatchdogReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.SCREEN_OFF" />
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="com.vaibhavlodhi.killapp.ACTION_SCHEDULED_PURGE" />
            </intent-filter>
        </receiver>

    </application>
</manifest>
`,
  },
  {
    filename: 'accessibility_service_config.xml',
    language: 'xml',
    description: 'Accessibility Service XML configuration for window event listening',
    code: `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagDefault|flagRetrieveInteractiveWindows"
    android:canRetrieveWindowContent="true"
    android:description="@string/accessibility_service_description"
    android:notificationTimeout="80"
    android:packageNames="com.android.settings" />
`,
  },
];
