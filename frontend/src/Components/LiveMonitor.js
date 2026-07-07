import React from "react";
import { FaInfoCircle } from "react-icons/fa";

function LiveMonitor({ progress, targetIP, currentPort, openPorts, status }) {

    return (
        
        <div className="w-full h-[190px] bg-slate-900 rounded-xl border border-slate-700 p-3 text-white font-serif">

            {/* Header */}

            <div className="flex justify-between items-center">

                <h2 className="text-[11px] font-bold uppercase tracking-wide">
                    Live Scan
                </h2>

                <FaInfoCircle className="text-slate-500 text-xs" />

            </div>

            {/* Target */}

            <p className="text-cyan-400 text-xs mt-3">

                Scanning {targetIP}

            </p>

            {/* Progress */}

            <div className="mt-3">

                <div className="flex justify-between text-[10px] mb-1">

                    <span>Progress</span>

                    <span>{progress}%</span>

                </div>

                <div className="w-full h-2 rounded-full bg-slate-700">

                    <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${progress}%` }}
                    ></div>

                </div>

            </div>

            {/* Info */}

            <div className="mt-4 text-[11px] space-y-2">

                <div className="flex justify-between">
                    <span>
                        Current Port
                    </span>

                    {currentPort}

                </div>

                <div className="flex justify-between">

                    <span className="text-slate-400 text-sm">

                        Status

                    </span>

                    <span className={
                        status === "Completed"
                            ? "text-green-400"
                            : "text-cyan-400"
                        }>
                        {status}
                    </span>

                </div>

            </div>

        </div>

    );

}

export default LiveMonitor;