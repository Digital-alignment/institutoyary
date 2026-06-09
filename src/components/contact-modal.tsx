"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Youtube, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [email, setEmail] = useState("");
    const [mounted, setMounted] = useState(false);
    const { settings } = useSiteSettings();
    const social = settings.social_links;

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription logic
        console.log("Subscribing email:", email);
        setEmail("");
        // Optional: Show success message
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[101]"
                    >
                        <div className="bg-[#f8f2d8] rounded-3xl shadow-2xl overflow-hidden border border-white/40 relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-3 top-3 text-[#941c1d]/50 hover:text-[#941c1d] transition-colors p-2 hover:bg-[#941c1d]/10 rounded-full z-20"
                            >
                                <X className="w-5 h-5" />
                                <span className="sr-only">Close</span>
                            </button>

                            {/* Content */}
                            <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-6 relative">
                                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                                
                                <div className="space-y-2 relative z-10">
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#941c1d]">Fale Conosco</h2>
                                    <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                                        Estamos aqui para ouvir você. Entre em contato ou acompanhe nossas novidades.
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-4 relative z-10">
                                    <a
                                        href={`mailto:${social.email || 'contato@institutoyary.org'}`}
                                        className="w-12 h-12 rounded-full bg-white border border-[#941c1d]/20 flex items-center justify-center text-[#941c1d] hover:bg-[#941c1d] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                                        title="Email"
                                    >
                                        <Mail className="w-5 h-5" />
                                    </a>
                                    
                                    {social.instagram && (
                                        <a
                                            href={social.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-white border border-[#941c1d]/20 flex items-center justify-center text-[#941c1d] hover:bg-[#941c1d] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                                            title="Instagram"
                                        >
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    )}

                                    {social.youtube && (
                                        <a
                                            href={social.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-white border border-[#941c1d]/20 flex items-center justify-center text-[#941c1d] hover:bg-[#941c1d] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                                            title="YouTube"
                                        >
                                            <Youtube className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-[#941c1d]/10 relative z-10" />

                                {/* Newsletter */}
                                <div className="w-full space-y-3 relative z-10 bg-white/40 p-5 rounded-2xl border border-white/60 shadow-sm">
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-[#941c1d]">Assine nossa Newsletter</h3>
                                        <p className="text-xs text-gray-500">Receba atualizações sobre nossos projetos e ações.</p>
                                    </div>
                                    <form onSubmit={handleSubmit} className="flex relative mt-2">
                                        <input
                                            type="email"
                                            placeholder="Seu e-mail..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-4 pr-12 py-3 text-sm rounded-full bg-white border border-[#941c1d]/20 focus:outline-none focus:border-[#941c1d] focus:ring-2 focus:ring-[#941c1d]/20 transition-all text-gray-700 placeholder-gray-400 shadow-inner"
                                        />
                                        <button 
                                            type="submit" 
                                            className="absolute right-1 top-1 bottom-1 aspect-square bg-[#941c1d] text-white rounded-full flex items-center justify-center hover:bg-[#7a1617] transition-colors shadow-md group"
                                        >
                                            <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
