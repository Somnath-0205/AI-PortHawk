import React from "react";
import { FaCircle } from "react-icons/fa";

function Footer() {

    return (

        <div className="w-[1240px] h-[60px] mt-4 font-serif bg-slate-900/60 backdrop-blur-xl border-t border-slate-700 flex justify-between items-center px-6 text-sm text-slate-300">

            <div className="flex items-center gap-6">

                <span>Created By : Somnath_02_05</span>

                <span>Engine : Python Scanner</span>

            </div>

            <div className="flex items-center gap-6">

                <span>Version 1.0.0</span>

                <span>© 2026 AI-PortHawk</span>

            </div>

        </div>

    );

}

export default Footer;