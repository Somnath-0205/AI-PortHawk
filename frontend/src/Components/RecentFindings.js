import React from "react";
import { FaInfoCircle } from "react-icons/fa";

function RecentFindings({ findings }) {

    return (

        <div className="w-full h-[190px] bg-slate-900 border border-slate-700 rounded-xl p-3 text-white flex flex-col">

            {/* Header */}

            <div className="flex justify-between items-center mb-3">

                <h2 className="text-[11px] font-bold uppercase tracking-wide font-serif">
                    Recent Findings
                </h2>

                <FaInfoCircle className="text-slate-500 text-xs" />

            </div>

            {/* Findings */}

            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 space-y-2 font-serif">

                {findings.length === 0 ? (

                    <p className="text-slate-400 text-xs italic">
                        Waiting for findings...
                    </p>

                ) : (

                    findings
                        .slice(0, 5)
                        .map((item, index) => (

                            <div
                                key={index}
                                className="flex justify-between items-start border-b border-slate-800 pb-2"
                            >

                                <span className="text-xs text-white break-words w-[75%]">

                                    {item.text}

                                </span>

                                <span
                                    className={`text-[10px] px-2 py-1 rounded-full font-semibold whitespace-nowrap
                                    ${
                                        item.severity === "High"
                                            ? "bg-red-500/20 text-red-400"
                                            : item.severity === "Medium"
                                            ? "bg-yellow-500/20 text-yellow-300"
                                            : "bg-green-500/20 text-green-400"
                                    }`}
                                >

                                    {item.severity}

                                </span>

                            </div>

                        ))

                )}

            </div>

        </div>

    );

}

export default RecentFindings;