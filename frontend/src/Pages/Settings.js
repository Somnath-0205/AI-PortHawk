import React, { useState, useEffect } from "react";

function Settings() {
  const [theme, setTheme] = useState("Dark");
  const [accent, setAccent] = useState("Cyan");
  const [notifyScan, setNotifyScan] = useState(true);
  const [notifyRisk, setNotifyRisk] = useState(true);
  const [exportType, setExportType] = useState("PDF");

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("aiporthawk");
      if (storedData) {
        const settings = JSON.parse(storedData);
        if (settings) {
          setTheme(settings.theme || "Dark");
          setAccent(settings.accent || "Cyan");
          setNotifyScan(settings.notifyScan !== false);
          setNotifyRisk(settings.notifyRisk !== false);
          setExportType(settings.exportType || "PDF");
        }
      }
    } catch (error) {
      console.error("Failed to parse system configuration from storage:", error);
    }
  }, []);

  const saveSettings = () => {
    try {
      localStorage.setItem(
        "aiporthawk",
        JSON.stringify({
          theme,
          accent,
          notifyScan,
          notifyRisk,
          exportType,
        })
      );
      alert("Settings Saved Successfully");
    } catch (error) {
      console.error("Failed to persist security configuration options:", error);
    }
  };

  const resetSettings = () => {
    setTheme("Dark");
    setAccent("Cyan");
    setNotifyScan(true);
    setNotifyRisk(true);
    setExportType("PDF");
    localStorage.removeItem("aiporthawk");
  };

  return (
    <div className="w-[1040px] p-8 text-white tracking-wide bg-[#0b1329] font-serif">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
        Settings
      </h1>
      <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-semibold">
        Configure AI-PortHawk Preferences
      </p>

      <div className="grid grid-cols-2 gap-5 mt-8">

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span> Appearance
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-slate-400 font-medium">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="Dark">Dark</option>
                <option value="Cyber Blue">Cyber Blue</option>
                <option value="Midnight">Midnight</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400 font-medium">
                Accent Color
              </label>
              <select
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="Cyan">Cyan</option>
                <option value="Green">Green</option>
                <option value="Purple">Purple</option>
                <option value="Red">Red</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span> Notifications
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between items-center bg-slate-800/20 p-3 rounded-lg border border-slate-800/40">
              <span className="text-sm text-slate-300">Scan Complete</span>
              <input
                type="checkbox"
                checked={notifyScan}
                onChange={(e) => setNotifyScan(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded border-slate-700 bg-slate-800 text-cyan-500 cursor-pointer focus:ring-0"
              />
            </div>

            <div className="flex justify-between items-center bg-slate-800/20 p-3 rounded-lg border border-slate-800/40">
              <span className="text-sm text-slate-300">High Risk Alerts</span>
              <input
                type="checkbox"
                checked={notifyRisk}
                onChange={(e) => setNotifyRisk(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded border-slate-700 bg-slate-800 text-cyan-500 cursor-pointer focus:ring-0"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400 font-medium">
                Default Export
              </label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="PDF">PDF</option>
                <option value="JSON">JSON</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-5">
        {/* Scanner Information Read-Only Section */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span> Scanner Information
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Scanner Engine</span>
              <span className="text-cyan-400 font-semibold">AI-PortHawk v1.0</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Threads</span>
              <span className="font-mono text-slate-200">200</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Port Range</span>
              <span className="font-mono text-slate-200">1 - 65535</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Banner Grabbing</span>
              <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded text-xs">
                Enabled
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Service Detection</span>
              <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded text-xs">
                Enabled
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">TLS Detection</span>
              <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded text-xs">
                Enabled
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Docker Detection</span>
              <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded text-xs">
                Enabled
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Kubernetes Detection</span>
              <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded text-xs">
                Enabled
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Cloud Detection</span>
              <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded text-xs">
                Enabled
              </span>
            </div>
          </div>
        </div>

        {/* System Meta-Information Panel */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span> About AI-PortHawk
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Version</span>
              <span className="text-slate-200">1.0.0</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Frontend</span>
              <span className="text-slate-200">React.js</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Backend</span>
              <span className="text-slate-200">Flask</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Language</span>
              <span className="text-slate-200">Python</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Communication</span>
              <span className="text-slate-200">Socket.IO</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Framework</span>
              <span className="text-slate-200">Tailwind CSS</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Developer</span>
              <span className="text-slate-200">Somnath Bera</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistence Controls Footer */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={resetSettings}
          className="px-6 py-2.5 rounded-lg font-bold bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition duration-200"
        >
          Reset Default
        </button>
        <button
          onClick={saveSettings}
          className="px-6 py-2.5 rounded-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition duration-200"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;