import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Monitor, 
  Settings, 
  CheckCircle, 
  Activity, 
  Play, 
  Palette, 
  Type, 
  QrCode, 
  ChevronRight, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  Database,
  Sliders,
  Sparkles,
  Printer
} from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

interface SoftwareServiceNode {
  id: string;
  number: string;
  name: string;
  subtext: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
}

export default function ITSolutions() {
  
  // Orbit angle state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Enquiry Form State
  const [enquirySoftware, setEnquirySoftware] = useState("SAC - Smart AI Campus");
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryMobile, setEnquiryMobile] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryTime, setEnquiryTime] = useState("09:00 AM - 12:00 PM");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2 Core Software Services
  const services: SoftwareServiceNode[] = [
    { 
      id: "ser-sac", 
      number: "S01", 
      name: "SAC - Smart AI Campus", 
      subtext: "Intelligent RFID logins & campus flow tracking", 
      description: "A comprehensive control system designed for academic and corporate campuses. Integrates automated attendance, RFID card scanners, and live check-in telemetry fields into a unified digital station.",
      benefits: [
        "Instant RFID-backed check-in logs",
        "Secure micro-credential administration",
        "Pre-integrated visitor flow monitors"
      ],
      icon: <Database className="w-5 h-5" /> 
    },
    { 
      id: "ser-ecomm", 
      number: "S02", 
      name: "E-Commerce", 
      subtext: "White-labeled school & corporate online stores", 
      description: "Highly optimized customer webstores built for school uniforms, customized printed lanyards, and credential accessories, enabling fast ordering with pre-negotiated volume limits.",
      benefits: [
        "Custom branded school catalog systems",
        "Bulk invoice processing & express production",
        "Direct synchronization with factory schedules"
      ],
      icon: <Monitor className="w-5 h-5" /> 
    }
  ];

  // Orbit rotation interval
  useEffect(() => {
    if (hoveredNodeId !== null) return;
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 0.25) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [hoveredNodeId]);

  // Smooth scroll and prefill Enquiry dropdown trigger
  const triggerEnquiry = (softwareName: string) => {
    setEnquirySoftware(softwareName);
    const formElement = document.getElementById("enquiry-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryMobile || !enquiryEmail) {
      alert("Please fill in all required enquiry parameters.");
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEnquiryName("");
      setEnquiryMobile("");
      setEnquiryEmail("");
    }, 5000);
  };

  return (
    <div id="it-solutions-page" className="gotek-page bg-[#f7f6f1] pt-32 pb-24 px-6 md:px-12 select-none font-sans overflow-x-hidden relative">
      
      {/* Background visual graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.03] bg-red-600 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12 md:gap-16 relative z-10">
        
        {/* UPPER TITLE: SIMPLE WORDING & RED HIGHLIGHT */}
        <div className="max-w-3xl text-left flex flex-col gap-4">
          <span className="text-xs uppercase tracking-[3px] text-red-600 font-bold px-3 py-1 bg-white border border-zinc-200 w-fit">
            Custom Software Tools
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-red-600 leading-none">
            IT & Software Solutions
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed font-light mt-1">
            We develop simple, human-friendly tools to cut down administrative latency. Experience our integrated software modules and request custom enquiries below.
          </p>
        </div>

        {/* SECURE ANALYTICS CYCLE: CIRCLE-STYLE ORBIT DISPLAY */}
        <div className="flex flex-col gap-8">
          
          {/* Header */}
          <div className="max-w-3xl text-left flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[3px] text-red-600 font-bold">
              Software Systems
            </span>
            <h2 className="text-3xl font-black text-zinc-950 tracking-tight leading-none">
              Offered Software Suite
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed font-light mt-1">
              Explore our core suite of proprietary technologies. Hover or tap on any node to review system descriptions, capabilities, and pre-integrated features.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Beautiful Circle-style dynamic orbit layout */}
            <div className="lg:col-span-6 flex items-center justify-center relative h-[320px] md:h-[340px]">
              
              {/* Center Core Hub Orb */}
              <div className="w-24 h-24 md:w-30 md:h-30 rounded-full bg-white border border-red-600 flex flex-col items-center justify-center text-center shadow-lg relative z-20">
                <Settings className="w-5 h-5 text-red-600 animate-spin [animation-duration:10s]" />
                <span className="text-[10px] md:text-[11px] font-bold text-zinc-900 mt-1.5 leading-tight px-1">
                  IT & Software Solutions
                </span>
                <span className="text-[8px] text-zinc-400 mt-1 uppercase font-semibold">Active Suite</span>
              </div>

              {/* Dotted orbits trails */}
              <div className="absolute w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full border border-dashed border-zinc-300 pointer-events-none" />
              <div className="absolute w-[160px] h-[160px] md:w-[190px] md:h-[190px] rounded-full border border-zinc-250 pointer-events-none" />

              {/* Dynamic Modules orbit placement mapping */}
              {services.map((ser, index) => {
                const angleOffset = (360 / services.length) * index;
                const totalAngle = (angleOffset + orbitAngle) * (Math.PI / 180);
                const radiusDist = window.innerWidth < 768 ? 110 : 135;
                const coordX = radiusDist * Math.cos(totalAngle);
                const coordY = radiusDist * Math.sin(totalAngle);

                const isHovered = hoveredNodeId === ser.id;

                return (
                  <motion.div
                    key={ser.id}
                    className="absolute z-10 cursor-pointer"
                    style={{
                      left: `calc(50% + ${coordX}px)`,
                      top: `calc(50% + ${coordY}px)`
                    }}
                    onMouseEnter={() => setHoveredNodeId(ser.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => triggerEnquiry(ser.name)}
                    animate={{ scale: isHovered ? 1.15 : 1, x: "-50%", y: "-50%" }}
                  >
                    <div 
                      className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                        isHovered 
                          ? "bg-red-600 border-red-600 text-white shadow-xl" 
                          : "bg-white border-zinc-200 text-zinc-650 hover:border-zinc-400"
                      }`}
                    >
                      {ser.icon}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right: Companion services directory */}
            <div className="lg:col-span-6 flex flex-col gap-4 text-left">
              {services.map((ser) => {
                const isSelected = hoveredNodeId === ser.id;
                return (
                  <div
                    key={ser.id}
                    onMouseEnter={() => setHoveredNodeId(ser.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => triggerEnquiry(ser.name)}
                    className={`p-5 border transition-all duration-300 flex flex-col gap-3.5 cursor-pointer ${
                      isSelected 
                        ? "bg-white border-red-600 shadow-md translate-x-1.5" 
                        : "bg-white/40 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 border transition-colors ${
                          isSelected ? "bg-red-600 text-white border-red-600" : "bg-neutral-100 text-zinc-500 border-zinc-250"
                        }`}>
                          {ser.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono font-bold text-zinc-400">{ser.number}</span>
                          <h4 className="text-sm font-bold text-zinc-900 leading-snug">
                            {ser.name}
                          </h4>
                          <p className="text-xs text-zinc-405 font-light mt-0.5 leading-none">
                            {ser.subtext}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerEnquiry(ser.name);
                        }}
                        className="px-4 py-2 border border-zinc-200 hover:border-red-600 bg-zinc-50 hover:bg-red-600 text-zinc-700 hover:text-white font-sans text-[11px] font-bold uppercase transition-all"
                      >
                        Enquire
                      </button>
                    </div>

                    {/* Expandable/detailed section on hover or selection */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-zinc-100 pt-3 flex flex-col gap-2.5"
                        >
                          <p className="text-xs text-zinc-500 font-light leading-relaxed">
                            {ser.description}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
                            {ser.benefits.map((ben, bIdx) => (
                              <div key={bIdx} className="flex items-center gap-1.5 text-[10.5px] text-zinc-600 font-medium">
                                <CheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                <span>{ben}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: REDIRECT ENQUIRY FORM */}
        <div id="enquiry-form-section" className="max-w-2xl mx-auto w-full text-left">
          
          <div className="bg-white border border-zinc-200 p-6 md:p-10 shadow-sm relative">
            
            <button
              id="enquiry-help-badge"
              className="absolute top-4 right-4 bg-red-50 border border-red-150 text-red-600 text-[9px] font-mono px-3 py-1 font-bold tracking-wider"
            >
              ENQUIRY PORTAL
            </button>

            <div className="mb-6 flex flex-col gap-1.5">
              <span className="text-xs uppercase font-bold text-red-600">Immediate Request</span>
              <h3 className="text-xl md:text-2xl font-black text-zinc-900 leading-none">Register Software Enquiry</h3>
              <p className="text-xs text-zinc-410 leading-relaxed font-light mt-1">
                Fill in the coordination parameters below. Our software design hub will reach back within 2 business hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="py-10 text-center flex flex-col items-center gap-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
                <h4 className="text-lg font-bold text-zinc-900">Enquiry Registered Securely</h4>
                <p className="text-xs text-zinc-500 max-w-sm">
                  We've logged your credentials. A support liaison will touch base regarding your chosen software: <span className="font-bold text-red-600">{enquirySoftware}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="flex flex-col gap-4">
                
                {/* Name */}
                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-red-600" />
                    User Name (Required)
                  </label>
                  <input
                    type="text"
                    required
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                {/* Software Selection Dropdown */}
                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="text-[11px] font-bold text-zinc-700">Software Name Selection</label>
                  <select
                    value={enquirySoftware}
                    onChange={(e) => setEnquirySoftware(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:bg-white"
                  >
                    <option value="SAC - Smart AI Campus">SAC - Smart AI Campus</option>
                    <option value="E-Commerce">E-Commerce</option>
                  </select>
                </div>

                {/* Mobile and Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      Mobile Number (Required)
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryMobile}
                      onChange={(e) => setEnquiryMobile(e.target.value)}
                      placeholder="e.g. +91 99000-xxxxx"
                      className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-red-600" />
                      Email Address (Required)
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      placeholder="e.g. corporate@gmail.com"
                      className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Available Time Selection */}
                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-red-600" />
                    Available Time for Meeting Call
                  </label>
                  <select
                    value={enquiryTime}
                    onChange={(e) => setEnquiryTime(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:bg-white"
                  >
                    <option value="09:00 AM - 12:00 PM">Morning [09:00 AM - 12:00 PM]</option>
                    <option value="12:00 PM - 03:00 PM">Mid-Day [12:00 PM - 03:00 PM]</option>
                    <option value="03:00 PM - 06:00 PM">Evening [03:00 PM - 06:00 PM]</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold uppercase tracking-[2px] transition-all duration-300 text-center mt-3"
                >
                  Submit Software Enquiry
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
