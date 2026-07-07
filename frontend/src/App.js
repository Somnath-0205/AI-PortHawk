import './App.css';
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Scancard from "./Components/Scancard";
import Terminal from "./Components/Terminal";
import Assistance from "./Components/Assistance";
import Footer from "./Components/Footer";
import Details from "./Components/Details";
import socket from "./socket/socket";
import { useEffect, useState } from "react";
import axios from "axios";
import Report from "./Pages/Report";
import Settings from "./Pages/Settings";

function App() {

const [target,setTarget]=useState("");
const [targetIP,setTargetIP]=useState("-");
const [currentPort,setCurrentPort]=useState("-");
const [openPorts,setOpenPorts]=useState(0);

const [status,setStatus]=useState("Ready");
const [progress,setProgress]=useState(0);

const [scanData,setScanData]=useState(null);

const [findings,setFindings]=useState([]);
const [vulnerabilities,setVulnerabilities]=useState([]);

const [threatScore,setThreatScore]=useState(0);

const [page,setPage]=useState("dashboard");

const [liveLogs,setLiveLogs]=useState([]);

const [isScanning,setIsScanning]=useState(false);

const startScan=async()=>{

    if(isScanning){
        alert("A scan is already running.");
        return;
    }

    setIsScanning(true);

    setProgress(0);
    setOpenPorts(0);
    setCurrentPort("-");
    setStatus("Running");

    setTargetIP("-");

    setScanData(null);

    setLiveLogs([]);

    setFindings([]);

    setVulnerabilities([]);

    setThreatScore(0);

    try{

        const response=await axios.post(
            "http://127.0.0.1:5000/scan",
            {
                target:target
            }
        );

        setScanData(response.data);

        setTargetIP(response.data.ip || response.data.target);

        setOpenPorts(response.data.total_open_ports || 0);

        setProgress(100);

        setStatus("Completed");

        setTarget("");

        // setIsScanning(false);

    }
    catch(error){

        console.log(error);

        setStatus("Failed");

        // setIsScanning(false);

    }
    finally{

    setIsScanning(false);

    }

};

useEffect(() => {

    socket.on("connect", () => {

        console.log("✅ Socket Connected");

    });

    socket.on("scan_progress", (data) => {

        setProgress(data.progress);

        setProgress(data.progress);

        if (data.progress >= 100) {

            setStatus("Completed");

        } else {

            setStatus("Running");

        }

        if (data.target) {

            setTargetIP(data.target);

        }

        if (!data.port) return;

        setCurrentPort(data.port);

        setOpenPorts(prev => prev + 1);

        setLiveLogs(prev => [

            ...prev,

            `> Port ${data.port} (${data.service}) OPEN`

        ]);

        let severity = "Low";

        if (
            data.service === "mysql" ||
            data.service === "mongodb" ||
            data.service === "microsoft-ds"
        ) {

            severity = "High";

        }
        else if (
            data.service === "http" ||
            data.service === "https"
        ) {

            severity = "Medium";

        }

        setFindings(prev => [

            {
                text: `${data.service} detected on Port ${data.port}`,
                severity
            },

            ...prev

        ]);

        let vulnerability = null;

        switch (data.service) {

            case "mysql":
                vulnerability = {
                    title: "MySQL Exposed",
                    risk: "High"
                };
                break;

            case "mongodb":
                vulnerability = {
                    title: "MongoDB Exposed",
                    risk: "High"
                };
                break;

            case "microsoft-ds":
                vulnerability = {
                    title: "SMB Exposure",
                    risk: "High"
                };
                break;

            case "http":
                vulnerability = {
                    title: "HTTP Service",
                    risk: "Medium"
                };
                break;

            case "https":
                vulnerability = {
                    title: "HTTPS Service",
                    risk: "Low"
                };
                break;

            default:
                break;

        }

        if (vulnerability) {

            setVulnerabilities(prev => {

                const exists = prev.some(

                    item => item.title === vulnerability.title

                );

                if (exists) return prev;

                return [vulnerability, ...prev];

            });

        }

        let score = 0;

        switch (data.service) {

            case "microsoft-ds":
                score = 25;
                break;

            case "mysql":
                score = 20;
                break;

            case "mongodb":
                score = 20;
                break;

            case "http":
                score = 10;
                break;

            case "https":
                score = 5;
                break;

            case "ftp":
                score = 20;
                break;

            case "telnet":
                score = 30;
                break;

            case "ssh":
                score = 5;
                break;

            case "rdp":
                score = 15;
                break;

            default:
                score = 0;

        }

        if (score > 0) {

            setThreatScore(prev => Math.min(prev + score, 100));

        }

    });

    return () => {

        socket.off("connect");

        socket.off("scan_progress");

    };

}, []);


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <div className="flex">
        <Sidebar setPage={setPage} isScanning={isScanning} />
            <div>

                {page === "dashboard" && (
                    <>
                        <Navbar
                            target={target}
                            setTarget={setTarget}
                            startScan={startScan}
                            isScanning={isScanning}
                        />

                        <Scancard
                            scanData={scanData}
                            threatScore={threatScore}
                        />

                        <div className="flex">

                            <div>

                                <Terminal  
                                scanData={scanData}
                                liveLogs={liveLogs}
                                setLiveLogs={setLiveLogs} />

                                <Details
                                    progress={progress}
                                    targetIP={targetIP}
                                    currentPort={currentPort}
                                    openPorts={openPorts}
                                    status={status}
                                    scanData={scanData}
                                    findings={findings}
                                    vulnerabilities={vulnerabilities}
                                />

                            </div>

                            <Assistance
                                scanData={scanData}
                                threatScore={threatScore}
                                vulnerabilities={vulnerabilities}
                            />
                            

                        </div>

                    </>

                )}
                {page === "report" && (

                        <Report
                            scanData={scanData}
                            threatScore={threatScore}
                            vulnerabilities={vulnerabilities}
                        />
                )}
                {page === "settings" && (

                    <Settings />

                )}
            </div>
        </div>
      <Footer />
    </div>
  );
}

export default App;
