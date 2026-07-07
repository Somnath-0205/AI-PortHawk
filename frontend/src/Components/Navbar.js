import React from 'react'
import { IoNotificationsOutline } from "react-icons/io5"; 
import { MdDarkMode } from "react-icons/md";            
import { FaUserCircle } from "react-icons/fa";            
import { IoChevronDown } from "react-icons/io5"; 


function Navbar({ target, setTarget, startScan, isScanning }) {

    return(
        <div className="h-[55px] w-[1040px] mt-4 ml-3 flex items-center">
            <div className="flex">
                <h3 className="font-serif font-semibold ml-2 mt-1 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/30">Scan Target</h3>
                <form className="d-flex ml-2" role="search">
                    <input 
                    value={target}
                    onChange={(e)=>setTarget(e.target.value)}
                    disabled={isScanning}
                    className="w-52 border border-black rounded-md outline-none focus:outline-none focus:ring-0 font-serif" type="search" placeholder="Enter IP or Domain..."/>
                    <button type="button" onClick={startScan} className=" h-7 w-20 ml-2 rounded-full text-center font-serif text-white focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400">{isScanning ? "Scanning..." : "Start Scan"}</button>
                </form>
            </div>
            {/* <div className="flex ml-auto mr-8 gap-6">
                <div className="text-2xl hover:text-yellow-400 hover:rotate-180 transition-all"><IoNotificationsOutline /></div>
                <div className="text-2xl text-slate-300 hover:text-yellow-400 cursor-pointer transition-all"><MdDarkMode /></div>
                <div className="flex gap-2">
                    <div className="text-2xl"><FaUserCircle /></div>
                    <div>USERNAME</div>
                </div>
            </div> */}
        </div>
    )
}

export default Navbar;