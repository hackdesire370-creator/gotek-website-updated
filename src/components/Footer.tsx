import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Layers } from "lucide-react";
import { motion } from "motion/react";
import ScrollReveal from "./ScrollReveal";
import gotekLogo from "../assets/gotek-logo.png";

export default function Footer() {
  const socialMedias = [
    { icon: <Facebook className="w-4 h-4" />, href: "https://facebook.com", name: "Facebook" },
    { icon: <Twitter className="w-4 h-4" />, href: "https://twitter.com", name: "Twitter" },
    { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com", name: "LinkedIn" },
    { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com", name: "Instagram" }
  ];

  return (
    <footer 
      id="gotek-footer" 
      className="relative bg-white select-none z-10 px-6 py-20 md:py-24 border-t border-zinc-200 overflow-hidden text-left"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-16 relative z-10">
        
        {/* Desktop Layout - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
          
          {/* COLUMN 1: Company Brief */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <Link to="/" className="inline-block w-fit" data-cursor="pointer">
                <img
                  src={gotekLogo}
                  alt="GOTEK Printing & Gifting Logo"
                  className="h-16 w-auto object-contain mix-blend-multiply bg-transparent"
                />
              </Link>
            </div>
            
            <p className="font-space text-xs text-zinc-500 leading-relaxed font-light max-w-sm">
              Gotek provides custom ID cards, RFID solutions, corporate lanyards, and printing services for businesses. Our in-house production ensures quality, affordability, and dependable service for every order.
            </p>
          </div>

          {/* COLUMN 2: Head Office & Factory Info */}
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[9px] text-accent tracking-[3px] uppercase font-bold">
              PRODUCTION CENTER
            </span>
            <h4 className="font-display text-sm font-black text-zinc-950 uppercase tracking-tight">
              CORPORATE OFFICE CUM FACTORY
            </h4>

            <div className="flex flex-col gap-4">
              {/* Postal Address */}
              <div className="flex gap-3 hover:text-accent transition-colors">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light">
                  O.No. 166/1, N.N. 317/1, Konnur High Road, Ayanavaram, Chennai-600023. Landmark: Noor Hotel Bus Stop.
                </p>
              </div>

              {/* Telephone numbers */}
              <div className="flex gap-3 text-zinc-500 font-mono text-xs">
                <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 font-bold">
                  <a href="tel:04442160975" className="hover:text-accent transition-colors">044 – 4216 0975</a>
                  <a href="tel:+919840330975" className="hover:text-accent transition-colors">+91 9840330975</a>
                </div>
              </div>

              {/* Email address Link */}
              <div className="flex gap-3 text-zinc-500 font-mono text-xs">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <a href="mailto:gotekid@gmail.com" className="hover:text-accent font-bold transition-colors">
                  gotekid@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Product Directory Grid Map */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Sub-column 3A: ID Solutions / IT */}
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[9px] text-zinc-400 tracking-[2px] uppercase font-bold">
                ID SOLUTIONS
              </span>
              <div className="flex flex-col gap-2.5 font-mono text-[10px] text-zinc-500 uppercase font-semibold">
                <Link to="/it-solutions" className="hover:text-accent transition-colors">Smart Campus (SAC)</Link>
                <Link to="/it-solutions" className="hover:text-accent transition-colors">E-Commerce</Link>
              </div>
            </div>

            {/* Sub-column 3B: Manufacturing Hardware */}
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[9px] text-zinc-400 tracking-[2px] uppercase font-bold">
                HARDWARE
              </span>
              <div className="flex flex-col gap-2.5 font-mono text-[10px] text-zinc-500 uppercase font-semibold">
                <Link to="/manufacturing" className="hover:text-accent transition-colors">ID Cards</Link>
                <Link to="/manufacturing" className="hover:text-accent transition-colors">RFID Cards</Link>
                <Link to="/manufacturing" className="hover:text-accent transition-colors">NFC Cards</Link>
                <Link to="/manufacturing" className="hover:text-accent transition-colors">Lanyards & Tags</Link>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SOCIALS & COPYRIGHT */}
        <div className="border-t border-zinc-250 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-mono text-[9px] text-zinc-400 uppercase font-light">
            © 2026 GOTEK SYSTEMS LIMITED. ALL CODES SECURED. DIGITAL MANUFACTURING INTEGRITY RECOGNIZED.
          </span>

          {/* Spring Scaling social icons */}
          <div className="flex items-center gap-3">
            {socialMedias.map((s) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-zinc-200 text-zinc-550 hover:border-accent hover:text-white hover:bg-accent flex items-center justify-center transition-colors rounded-none"
                whileHover={{ scale: 1.15, rotate: 6 }}
                transition={{ type: "spring", stiffness: 450, damping: 12 }}
                title={s.name}
                data-cursor="pointer"
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
