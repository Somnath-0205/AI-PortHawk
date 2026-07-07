import React, { useState, useEffect } from "react";
import { FaTerminal } from "react-icons/fa";
// import socket from "../socket/socket";

function Terminal({scanData, liveLogs, setLiveLogs}) {

    const [selectedPort, setSelectedPort] = useState(null);

    const [activeTab, setActiveTab] = useState("live");

    useEffect(() => {

        if (scanData && scanData.scan_result.length > 0) {

            setSelectedPort(scanData.scan_result[0]);

        }

    }, [scanData]);

    return (

        <div className="w-[704px] h-[330px] ml-3 mt-2 bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden">

            {/* Header */}

            <div className="h-12 border-b border-slate-700 flex items-center justify-between px-5">

                <div className="flex items-center gap-3">
                    <FaTerminal className="text-cyan-400" />

                    <h2 className="text-white font-semibold font-serif">
                        Terminal
                    </h2>
                </div>

                <div className="flex gap-2">

                    <button
                        onClick={() => setActiveTab("live")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            activeTab === "live"
                                ? "bg-cyan-500 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                    >
                        LIVE
                    </button>

                    <button
                        onClick={() => setActiveTab("report")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            activeTab === "report"
                                ? "bg-cyan-500 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                    >
                        REPORT
                    </button>

                </div>

            </div>

            {/* Body */}

            <div className="h-[278px] overflow-y-auto p-4 font-serif text-xs">

                {activeTab === "live" ? (

                        <div className="space-y-2 text-green-400">

                            {liveLogs.length === 0 ? (

                                <p className="text-green-400">
                                    &gt; Waiting for Live Scan...
                                </p>

                            ) : (

                                liveLogs.map((log, index) => (

                                    <p key={index}>
                                        {log}
                                    </p>

                                ))

                            )}

                        </div>

                    ) : (
                    !scanData ? (

                        <p className="text-green-400">
                            No Scan Report Available
                        </p>

                    ) : (

                        <>

                            {/* Scan Summary */}

                            <div className="space-y-1 text-green-400">

                                <p>&gt; Scan Completed</p>

                                <p>
                                    &gt; Host :
                                    <span className="text-white ml-2">
                                        {scanData.hostname}
                                    </span>
                                </p>

                                <p>
                                    &gt; Status :
                                    <span className="text-green-300 ml-2">
                                        {scanData.host_status}
                                    </span>
                                </p>

                                <p>
                                    &gt; Open Ports :
                                    <span className="text-cyan-400 ml-2">
                                        {scanData.total_open_ports}
                                    </span>
                                </p>

                            </div>

                            <hr className="border-slate-700 my-4" />

                            {/* Table */}

                            <div className="grid grid-cols-3 bg-slate-800 rounded-md px-3 py-2 text-cyan-400 font-semibold">

                                <span>PORT</span>

                                <span>SERVICE</span>

                                <span>STATUS</span>

                            </div>

                            {scanData.scan_result.map((item) => (

                                <div
                                    key={item.port}
                                    onClick={() => setSelectedPort(item)}
                                    className={`grid grid-cols-3 px-3 py-2 border-b border-slate-800 cursor-pointer transition-all duration-200 ${
                                        selectedPort?.port === item.port
                                            ? "bg-cyan-900/40 border-l-4 border-cyan-400"
                                            : "hover:bg-slate-800/40"
                                    }`}
                                >

                                    <span className="text-white">
                                        {item.port}
                                    </span>

                                    <span className="text-slate-300">
                                        {item.service || "Unknown"}
                                    </span>

                                    <span className="text-green-400 font-semibold">
                                        OPEN
                                    </span>

                                </div>

                            ))}

                            {/* Details */}

                            <div className="mt-6 border-t border-slate-700 pt-4">

                                <h3 className="text-cyan-400 font-semibold mb-3">
                                    Detailed Information
                                </h3>

                                {selectedPort && (

                                    <div className="grid grid-cols-2 gap-y-2">

                                        <span className="text-slate-400">Port</span>
                                        <span className="text-white">{selectedPort.port}</span>

                                        <span className="text-slate-400">Service</span>
                                        <span className="text-white">
                                            {selectedPort.service || "-"}
                                        </span>

                                        <span className="text-slate-400">Version</span>
                                        <span className="text-white">
                                            {selectedPort.version || "-"}
                                        </span>

                                        <span className="text-slate-400">Banner</span>
                                        <span className="text-white break-all">
                                            {selectedPort.banner || "No Banner"}
                                        </span>

                                        <span className="text-slate-400">Technologies</span>
                                        <span className="text-white">
                                        {
                                        selectedPort.technology?.technologies?.length > 0
                                            ? selectedPort.technology.technologies.join(", ")
                                            : "-"
                                        }
                                        </span>

                                        <span className="text-slate-400">Cloud</span>
                                        <span className="text-white">
                                            {selectedPort.cloud || "Unknown"}
                                        </span>

                                        <span className="text-slate-400">Fingerprint</span>
                                        <span className="text-white">
                                            {selectedPort.fingerprint?.service_name || "-"}
                                        </span>

                                        <span className="text-slate-400">TLS</span>
                                        <span className="text-white">
                                            {selectedPort.tls
                                                ? selectedPort.tls.tls_version
                                                : "No"}
                                        </span>

                                        <span className="text-slate-400">Framework</span>
                                        <span className="text-white">
                                            {selectedPort.fingerprint?.framework || "-"}
                                        </span>

                                        <span className="text-slate-400">Language</span>
                                        <span className="text-white">
                                            {selectedPort.fingerprint?.language || "-"}
                                        </span>

                                        <span className="text-slate-400">Docker</span>
                                        <span className="text-white">
                                            {selectedPort.docker?.detected
                                                ? "Detected"
                                                : "No"}
                                        </span>

                                        <span className="text-slate-400">Kubernetes</span>
                                        <span className="text-white">
                                            {selectedPort.kubernetes?.detected
                                                ? "Detected"
                                                : "No"}
                                        </span>

                                        <span className="text-slate-400">SMB</span>
                                        <span className="text-white">
                                            {selectedPort.smb?.reachable ? "Accessible" : "No"}
                                        </span> 

                                        <span className="text-slate-400">CVE</span>
                                        <span className="text-red-400">
                                            {selectedPort.cves?.length > 0
                                                ? selectedPort.cves[0].cve
                                                : "-"}
                                        </span>

                                    </div>

                                )}

                            </div>

                            <p className="mt-6 text-cyan-400">
                                &gt; Scan Finished ✔
                            </p>

                        </>

                    )

                )}

            </div>

        </div>

    );

}

export default Terminal;