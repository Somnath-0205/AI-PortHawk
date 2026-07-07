import React from "react";
import { FaHome, FaChartLine, FaSearch, FaCloud, FaFileAlt, FaCog, FaShieldAlt} from "react-icons/fa";
import { MdMonitorHeart } from "react-icons/md";
import { useState } from "react";

function Sidebar({ setPage, isScanning }) {
    const menu = [
        {
            id: 1,
            icon: <FaHome />,
            name: "Dashboard"
        },
        { 
            id: 2,
            icon: <FaFileAlt />,
            name: "Report"
        },
        {
            id: 3,
            icon: <FaCog />,
            name: "Settings"
        }
    ];

    const [activeMenu, setActiveMenu] = useState("Dashboard");

    return(
        <div id="sidebar" className="w-[190px] h-[600px] text-black bg-slate-900/40 backdrop-blur-md border-r border-slate-700/50 mt-2 ml-3">
            <div className="mt-5 ml-7">
                <h3 className="font-bold font-sans gap-2 flex bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"><FaShieldAlt className=" gap-x-2 text-cyan-400 text-xl drop-shadow-[0_0_8px_#22d3ee]"/>AI-PortHawk</h3>
                <h2 className="font-normal font-serif text-sm ml-6 tracking-widest text-slate-400">Port Scanner</h2>
            </div>
            <div className="mt-8 ml-8">
                {menu.map((item) => (
                    <div key={item.name} 
                            onClick={() => {

                                if(isScanning){

                                    alert("⚠️ Scan is in progress. Please wait until it finishes.");

                                    return;

                                }

                                setActiveMenu(item.name);

                                setPage(item.name.toLowerCase());

                            }}
                        className={`w-36 flex items-center font-serif p-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-l-4 hover:border-cyan-400 hover:text-cyan-300 ${
                                item.name === activeMenu
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-300"
                            }`}>
                        <span className="mt-1">{item.icon}</span>
                        <span className="ml-2">{item.name}</span>
                    </div>
                ))}
            </div>
            {/* <div className="w-[150px] h-[150px] text-white ml-4 mt-16 border border-black">

            </div> */}
        </div>
    );
}

export default Sidebar;