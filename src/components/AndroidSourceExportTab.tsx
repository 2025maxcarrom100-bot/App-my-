import React, { useState } from 'react';
import { Code, Copy, Check, Download, FileCode, CheckCircle2, Terminal, FolderGit2 } from 'lucide-react';
import { ANDROID_KOTLIN_FILES } from '../data/androidKotlinCode';
import { useKillApp } from '../context/KillAppContext';

export const AndroidSourceExportTab: React.FC = () => {
  const { lang, showToast } = useKillApp();
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = ANDROID_KOTLIN_FILES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    showToast(`${activeFile.filename} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  const downloadAllAsBundle = () => {
    const bundleData = {
      project: 'Vaibhav Lodhi KillApp',
      version: '2.6.0',
      description: 'Native No-Root Android System Optimizer & Firewall',
      files: ANDROID_KOTLIN_FILES.map((f) => ({
        filename: f.filename,
        language: f.language,
        code: f.code,
      })),
    };

    const blob = new Blob([JSON.stringify(bundleData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'VaibhavLodhiKillApp_Android_Project.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded full Android Studio project specification!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Code className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-100">
              {lang === 'hi'
                ? 'Native Android Kotlin Source Code & APK Export'
                : 'Native Android Kotlin Source Code & Export'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'hi'
              ? 'Ye pure Kotlin files hain jinhe aap direct Android Studio me daalkar "Vaibhav Lodhi KillApp" ka real APK build kar sakte hain.'
              : 'Production Kotlin code ready to paste into Android Studio to compile the real APK.'}
          </p>
        </div>

        <button
          onClick={downloadAllAsBundle}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all shrink-0 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{lang === 'hi' ? 'Download Project Files' : 'Export Project Bundle'}</span>
        </button>
      </div>

      {/* Code Editor Preview */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* File Tabs */}
        <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
          {ANDROID_KOTLIN_FILES.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFileIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeFileIndex === idx
                  ? 'bg-slate-950 text-emerald-400 border border-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.filename}</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px] text-slate-300">
            {activeFile.description}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadFile(activeFile.filename, activeFile.code)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 transition-colors text-[11px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download file</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 rounded-lg flex items-center gap-1 transition-colors text-[11px] font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <pre className="p-4 text-xs font-mono text-emerald-300/90 bg-slate-950 overflow-x-auto leading-relaxed max-h-[500px]">
          <code>{activeFile.code}</code>
        </pre>
      </div>

      {/* Build & Compilation Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-emerald-400" />
          <span>
            {lang === 'hi'
              ? 'Android Studio me APK Kaise Banayein (Compilation Steps)'
              : 'How to Build in Android Studio'}
          </span>
        </h3>
        <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            <strong>New Project:</strong> Android Studio kholkar <em>Empty Activity</em> choose karein, Package Name: <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400 font-mono">com.vaibhavlodhi.killapp</code>.
          </li>
          <li>
            <strong>Add Service Files:</strong> <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400 font-mono">KillAccessibilityService.kt</code> aur <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400 font-mono">LocalFirewallVpnService.kt</code> ko <code className="text-slate-400 font-mono">app/src/main/java/com/vaibhavlodhi/killapp/service/</code> me paste karein.
          </li>
          <li>
            <strong>Manifest Configuration:</strong> <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400 font-mono">AndroidManifest.xml</code> me diye gaye services aur permissions declare karein.
          </li>
          <li>
            <strong>Build APK:</strong> Menu bar me jakar <em>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</em> par click karein.
          </li>
        </ol>
      </div>
    </div>
  );
};
