import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";
import axios from "axios";

function Assistance({scanData, threatScore, vulnerabilities}) {

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "👋 Hello Hacker! I'm AI-PortHawk Assistant.\nAsk me anything about your scan, ports, vulnerabilities or cybersecurity."
        }
    ]);

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const askSuggestion = (text) => {
        setQuestion(text);
    };

    const sendMessage = async () => {

        if (!question.trim()) return;

        const userQuestion = question;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: userQuestion
            }
        ]);

        setQuestion("");

        try {

            const response = await axios.post(
                "http://127.0.0.1:5000/assistant",
                {
                    question: userQuestion,

                    scan_result: scanData ? scanData.scan_result : [],

                    threat_score: threatScore,

                    vulnerabilities: vulnerabilities
                }
            );

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: response.data.answer
                }
            ]);

        }

        catch {

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: "❌ Unable to contact AI Assistant."
                }
            ]);

        }

    };

    return (

        <div className="w-[324px] h-[528px] ml-3 mt-2 rounded-2xl border border-slate-700 bg-slate-900/60 backdrop-blur-xl flex flex-col overflow-hidden font-serif">

            {/* Header */}

            <div className="flex items-center gap-3 p-4 border-b border-slate-700">

                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex justify-center items-center">

                    <FaRobot className="text-white"/>

                </div>

                <div>

                    <h2 className="text-white font-bold">

                        AI Assistant

                    </h2>

                    <p className="text-xs text-slate-400">

                        Cyber Security Analyst

                    </p>

                </div>

            </div>

            {/* Suggestions */}

            <div className="px-3 pt-3">

                <div className="flex flex-wrap gap-2">

                    <button
                        onClick={() => askSuggestion("Analyze my scan")}
                        className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-cyan-300"
                    >
                        Analyze Scan
                    </button>

                    <button
                        onClick={() => askSuggestion("Explain port 445")}
                        className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-cyan-300"
                    >
                        Explain Port
                    </button>

                    <button
                        onClick={() => askSuggestion("Explain SQL Injection")}
                        className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-cyan-300"
                    >
                        SQL Injection
                    </button>

                    <button
                        onClick={() => askSuggestion("Generate security recommendations")}
                        className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-cyan-300"
                    >
                        Recommendations
                    </button>

                </div>

            </div>

            {/* Chat */}

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">

                {messages.map((msg, index) => (

                    <div
                        key={index}
                        className={`flex ${
                            msg.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >

                        <div
                            className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                                msg.sender === "user"
                                    ? "bg-cyan-600 text-white"
                                    : "bg-slate-800 text-slate-100"
                            }`}
                        >

                            {msg.text}

                        </div>

                    </div>

                ))}

                <div ref={chatEndRef}></div>

            </div>

            {/* Input */}

            <div className="border-t border-slate-700 p-3">

                <div className="flex gap-2">

                    <input

                        value={question}

                        onChange={(e) => setQuestion(e.target.value)}

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                sendMessage();

                            }

                        }}

                        className="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-white outline-none"

                        placeholder="Ask about cybersecurity..."

                    />

                    <button

                        onClick={sendMessage}

                        className="w-11 rounded-lg bg-cyan-500 hover:bg-cyan-600 flex justify-center items-center"

                    >

                        <FaPaperPlane/>

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Assistance;