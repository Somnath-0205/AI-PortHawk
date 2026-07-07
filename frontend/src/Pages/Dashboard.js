import React from "react";

function Dashboard(props) {
    return (
        <>
            <Navbar
                target={props.target}
                setTarget={props.setTarget}
                startScan={props.startScan}
            />

            <Scancard
                scanData={props.scanData}
                threatScore={props.threatScore}
            />

            <div className="flex">
                <div>
                    <Terminal scanData={props.scanData} />

                    <Details
                        progress={props.progress}
                        targetIP={props.targetIP}
                        currentPort={props.currentPort}
                        openPorts={props.openPorts}
                        status={props.status}
                        findings={props.findings}
                        vulnerabilities={props.vulnerabilities}
                    />
                </div>

                <Assistance
                    scanData={props.scanData}
                    threatScore={props.threatScore}
                    vulnerabilities={props.vulnerabilities}
                />
            </div>

            <Footer />
        </>
    );
}

export default Dashboard;