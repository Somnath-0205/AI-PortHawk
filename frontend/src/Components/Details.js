import React from "react";
import LiveMonitor from "./LiveMonitor";
import RecentFindings from "./RecentFindings";
import TopVulnerability from "./TopVulnerability";

function Details({progress, targetIP, currentPort, openPorts, status, scanData, findings, vulnerabilities}) {
    return(
        <div className="h-[190px] w-[704px] ml-3 mt-2 grid grid-cols-3 gap-3">
            <LiveMonitor progress={progress} targetIP={targetIP} currentPort={currentPort} openPorts={openPorts} status={status}/>
            <RecentFindings findings={findings}/>
            <TopVulnerability vulnerabilities={vulnerabilities}/>
        </div>
    );
}


export default Details;