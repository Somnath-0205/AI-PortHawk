import React from "react";
import axios from "axios";

function Report({ scanData, threatScore = 0, vulnerabilities = [] }) {
  
  const getRiskLevel = () => {
    if (threatScore >= 80) return "CRITICAL";
    if (threatScore >= 60) return "HIGH";
    if (threatScore >= 40) return "MEDIUM";
    if (threatScore >= 20) return "LOW";
    return "SAFE";
  };

  const getGrade = () => {
    if (threatScore >= 90) return "F";
    if (threatScore >= 75) return "D";
    if (threatScore >= 60) return "C";
    if (threatScore >= 40) return "B";
    if (threatScore >= 20) return "A";
    return "A+";
  };

  const riskColor = () => {
    if (threatScore >= 80) return "text-red-500";
    if (threatScore >= 60) return "text-orange-400";
    if (threatScore >= 40) return "text-yellow-400";
    if (threatScore >= 20) return "text-cyan-400";
    return "text-green-400";
  };

  const recommendation = () => {
    if (threatScore >= 80)
      return "Immediate remediation is required. Multiple critical services are publicly exposed.";
    if (threatScore >= 60)
      return "High risk detected. Restrict exposed services and apply security patches.";
    if (threatScore >= 40)
      return "Moderate risk detected. Review firewall rules and service configuration.";
    return "Target appears relatively secure. Continue regular monitoring.";
  };

  const downloadReport = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-report",
        {
          target: scanData?.target,
          hostname: scanData?.hostname,
          host_status: scanData?.host_status,
          total_open_ports: scanData?.total_open_ports,
          scan_time: scanData?.scan_time,
          threat_score: threatScore,
          vulnerabilities: vulnerabilities,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "AI-PortHawk_Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <div className="w-[1040px] p-6 text-white font-serif">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI-PortHawk Security Report
          </h1>
          <p className="text-slate-400 mt-2">
            Enterprise Network Security Assessment Report
          </p>
        </div>
        <button
          onClick={downloadReport}
          className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition"
        >
          Download PDF
        </button>
      </div>

      {/* Top Stats Grid Container */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Threat Score</p>
          <h1 className={`text-5xl font-bold mt-3 ${riskColor()}`}>
            {threatScore}
          </h1>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Risk Level</p>
          <h1 className={`text-3xl font-bold mt-4 ${riskColor()}`}>
            {getRiskLevel()}
          </h1>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Security Grade</p>
          <h1 className="text-5xl font-bold text-cyan-400 mt-2">{getGrade()}</h1>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Open Ports</p>
          <h1 className="text-5xl font-bold text-white mt-2">
            {scanData?.total_open_ports || 0}
          </h1>
        </div>
      </div> {/* Fixed: Added missing closure for the stats grid container */}

      {/* Executive Summary */}
      <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Executive Summary
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Target</span>
              <span>{scanData?.target || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Resolved IP</span>
              <span>{scanData?.ip || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Hostname</span>
              <span>{scanData?.hostname || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Host Status</span>
              <span className="text-green-400">{scanData?.host_status || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Scan Time</span>
              <span>{scanData?.scan_time || 0}s</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Open Ports</span>
              <span>{scanData?.total_open_ports || 0}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Critical Findings</span>
              <span className="text-red-400">{vulnerabilities?.length || 0}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Risk Level</span>
              <span className={riskColor()}>{getRiskLevel()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Security Grade</span>
              <span className="text-cyan-400">{getGrade()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Scanner</span>
              <span>AI-PortHawk v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure & Technology Grid */}
      <div className="mt-8 grid grid-cols-2 gap-5">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-5">
            Infrastructure Detection
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Docker</span>
              <span className={scanData?.scan_result?.some((p) => p.docker === "Yes") ? "text-green-400" : "text-red-400"}>
                {scanData?.scan_result?.some((p) => p.docker === "Yes") ? "Detected" : "Not Detected"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Kubernetes</span>
              <span className={scanData?.scan_result?.some((p) => p.kubernetes === "Yes") ? "text-green-400" : "text-red-400"}>
                {scanData?.scan_result?.some((p) => p.kubernetes === "Yes") ? "Detected" : "Not Detected"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>TLS / SSL</span>
              <span className={scanData?.scan_result?.some((p) => p.tls === "Yes") ? "text-green-400" : "text-red-400"}>
                {scanData?.scan_result?.some((p) => p.tls === "Yes") ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cloud Platform</span>
              <span>{scanData?.cloud || "Unknown"}</span>
            </div>
            <div className="flex justify-between">
              <span>Host Type</span>
              <span>{scanData?.target_type || "-"}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-5">
            Technology Detection
          </h2>
          <div className="space-y-3">
            {scanData?.scan_result?.length > 0 ? (
              scanData.scan_result.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-slate-700 pb-2">
                  <span>Port {item.port}</span>
                  <span>{item.web_server || item.service || "Unknown"}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400">No technologies detected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Port Enumeration Table */}
      <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-5">
          Port Enumeration
        </h2>
        <div className="grid grid-cols-7 bg-slate-800 rounded-lg px-4 py-3 font-bold text-cyan-400">
          <span>PORT</span>
          <span>SERVICE</span>
          <span>WEB</span>
          <span>TLS</span>
          <span>DOCKER</span>
          <span>K8S</span>
          <span>CVE</span>
        </div>
        {scanData?.scan_result?.map((item, index) => (
          <div key={index} className="grid grid-cols-7 px-4 py-3 border-b border-slate-800 hover:bg-slate-800/40 transition">
            <span>{item.port}</span>
            <span>{item.service || "-"}</span>
            <span>{item.web_server || "-"}</span>
            <span>{item.tls || "No"}</span>
            <span>{item.docker || "No"}</span>
            <span>{item.kubernetes || "No"}</span>
            <span className="text-red-400">{item.cve || "-"}</span>
          </div>
        ))}
      </div>

      {/* Vulnerabilities & AI Security Summary */}
      <div className="mt-8 grid grid-cols-2 gap-5">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-5">
            Detected Vulnerabilities
          </h2>
          {!vulnerabilities || vulnerabilities.length === 0 ? (
            <div className="text-green-400 font-semibold">
              ✔ No Critical Vulnerabilities Detected
            </div>
          ) : (
            vulnerabilities.map((item, index) => (
              <div key={index} className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{item.title}</h3>
                  <span className={
                    item.risk === "High" ? "text-red-400 font-bold" : 
                    item.risk === "Medium" ? "text-yellow-400 font-bold" : "text-green-400 font-bold"
                  }>
                    {item.risk}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Potential security exposure detected during enumeration.
                </p>
              </div>
            ))
          )}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-5">
            AI Security Summary
          </h2>
          <div className="space-y-4">
            <div>
              <span className="text-slate-400">Overall Risk</span>
              <h2 className={`text-3xl font-bold mt-2 ${riskColor()}`}>
                {getRiskLevel()}
              </h2>
            </div>
            <div>
              <span className="text-slate-400">Security Grade</span>
              <h2 className="text-4xl text-cyan-400 font-bold mt-2">
                {getGrade()}
              </h2>
            </div>
            <p className="leading-7 text-slate-300">{recommendation()}</p>
          </div>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-5">
          Security Recommendations
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-lg p-4">✔ Close unnecessary open ports</div>
          <div className="bg-slate-800 rounded-lg p-4">✔ Enable Firewall Protection</div>
          <div className="bg-slate-800 rounded-lg p-4">✔ Keep operating system updated</div>
          <div className="bg-slate-800 rounded-lg p-4">✔ Apply latest security patches</div>
          <div className="bg-slate-800 rounded-lg p-4">✔ Disable SMB if unused</div>
          <div className="bg-slate-800 rounded-lg p-4">✔ Enable HTTPS & TLS</div>
          <div className="bg-slate-800 rounded-lg p-4">✔ Restrict database access</div>
          <div className="bg-slate-800 rounded-lg p-4">✔ Perform periodic vulnerability scans</div>
        </div>
      </div>

      {/* Final Security Verdict Banner */}
      <div className="mt-8 bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900 rounded-xl border border-cyan-500 p-6">
        <h2 className="text-3xl font-bold text-cyan-300">Final Security Verdict</h2>
        <p className="mt-4 text-lg leading-8 text-slate-200">
          This assessment was performed using AI-PortHawk's intelligent reconnaissance engine.
          The host was analyzed for exposed services, fingerprinting, infrastructure detection,
          banner analysis, TLS configuration, Docker, Kubernetes, SMB exposure and known security risks.
          Based on the discovered attack surface, the overall security posture is classified as
          <span className={`font-bold ml-2 ${riskColor()}`}> {getRiskLevel()}</span>.
          Immediate remediation should focus on reducing exposed services, patching vulnerable applications,
          strengthening authentication and regularly monitoring the environment.
        </p>
      </div>
    </div>
  );
}

export default Report;