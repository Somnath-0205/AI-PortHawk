import React from "react";
import Card from "./Card";

function Scancard({ scanData, threatScore }) {

    let risk = "SAFE";
    let threatColor = "text-white";

    if (threatScore >= 80) {
        risk = "CRITICAL";
        threatColor = "text-white";
    }
    else if (threatScore >= 60) {
        risk = "HIGH";
        threatColor = "text-orange-400";
    }
    else if (threatScore >= 40) {
        risk = "MEDIUM";
        threatColor = "text-yellow-400";
    }
    else if (threatScore >= 20) {
        risk = "LOW";
        threatColor = "text-green-300";
    }
    const menu = [
        {
            id: 1,
            title: "Threat Score",
            value: `${threatScore}%`,
            risk: risk,
            threatColor: threatColor,
            color: "from-red-500 to-orange-500"
        },
        {
            id: 2,
            title: "Open Ports",
            value: scanData ? scanData.total_open_ports : 0,
            color: "from-cyan-500 to-blue-600"
        },
        {
            id: 3,
            title: "Scan Time",
            value: scanData ? `${scanData.scan_time}s` : "0.00s",
            color: "from-violet-500 to-purple-600"
        },
        {
            id: 4,
            title: "Critical CVEs",
            value: scanData?.scan_result?.filter(item => item.cve && item.cve !== "-").length || 0,
            color: "from-pink-500 to-red-600"
        }
    ];
    return(
        <div className="h-[120px] w-[1040px] mt-2 ml-3">
            <div className="grid grid-cols-4 gap-3 font-serif">
                {menu.map((item) => (
                    <Card 
                    key={item.id}
                    title={item.title}
                    value={item.value}
                    risk={item.risk}
                    threatColor={item.threatColor}
                    color={item.color}
                    />
                ))}
            </div>
        </div>
    );
}

export default Scancard;